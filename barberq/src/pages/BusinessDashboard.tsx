import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function BusinessDashboard() {
  const { logout } = useAuth()

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
          <h2 className="text-xl font-bold mb-6">Services</h2>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-zinc-500 mb-4">No services yet</p>
            <button
              disabled
              className="bg-[#c9a84c] disabled:opacity-40 text-zinc-950 font-bold px-5 py-2.5 rounded-lg text-sm"
            >
              Add service
            </button>
          </div>
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
