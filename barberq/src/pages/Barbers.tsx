import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Barbers() {
  const { logout } = useAuth()

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

      <div className="flex flex-col items-center justify-center py-24 text-center border border-zinc-800 rounded-2xl">
        <p className="text-zinc-500 text-lg font-semibold mb-2">No barbers yet</p>
        <p className="text-zinc-600 text-sm">Check back soon — barbers are on their way.</p>
      </div>
    </div>
  )
}
