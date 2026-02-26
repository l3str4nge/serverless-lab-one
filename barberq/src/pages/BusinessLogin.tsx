import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function BusinessLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/business/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message ?? 'Login failed.'); return }
      login(data.accessToken)
      navigate('/barberq/dashboard/business')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left — branding panel */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 border-r border-zinc-800 px-12 py-12">
        <Link to="/barberq" className="text-xl font-black tracking-widest text-[#c9a84c] uppercase">
          BarberQ
        </Link>

        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-4">For professionals</p>
          <h1 className="text-5xl font-black leading-tight text-white mb-6">
            BarberQ<br />
            <span className="text-[#c9a84c]">for Business</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10">
            Run your barbershop smarter. Manage bookings, set your schedule, and grow your clientele — all in one place.
          </p>

          <ul className="space-y-4">
            {[
              'Take bookings around the clock',
              'Set your weekly availability in minutes',
              'See all upcoming appointments at a glance',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 w-4 h-4 rounded-full bg-[#c9a84c] flex-shrink-0" />
                <span className="text-zinc-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} BarberQ</p>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center px-6 py-12 bg-zinc-950">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link to="/barberq" className="lg:hidden block text-center text-xl font-black tracking-widest text-[#c9a84c] uppercase mb-10">
            BarberQ for Business
          </Link>

          <h2 className="text-3xl font-black text-white mb-1">Welcome back</h2>
          <p className="text-zinc-400 text-sm mb-8">Sign in to your business account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] hover:bg-[#e2c070] disabled:opacity-50 text-zinc-950 font-bold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-zinc-500 text-sm text-center mt-6">
            No account yet?{' '}
            <Link to="/barberq/register/business" className="text-[#c9a84c] hover:text-[#e2c070] transition-colors">
              Create one
            </Link>
          </p>

          <div className="border-t border-zinc-800 mt-8 pt-6 text-center">
            <Link to="/barberq/login/client" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">
              Booking as a client instead →
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
