import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Hero() {
  const { t } = useTranslation('barberq')

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-[0.3em] uppercase mb-6">
          {t('hero.badge')}
        </p>
        <h1 className="text-6xl sm:text-8xl font-black tracking-tight mb-6 leading-none">
          {t('hero.headLine1')}
          <span className="block text-[#c9a84c]">{t('hero.headLine2')}</span>
        </h1>
        <p className="text-zinc-400 text-xl max-w-xl mx-auto mb-12 leading-relaxed">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/barberq/barbers"
            className="bg-[#c9a84c] hover:bg-[#e2c070] text-zinc-950 font-bold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            {t('hero.bookBarber')}
          </Link>
          <a
            href="/barberq/register/business"
            className="border border-zinc-700 hover:border-[#c9a84c] text-zinc-300 hover:text-[#c9a84c] font-bold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            {t('hero.imBarber')}
          </a>
        </div>
        <p className="text-zinc-600 text-sm mt-8">
          {t('hero.barberHint')}
        </p>
      </div>
    </section>
  )
}

export default Hero
