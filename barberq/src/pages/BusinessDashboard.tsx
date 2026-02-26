import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Service {
  serviceId: string
  name: string
  price: number
  durationMinutes: number
}

function BusinessDashboard() {
  const { logout, accessToken } = useAuth()
  const navigate = useNavigate()
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)

  useEffect(() => {
    fetch('/api/services', {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setServices(data.services ?? []))
      .catch(() => {})
      .finally(() => setLoadingServices(false))
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

        {/* Availability section */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6">Availability</h2>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-zinc-500 mb-4">No availability set</p>
            <button
              disabled
              className="bg-[#c9a84c] disabled:opacity-40 text-zinc-950 font-bold px-5 py-2.5 rounded-lg text-sm"
            >
              Set availability
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default BusinessDashboard
