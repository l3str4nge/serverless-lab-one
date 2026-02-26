import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('barberq')

  const isClient = type === 'client'
  const loginPath = isClient ? '/barberq/login/client' : '/barberq/login/business'
  const switchPath = isClient ? '/barberq/register/business' : '/barberq/register/client'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = isClient ? '/api/auth/register' : '/api/auth/business/register'
      const body = isClient
        ? { email, password, name: clientFields.name }
        : { email, password, businessName: businessFields.businessName, ownerName: businessFields.ownerName }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      console.log('Status:', res.status)
      const data = await res.json()
      console.log('Response:', data)

      if (!res.ok) {
        setError(data.message ?? t('common.somethingWentWrong'))
        return
      }

      setError('')
      alert(data.message)
    } catch {
      setError(t('common.somethingWentWrong'))
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
          <h1 className="text-2xl font-black text-white mb-1">{t('register.title')}</h1>
          <p className="text-zinc-400 text-sm mb-8">
            {t(isClient ? 'register.subtitleClient' : 'register.subtitleBusiness')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {isClient ? (
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">{t('register.fullName')}</label>
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
                  <label className="block text-sm text-zinc-400 mb-1.5">{t('register.businessName')}</label>
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
                  <label className="block text-sm text-zinc-400 mb-1.5">{t('register.ownerName')}</label>
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
              <label className="block text-sm text-zinc-400 mb-1.5">{t('register.email')}</label>
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
              <label className="block text-sm text-zinc-400 mb-1.5">{t('register.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={8}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
              />
              <p className="text-zinc-600 text-xs mt-1.5">{t('register.passwordHint')}</p>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] hover:bg-[#e2c070] disabled:opacity-50 text-zinc-950 font-bold py-3 rounded-lg transition-colors"
            >
              {loading ? t('register.creatingAccount') : t('register.createAccount')}
            </button>
          </form>

          <p className="text-zinc-500 text-sm text-center mt-6">
            {t('register.alreadyHaveAccount')}{' '}
            <Link to={loginPath} className="text-[#c9a84c] hover:text-[#e2c070] transition-colors">
              {t('register.logIn')}
            </Link>
          </p>
        </div>

        {/* Switch account type */}
        <p className="text-center text-zinc-600 text-sm mt-6">
          <Link to={switchPath} className="hover:text-zinc-400 transition-colors">
            {t(isClient ? 'register.switchToBarber' : 'register.switchToClient')}
          </Link>
        </p>

      </div>
    </div>
  )
}

export default RegisterForm
