import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

interface LoginFormProps {
  type: 'client' | 'business'
}

function LoginForm({ type }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isClient = type === 'client'
  const label = isClient ? 'client' : 'barber'
  const registerPath = isClient ? '/barberq/register/client' : '/barberq/register/business'
  const switchPath = isClient ? '/barberq/login/business' : '/barberq/login/client'
  const switchLabel = isClient ? 'Log in as a barber' : 'Log in as a client'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // TODO: connect to API Gateway → Lambda → Cognito
      console.log('Login:', { type, email, password })
      await new Promise((r) => setTimeout(r, 800)) // placeholder
      setError('Backend not connected yet.')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link to="/barberq" className="block text-center text-2xl font-black tracking-widest text-[#c9a84c] uppercase mb-10">
          BarberQ
        </Link>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
          <p className="text-zinc-400 text-sm mb-8">Log in to your {label} account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
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
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] hover:bg-[#e2c070] disabled:opacity-50 text-zinc-950 font-bold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="text-zinc-500 text-sm text-center mt-6">
            Don't have an account?{' '}
            <Link to={registerPath} className="text-[#c9a84c] hover:text-[#e2c070] transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        {/* Switch account type */}
        <p className="text-center text-zinc-600 text-sm mt-6">
          <Link to={switchPath} className="hover:text-zinc-400 transition-colors">
            {switchLabel} →
          </Link>
        </p>

      </div>
    </div>
  )
}

export default LoginForm
