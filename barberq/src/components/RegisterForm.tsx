import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

interface ClientFields {
  name: string
}

interface BusinessFields {
  businessName: string
  ownerName: string
}

interface RegisterFormProps {
  type: 'client' | 'business'
}

function RegisterForm({ type }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [clientFields, setClientFields] = useState<ClientFields>({ name: '' })
  const [businessFields, setBusinessFields] = useState<BusinessFields>({ businessName: '', ownerName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isClient = type === 'client'
  const label = isClient ? 'client' : 'barber'
  const loginPath = isClient ? '/barberq/login/client' : '/barberq/login/business'
  const switchPath = isClient ? '/barberq/register/business' : '/barberq/register/client'
  const switchLabel = isClient ? 'Register as a barber' : 'Register as a client'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!isClient) {
        setError('Business registration is not available yet.')
        return
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name: clientFields.name }),
      })

      console.log('Status:', res.status)
      const data = await res.json()
      console.log('Response:', data)

      if (!res.ok) {
        setError(data.message ?? 'Registration failed.')
        return
      }

      setError('') // clear any previous error
      alert(data.message) // e.g. "Please check your email to verify your account."
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link to="/barberq/" className="block text-center text-2xl font-black tracking-widest text-[#c9a84c] uppercase mb-10">
          BarberQ
        </Link>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h1 className="text-2xl font-black text-white mb-1">Create your account</h1>
          <p className="text-zinc-400 text-sm mb-8">Sign up as a {label}</p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {isClient ? (
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Full name</label>
                <input
                  type="text"
                  value={clientFields.name}
                  onChange={(e) => setClientFields({ name: e.target.value })}
                  required
                  placeholder="John Doe"
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Business name</label>
                  <input
                    type="text"
                    value={businessFields.businessName}
                    onChange={(e) => setBusinessFields((f) => ({ ...f, businessName: e.target.value }))}
                    required
                    placeholder="The Sharp Barber"
                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Owner name</label>
                  <input
                    type="text"
                    value={businessFields.ownerName}
                    onChange={(e) => setBusinessFields((f) => ({ ...f, ownerName: e.target.value }))}
                    required
                    placeholder="John Doe"
                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </>
            )}

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
                minLength={8}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
              />
              <p className="text-zinc-600 text-xs mt-1.5">Min. 8 characters, include uppercase and numbers.</p>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] hover:bg-[#e2c070] disabled:opacity-50 text-zinc-950 font-bold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-zinc-500 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to={loginPath} className="text-[#c9a84c] hover:text-[#e2c070] transition-colors">
              Log in
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

export default RegisterForm
