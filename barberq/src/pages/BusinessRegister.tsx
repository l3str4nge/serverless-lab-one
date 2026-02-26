import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function BusinessRegister() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const { t } = useTranslation('barberq')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/business/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, businessName, ownerName }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message ?? t('common.somethingWentWrong')); return }
      setDone(true)
    } catch {
      setError(t('common.somethingWentWrong'))
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
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#c9a84c] mb-4">{t('businessRegister.badge')}</p>
          <h1 className="text-5xl font-black leading-tight text-white mb-6">
            {t('businessRegister.title')}<br />
            <span className="text-[#c9a84c]">{t('businessRegister.titleLine2')}</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10">
            {t('businessRegister.subtitle')}
          </p>

          <ul className="space-y-4">
            {(['bullet1', 'bullet2', 'bullet3'] as const).map((key) => (
              <li key={key} className="flex items-start gap-3">
                <span className="mt-1 w-4 h-4 rounded-full bg-[#c9a84c] flex-shrink-0" />
                <span className="text-zinc-300">{t(`businessRegister.${key}`)}</span>
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

          {done ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c] flex items-center justify-center mx-auto mb-6">
                <span className="text-[#c9a84c] text-2xl">✓</span>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">{t('businessRegister.successTitle')}</h2>
              <p className="text-zinc-400 text-sm mb-6">{t('businessRegister.successText')}</p>
              <Link
                to="/barberq/login/business"
                className="inline-block bg-[#c9a84c] hover:bg-[#e2c070] text-zinc-950 font-bold px-6 py-3 rounded-lg transition-colors"
              >
                {t('businessRegister.goToSignIn')}
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-black text-white mb-1">{t('businessRegister.formTitle')}</h2>
              <p className="text-zinc-400 text-sm mb-8">{t('businessRegister.formSubtitle')}</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">{t('register.businessName')}</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    placeholder="The Sharp Barber"
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">{t('register.ownerName')}</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">{t('register.email')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@barbershop.com"
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">{t('register.password')}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
                  />
                  <p className="text-zinc-600 text-xs mt-1.5">{t('register.passwordHint')}</p>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#c9a84c] hover:bg-[#e2c070] disabled:opacity-50 text-zinc-950 font-bold py-3 rounded-lg transition-colors"
                >
                  {loading ? t('register.creatingAccount') : t('register.createAccount')}
                </button>
              </form>

              <p className="text-zinc-500 text-sm text-center mt-6">
                {t('businessRegister.alreadyHaveAccount')}{' '}
                <Link to="/barberq/login/business" className="text-[#c9a84c] hover:text-[#e2c070] transition-colors">
                  {t('businessRegister.signIn')}
                </Link>
              </p>

              <div className="border-t border-zinc-800 mt-8 pt-6 text-center">
                <Link to="/barberq/register/client" className="text-zinc-600 hover:text-zinc-400 text-sm transition-colors">
                  {t('businessRegister.switchToClient')}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  )
}
