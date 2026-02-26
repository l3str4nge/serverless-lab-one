import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'

interface Service {
  serviceId: string
  name: string
  price: number
  durationMinutes: number
}

interface Slot {
  date: string
  startTime: string
  endTime: string
}

type Step = 'services' | 'slots' | 'confirm' | 'done'

const DAY_HEADERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDateLong(dateStr: string, locale: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' })
}

// ─── Calendar ────────────────────────────────────────────────────────────────

function Calendar({
  availableDates,
  selectedDate,
  onSelectDate,
}: {
  availableDates: Set<string>
  selectedDate: string | null
  onSelectDate: (date: string) => void
}) {
  const { i18n } = useTranslation('barberq')
  const locale = i18n.language === 'pl' ? 'pl-PL' : 'en-GB'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [viewYear, setViewYear] = useState(today.getFullYear())

  const firstOfMonth = new Date(viewYear, viewMonth, 1)
  const lastOfMonth = new Date(viewYear, viewMonth + 1, 0)

  // Monday-first offset
  const startOffset = (firstOfMonth.getDay() + 6) % 7

  const cells: (Date | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= lastOfMonth.getDate(); d++) cells.push(new Date(viewYear, viewMonth, d))
  while (cells.length % 7 !== 0) cells.push(null)

  // Nav bounds: can't go before current month, can't go beyond 3 months ahead
  const canPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth()
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1)
  const canNext = new Date(viewYear, viewMonth + 1, 1) < maxMonth

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' })

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 select-none">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canPrev}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>
        <span className="font-bold text-sm capitalize">{monthLabel}</span>
        <button
          onClick={nextMonth}
          disabled={!canNext}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          ›
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map(h => (
          <div key={h} className="text-center text-xs text-zinc-600 font-semibold py-1">{h}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />

          const dateStr = toDateStr(d)
          const isPast = d.getTime() <= today.getTime()
          const isAvailable = !isPast && availableDates.has(dateStr)
          const isSelected = selectedDate === dateStr

          return (
            <button
              key={i}
              disabled={!isAvailable}
              onClick={() => onSelectDate(dateStr)}
              className={[
                'aspect-square rounded-xl text-sm font-semibold transition-colors',
                isSelected
                  ? 'bg-[#c9a84c] text-zinc-950'
                  : isAvailable
                  ? 'text-white hover:bg-zinc-800 hover:text-[#c9a84c]'
                  : 'text-zinc-700 cursor-not-allowed',
              ].join(' ')}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BarberProfile() {
  const { businessId } = useParams<{ businessId: string }>()
  const { logout, accessToken } = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('barberq')
  const locale = i18n.language === 'pl' ? 'pl-PL' : 'en-GB'

  const [step, setStep] = useState<Step>('services')
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const [slotsByDate, setSlotsByDate] = useState<Map<string, Slot[]>>(new Map())
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  const [booking, setBooking] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingId, setBookingId] = useState('')

  useEffect(() => {
    if (!businessId) return
    fetch(`/api/barbers/${businessId}/services`)
      .then((res) => res.json())
      .then((data) => setServices(data.services ?? []))
      .catch(() => {})
      .finally(() => setLoadingServices(false))
  }, [businessId])

  function handleSelectService(svc: Service) {
    setSelectedService(svc)
    setSlotsByDate(new Map())
    setSelectedDate(null)
    setSelectedSlot(null)
    setStep('slots')
    setLoadingSlots(true)
    fetch(`/api/barbers/${businessId}/slots?serviceId=${svc.serviceId}`)
      .then((res) => res.json())
      .then((data) => {
        const slots: Slot[] = data.slots ?? []
        const map = new Map<string, Slot[]>()
        for (const slot of slots) {
          const existing = map.get(slot.date) ?? []
          existing.push(slot)
          map.set(slot.date, existing)
        }
        setSlotsByDate(map)
      })
      .catch(() => {})
      .finally(() => setLoadingSlots(false))
  }

  function handleSelectSlot(slot: Slot) {
    setSelectedSlot(slot)
    setStep('confirm')
    setBookingError('')
  }

  async function handleConfirm() {
    if (!selectedService || !selectedSlot || !businessId) return
    setBooking(true)
    setBookingError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          businessId,
          serviceId: selectedService.serviceId,
          date: selectedSlot.date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setBookingError(data.message || t('common.somethingWentWrong'))
        return
      }
      setBookingId(data.bookingId)
      setStep('done')
    } catch {
      setBookingError(t('common.somethingWentWrong'))
    } finally {
      setBooking(false)
    }
  }

  const availableDates = new Set(slotsByDate.keys())
  const timeSlotsForDate = selectedDate ? (slotsByDate.get(selectedDate) ?? []) : []

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link to="/barberq" className="text-xl font-black tracking-widest text-[#c9a84c] uppercase">
          BarberQ
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/barberq/barbers')}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            {t('barberProfile.back')}
          </button>
          <button
            onClick={logout}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            {t('barberProfile.logout')}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">

        {/* Step 1: Services */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            {step === 'services' ? t('barberProfile.chooseService') : t('barberProfile.service')}
          </h2>

          {step === 'services' ? (
            loadingServices ? (
              <p className="text-zinc-500 text-sm">{t('barberProfile.loadingServices')}</p>
            ) : services.length === 0 ? (
              <p className="text-zinc-500 text-sm">{t('barberProfile.noServices')}</p>
            ) : (
              <ul className="space-y-3">
                {services.map((svc) => (
                  <li key={svc.serviceId}>
                    <button
                      onClick={() => handleSelectService(svc)}
                      className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 hover:border-[#c9a84c] rounded-2xl px-6 py-4 transition-colors text-left"
                    >
                      <div>
                        <p className="font-semibold">{svc.name}</p>
                        <p className="text-zinc-500 text-sm">{svc.durationMinutes} {t('barberProfile.min')}</p>
                      </div>
                      <p className="text-[#c9a84c] font-bold">€{svc.price.toFixed(2)}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )
          ) : (
            selectedService && (
              <div className="flex items-center justify-between bg-zinc-900 border border-[#c9a84c] rounded-2xl px-6 py-4">
                <div>
                  <p className="font-semibold">{selectedService.name}</p>
                  <p className="text-zinc-500 text-sm">{selectedService.durationMinutes} {t('barberProfile.min')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[#c9a84c] font-bold">€{selectedService.price.toFixed(2)}</p>
                  {step !== 'done' && (
                    <button
                      onClick={() => { setStep('services'); setSelectedService(null); setSelectedDate(null); setSelectedSlot(null) }}
                      className="text-xs text-zinc-500 hover:text-zinc-300"
                    >
                      {t('barberProfile.change')}
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </section>

        {/* Step 2: Calendar + time slots */}
        {(step === 'slots' || step === 'confirm' || step === 'done') && (
          <section>
            <h2 className="text-xl font-bold mb-4">
              {step === 'slots' ? t('barberProfile.pickDateTime') : t('barberProfile.dateTime')}
            </h2>

            {step === 'slots' ? (
              loadingSlots ? (
                <p className="text-zinc-500 text-sm">{t('barberProfile.loadingSlots')}</p>
              ) : availableDates.size === 0 ? (
                <p className="text-zinc-500 text-sm">{t('barberProfile.noSlots')}</p>
              ) : (
                <div className="space-y-4">
                  <Calendar
                    availableDates={availableDates}
                    selectedDate={selectedDate}
                    onSelectDate={(d) => { setSelectedDate(d); setSelectedSlot(null) }}
                  />

                  {selectedDate && (
                    <div>
                      <p className="text-sm text-zinc-400 mb-3">
                        {t('barberProfile.availableTimesOn')} <span className="text-white font-semibold">{formatDateLong(selectedDate, locale)}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {timeSlotsForDate.map((slot, i) => (
                          <button
                            key={i}
                            onClick={() => handleSelectSlot(slot)}
                            className="bg-zinc-900 border border-zinc-800 hover:border-[#c9a84c] hover:text-[#c9a84c] rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
                          >
                            {slot.startTime}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              selectedSlot && (
                <div className="flex items-center justify-between bg-zinc-900 border border-[#c9a84c] rounded-2xl px-6 py-4">
                  <p className="font-semibold">
                    {formatDateLong(selectedSlot.date, locale)} — {selectedSlot.startTime}–{selectedSlot.endTime}
                  </p>
                  {step === 'confirm' && (
                    <button
                      onClick={() => { setStep('slots'); setSelectedSlot(null) }}
                      className="text-xs text-zinc-500 hover:text-zinc-300"
                    >
                      {t('barberProfile.change')}
                    </button>
                  )}
                </div>
              )
            )}
          </section>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <section>
            <h2 className="text-xl font-bold mb-4">{t('barberProfile.confirmBooking')}</h2>
            {bookingError && (
              <p className="text-red-400 text-sm mb-4">{bookingError}</p>
            )}
            <button
              onClick={handleConfirm}
              disabled={booking}
              className="bg-[#c9a84c] hover:bg-[#e2c070] disabled:opacity-50 text-zinc-950 font-bold px-6 py-3 rounded-xl transition-colors"
            >
              {booking ? t('barberProfile.booking') : t('barberProfile.confirm')}
            </button>
          </section>
        )}

        {/* Done */}
        {step === 'done' && (
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-8 text-center">
            <p className="text-2xl font-black text-[#c9a84c] mb-2">{t('barberProfile.bookingConfirmed')}</p>
            <p className="text-zinc-400 text-sm mb-1">
              {t('barberProfile.bookingId')} <span className="text-zinc-300 font-mono">{bookingId}</span>
            </p>
            <button
              onClick={() => navigate('/barberq/barbers')}
              className="mt-6 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {t('barberProfile.backToBarbers')}
            </button>
          </section>
        )}
      </main>
    </div>
  )
}
