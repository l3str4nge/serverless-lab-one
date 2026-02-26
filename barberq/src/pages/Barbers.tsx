import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Barber {
  businessId: string
  name: string
}

export default function Barbers() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/barbers')
      .then((res) => res.json())
      .then((data) => setBarbers(data.barbers ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <Link to="/barberq" className="text-2xl font-black tracking-widest text-[#c9a84c] uppercase">
          BarberQ
        </Link>
        <button
          onClick={logout}
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Log out
        </button>
      </div>

      <h1 className="text-3xl font-black text-white mb-2">Available barbers</h1>
      <p className="text-zinc-400 text-sm mb-10">Book your next appointment</p>

      {loading ? (
        <p className="text-zinc-500 text-sm">Loading...</p>
      ) : barbers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-zinc-800 rounded-2xl">
          <p className="text-zinc-500 text-lg font-semibold mb-2">No barbers yet</p>
          <p className="text-zinc-600 text-sm">Check back soon — barbers are on their way.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {barbers.map((b) => (
            <li
              key={b.businessId}
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5"
            >
              <p className="font-semibold text-white">{b.name}</p>
              <button
                onClick={() => navigate(`/barberq/barbers/${b.businessId}`)}
                className="bg-[#c9a84c] hover:bg-[#e2c070] text-zinc-950 font-bold px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Book
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
