import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Service {
  serviceId: string
  name: string
  price: number
  durationMinutes: number
}

interface DaySchedule {
  day: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface Booking {
  bookingId: string
  date: string
  startTime: string
  endTime: string
  serviceName: string
  clientId: string
}

const DAY_ORDER = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const DAY_LABELS: Record<string, string> = {
  MON: 'Mon', TUE: 'Tue', WED: 'Wed', THU: 'Thu', FRI: 'Fri', SAT: 'Sat', SUN: 'Sun',
}

function BusinessDashboard() {
  const { logout, accessToken } = useAuth()
  const navigate = useNavigate()
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [availability, setAvailability] = useState<DaySchedule[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)

  useEffect(() => {
    fetch('/api/services', {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setServices(data.services ?? []))
      .catch(() => {})
      .finally(() => setLoadingServices(false))

    fetch('/api/availability', {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setAvailability(data.schedule ?? []))
      .catch(() => {})

    fetch('/api/bookings/business', {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings ?? []))
      .catch(() => {})
      .finally(() => setLoadingBookings(false))
  }, [accessToken])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link to="/barberq" className="text-xl font-black tracking-widest text-[#c9a84c] uppercase">
          BarberQ
        </Link>
        <button
          onClick={logout}
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Log out
        </button>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <h1 className="text-3xl font-black">Business Dashboard</h1>

        {/* Services section */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Services</h2>
            <button
              onClick={() => navigate('/barberq/dashboard/business/add-service')}
              className="bg-[#c9a84c] hover:bg-[#e2c070] text-zinc-950 font-bold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Add service
            </button>
          </div>

          {loadingServices ? (
            <p className="text-zinc-500 text-sm">Loading...</p>
          ) : services.length === 0 ? (
            <p className="text-zinc-500 text-sm">No services yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {services.map((s) => (
                <li key={s.serviceId} className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-zinc-500 text-sm">{s.durationMinutes} min</p>
                  </div>
                  <p className="text-[#c9a84c] font-bold">€{s.price.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Upcoming bookings section */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6">Upcoming bookings</h2>

          {loadingBookings ? (
            <p className="text-zinc-500 text-sm">Loading...</p>
          ) : bookings.length === 0 ? (
            <p className="text-zinc-500 text-sm">No upcoming bookings.</p>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {bookings.map((b) => (
                <li key={b.bookingId} className="py-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-400">{b.date}</p>
                    <p className="font-semibold">{b.startTime}–{b.endTime}</p>
                  </div>
                  <p className="font-semibold self-center">{b.serviceName}</p>
                  <p className="text-zinc-500 self-center font-mono truncate">{b.clientId.slice(0, 12)}…</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Availability section */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Availability</h2>
            <button
              onClick={() => navigate('/barberq/dashboard/business/set-availability')}
              className="bg-[#c9a84c] hover:bg-[#e2c070] text-zinc-950 font-bold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Set availability
            </button>
          </div>

          {(() => {
            const activeDays = DAY_ORDER
              .map((d) => availability.find((a) => a.day === d && a.isAvailable))
              .filter(Boolean) as DaySchedule[]

            return activeDays.length === 0 ? (
              <p className="text-zinc-500 text-sm">No availability set.</p>
            ) : (
              <ul className="divide-y divide-zinc-800">
                {activeDays.map((d) => (
                  <li key={d.day} className="flex items-center justify-between py-3">
                    <span className="font-semibold">{DAY_LABELS[d.day]}</span>
                    <span className="text-zinc-400 text-sm">{d.startTime} – {d.endTime}</span>
                  </li>
                ))}
              </ul>
            )
          })()}
        </section>
      </main>
    </div>
  )
}

export default BusinessDashboard
