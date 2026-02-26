import { useTranslation } from 'react-i18next'

const stepKeys = ['step1', 'step2', 'step3', 'step4'] as const

function HowItWorks() {
  const { t } = useTranslation('barberq')

  return (
    <section id="how-it-works" className="py-32 px-6 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-[0.3em] uppercase mb-4 text-center">
          {t('howItWorks.badge')}
        </p>
        <h2 className="text-4xl sm:text-5xl font-black text-center mb-20">
          {t('howItWorks.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stepKeys.map((key, i) => (
            <div key={key} className="relative">
              <span className="text-6xl font-black text-zinc-800 block mb-4">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg font-bold text-white mb-2">{t(`howItWorks.${key}.title`)}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{t(`howItWorks.${key}.description`)}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center bg-zinc-900 border border-zinc-800 rounded-3xl p-16">
          <h3 className="text-4xl font-black mb-4">{t('howItWorks.ctaTitle')}</h3>
          <p className="text-zinc-400 mb-8 text-lg">{t('howItWorks.ctaSubtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register/client"
              className="bg-[#c9a84c] hover:bg-[#e2c070] text-zinc-950 font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              {t('howItWorks.ctaBook')}
            </a>
            <a
              href="/register/business"
              className="border border-zinc-700 hover:border-[#c9a84c] text-zinc-300 hover:text-[#c9a84c] font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              {t('howItWorks.ctaJoin')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
