import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function BarberProfile() {
  const { businessId } = useParams<{ businessId: string }>()
  const { logout, accessToken } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('services')
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
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
    setSlots([])
    setSelectedSlot(null)
    setStep('slots')
    setLoadingSlots(true)
    fetch(`/api/barbers/${businessId}/slots?serviceId=${svc.serviceId}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots ?? []))
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
        setBookingError(data.message || 'Booking failed.')
        return
      }
      setBookingId(data.bookingId)
      setStep('done')
    } catch {
      setBookingError('Something went wrong. Please try again.')
    } finally {
      setBooking(false)
    }
  }

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
            ← Back
          </button>
          <button
            onClick={logout}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        {/* Step 1: Services */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            {step === 'services' ? 'Choose a service' : 'Service'}
          </h2>

          {step === 'services' ? (
            loadingServices ? (
              <p className="text-zinc-500 text-sm">Loading services...</p>
            ) : services.length === 0 ? (
              <p className="text-zinc-500 text-sm">No services available.</p>
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
                        <p className="text-zinc-500 text-sm">{svc.durationMinutes} min</p>
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
                  <p className="text-zinc-500 text-sm">{selectedService.durationMinutes} min</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[#c9a84c] font-bold">€{selectedService.price.toFixed(2)}</p>
                  {step !== 'done' && (
                    <button
                      onClick={() => { setStep('services'); setSelectedService(null); setSelectedSlot(null) }}
                      className="text-xs text-zinc-500 hover:text-zinc-300"
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </section>

        {/* Step 2: Slots */}
        {(step === 'slots' || step === 'confirm' || step === 'done') && (
          <section>
            <h2 className="text-xl font-bold mb-4">
              {step === 'slots' ? 'Pick a time' : 'Time slot'}
            </h2>

            {step === 'slots' ? (
              loadingSlots ? (
                <p className="text-zinc-500 text-sm">Loading available slots...</p>
              ) : slots.length === 0 ? (
                <p className="text-zinc-500 text-sm">No slots available in the next 14 days.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {slots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSlot(slot)}
                      className="bg-zinc-900 border border-zinc-800 hover:border-[#c9a84c] rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
                    >
                      <span className="text-zinc-400">{formatDate(slot.date)}</span>
                      <span className="mx-2 text-zinc-600">—</span>
                      <span className="text-white">{slot.startTime}</span>
                    </button>
                  ))}
                </div>
              )
            ) : (
              selectedSlot && (
                <div className="flex items-center justify-between bg-zinc-900 border border-[#c9a84c] rounded-2xl px-6 py-4">
                  <p className="font-semibold">
                    {formatDate(selectedSlot.date)} — {selectedSlot.startTime}–{selectedSlot.endTime}
                  </p>
                  {step === 'confirm' && (
                    <button
                      onClick={() => { setStep('slots'); setSelectedSlot(null) }}
                      className="text-xs text-zinc-500 hover:text-zinc-300"
                    >
                      Change
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
            <h2 className="text-xl font-bold mb-4">Confirm booking</h2>
            {bookingError && (
              <p className="text-red-400 text-sm mb-4">{bookingError}</p>
            )}
            <button
              onClick={handleConfirm}
              disabled={booking}
              className="bg-[#c9a84c] hover:bg-[#e2c070] disabled:opacity-50 text-zinc-950 font-bold px-6 py-3 rounded-xl transition-colors"
            >
              {booking ? 'Booking...' : 'Confirm booking'}
            </button>
          </section>
        )}

        {/* Done */}
        {step === 'done' && (
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-8 text-center">
            <p className="text-2xl font-black text-[#c9a84c] mb-2">Booking confirmed!</p>
            <p className="text-zinc-400 text-sm mb-1">Booking ID: <span className="text-zinc-300 font-mono">{bookingId}</span></p>
            <button
              onClick={() => navigate('/barberq/barbers')}
              className="mt-6 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Back to barbers
            </button>
          </section>
        )}
      </main>
    </div>
  )
}
