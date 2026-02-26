import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'

function AddService() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation('barberq')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ name, price: Number(price), durationMinutes: Number(duration) }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message ?? t('common.somethingWentWrong'))
        return
      }

      navigate('/barberq/dashboard/business')
    } catch {
      setError(t('common.somethingWentWrong'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link to="/barberq" className="text-xl font-black tracking-widest text-[#c9a84c] uppercase">
          BarberQ
        </Link>
        <Link to="/barberq/dashboard/business" className="text-sm text-zinc-400 hover:text-white transition-colors">
          {t('addService.backToDashboard')}
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-3xl font-black mb-8">{t('addService.title')}</h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">{t('addService.serviceName')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t('addService.placeholder')}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">{t('addService.price')}</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                placeholder="25"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">{t('addService.duration')}</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                min="1"
                placeholder="30"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#c9a84c] text-white rounded-lg px-4 py-3 text-sm outline-none transition-colors placeholder:text-zinc-600"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/barberq/dashboard/business')}
                className="flex-1 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-bold py-3 rounded-lg transition-colors text-sm"
              >
                {t('addService.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#c9a84c] hover:bg-[#e2c070] disabled:opacity-50 text-zinc-950 font-bold py-3 rounded-lg transition-colors text-sm"
              >
                {loading ? t('addService.saving') : t('addService.save')}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}

export default AddService
