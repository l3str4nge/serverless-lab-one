import { useTranslation } from 'react-i18next'

const featureKeys = [
  { icon: '✂️', key: 'verified' },
  { icon: '📅', key: 'instant' },
  { icon: '🔔', key: 'reminders' },
  { icon: '💈', key: 'forBarbers' },
] as const

function Features() {
  const { t } = useTranslation('barberq')

  return (
    <section id="features" className="py-32 px-6 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-[0.3em] uppercase mb-4 text-center">
          {t('features.badge')}
        </p>
        <h2 className="text-4xl sm:text-5xl font-black text-center mb-20">
          {t('features.title')}<br />{t('features.titleLine2')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {featureKeys.map((f) => (
            <div
              key={f.key}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-[#c9a84c]/40 transition-colors"
            >
              <span className="text-4xl mb-6 block">{f.icon}</span>
              <h3 className="text-xl font-bold text-white mb-3">{t(`features.${f.key}.title`)}</h3>
              <p className="text-zinc-400 leading-relaxed">{t(`features.${f.key}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
