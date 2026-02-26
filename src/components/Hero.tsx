import { useTranslation } from 'react-i18next'

function Hero() {
  const { t } = useTranslation('portfolio')

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
        {t('hero.welcome')}
      </p>
      <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 dark:text-white mb-6">
        {t('hero.name')}
      </h1>
      <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 mb-10 max-w-xl">
        {t('hero.subtitle')}
      </p>
      <div className="flex gap-4">
        <a
          href="#projects"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {t('hero.viewWork')}
        </a>
        <a
          href="#contact"
          className="border border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {t('hero.contactMe')}
        </a>
      </div>
    </section>
  )
}

export default Hero
