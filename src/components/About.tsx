import { useTranslation } from 'react-i18next'

function About() {
  const { t } = useTranslation('portfolio')

  return (
    <section id="about" className="max-w-3xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('about.title')}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-4">
        {t('about.p1')}
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
        {t('about.p2Start')}{' '}
        <a href="#paintings" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          {t('about.seeWork')}
        </a>
        .
      </p>
    </section>
  )
}

export default About
