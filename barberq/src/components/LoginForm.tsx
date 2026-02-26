import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'

interface LoginFormProps {
  type: 'client' | 'business'
}

function LoginForm({ type }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation('barberq')

  const isClient = type === 'client'
  const registerPath = isClient ? '/barberq/register/client' : '/barberq/register/business'
  const switchPath = isClient ? '/barberq/login/business' : '/barberq/login/client'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = isClient ? '/api/auth/login' : '/api/auth/business/login'

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message ?? t('common.somethingWentWrong'))
        return
      }

      login(data.accessToken)
      navigate(isClient ? '/barberq/barbers' : '/barberq/dashboard/business')
    } catch {
      setError(t('common.somethingWentWrong'))
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
          <h1 className="text-2xl font-black text-white mb-1">{t('login.title')}</h1>
          <p className="text-zinc-400 text-sm mb-8">
            {t(isClient ? 'login.subtitleClient' : 'login.subtitleBusiness')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">{t('login.email')}</label>
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
              <label className="block text-sm text-zinc-400 mb-1.5">{t('login.password')}</label>
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
              {loading ? t('login.loggingIn') : t('login.logIn')}
            </button>
          </form>

          <p className="text-zinc-500 text-sm text-center mt-6">
            {t('login.noAccount')}{' '}
            <Link to={registerPath} className="text-[#c9a84c] hover:text-[#e2c070] transition-colors">
              {t('login.signUp')}
            </Link>
          </p>
        </div>

        {/* Switch account type */}
        <p className="text-center text-zinc-600 text-sm mt-6">
          <Link to={switchPath} className="hover:text-zinc-400 transition-colors">
            {t(isClient ? 'login.switchToBarber' : 'login.switchToClient')}
          </Link>
        </p>

      </div>
    </div>
  )
}

export default LoginForm
