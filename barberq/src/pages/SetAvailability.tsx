import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface DaySchedule {
  day: string
  label: string
  isAvailable: boolean
  startTime: string
  endTime: string
}

const DEFAULT_DAYS: DaySchedule[] = [
  { day: 'MON', label: 'Monday',    isAvailable: false, startTime: '09:00', endTime: '18:00' },
  { day: 'TUE', label: 'Tuesday',   isAvailable: false, startTime: '09:00', endTime: '18:00' },
  { day: 'WED', label: 'Wednesday', isAvailable: false, startTime: '09:00', endTime: '18:00' },
  { day: 'THU', label: 'Thursday',  isAvailable: false, startTime: '09:00', endTime: '18:00' },
  { day: 'FRI', label: 'Friday',    isAvailable: false, startTime: '09:00', endTime: '18:00' },
  { day: 'SAT', label: 'Saturday',  isAvailable: false, startTime: '09:00', endTime: '18:00' },
  { day: 'SUN', label: 'Sunday',    isAvailable: false, startTime: '09:00', endTime: '18:00' },
]

function generateTimeOptions(): string[] {
  const times: string[] = []
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return times
}

const TIME_OPTIONS = generateTimeOptions()

function SetAvailability() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_DAYS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/availability', {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        const saved: { day: string; startTime: string; endTime: string; isAvailable: boolean }[] =
          data.schedule ?? []
        if (saved.length === 0) return
        setSchedule((prev) =>
          prev.map((d) => {
            const match = saved.find((s) => s.day === d.day)
            return match ? { ...d, ...match } : d
          })
        )
      })
      .catch(() => {})
  }, [accessToken])

  const updateDay = (index: number, patch: Partial<DaySchedule>) => {
    setSchedule((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)))
  }

  const handleSave = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/availability', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          schedule: schedule.map(({ day, startTime, endTime, isAvailable }) => ({
            day,
            startTime,
            endTime,
            isAvailable,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? 'Failed to save availability.')
        return
      }
      navigate('/barberq/dashboard/business')
    } catch {
      setError('Something went wrong. Please try again.')
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
        <Link
          to="/barberq/dashboard/business"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          ← Back to dashboard
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black mb-8">Set availability</h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-4">
          {schedule.map((d, i) => (
            <div
              key={d.day}
              className="flex items-center gap-4"
            >
              {/* Toggle */}
              <button
                type="button"
                onClick={() => updateDay(i, { isAvailable: !d.isAvailable })}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                  d.isAvailable ? 'bg-[#c9a84c]' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    d.isAvailable ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              {/* Day label */}
              <span
                className={`w-28 text-sm font-semibold ${
                  d.isAvailable ? 'text-white' : 'text-zinc-500'
                }`}
              >
                {d.label}
              </span>

              {/* Time selects */}
              {d.isAvailable ? (
                <div className="flex items-center gap-2 flex-1">
                  <select
                    value={d.startTime}
                    onChange={(e) => updateDay(i, { startTime: e.target.value })}
                    className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-[#c9a84c] transition-colors"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <span className="text-zinc-500 text-sm">to</span>
                  <select
                    value={d.endTime}
                    onChange={(e) => updateDay(i, { endTime: e.target.value })}
                    className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-[#c9a84c] transition-colors"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="text-zinc-600 text-sm">Closed</span>
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate('/barberq/dashboard/business')}
            className="flex-1 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-bold py-3 rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-[#c9a84c] hover:bg-[#e2c070] disabled:opacity-50 text-zinc-950 font-bold py-3 rounded-lg transition-colors text-sm"
          >
            {loading ? 'Saving...' : 'Save availability'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default SetAvailability
