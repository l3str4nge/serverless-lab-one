import { useTranslation } from 'react-i18next'

const experience = [
  {
    role: 'Python Developer',
    company: 'Adverity',
    period: 'Jan 2022 — Present',
    descriptionKey: 'resume.adverity',
    links: [],
  },
  {
    role: 'Python Developer',
    company: 'Saleor Commerce',
    period: 'Sep 2021 — May 2022',
    descriptionKey: 'resume.saleor',
    links: [
      { label: 'github.com/saleor/saleor', url: 'https://github.com/saleor/saleor' },
      { label: 'github.com/L3str4nge', url: 'https://github.com/L3str4nge' },
    ],
  },
  {
    role: 'Python Developer',
    company: 'XCaliber',
    period: 'Sep 2020 — Oct 2021',
    descriptionKey: 'resume.xcaliber',
    links: [],
  },
  {
    role: 'Software Engineer',
    company: 'Bombardier',
    period: 'Oct 2018 — Sep 2020',
    descriptionKey: 'resume.bombardier',
    links: [],
  },
  {
    role: 'Python Developer',
    company: 'Saint-Gobain',
    period: 'Nov 2016 — Oct 2018',
    descriptionKey: 'resume.saintGobain',
    links: [],
  },
  {
    role: 'Intern',
    company: 'Mikster Sp. z o.o.',
    period: 'Aug 2016',
    descriptionKey: 'resume.mikster',
    links: [],
  },
]

const skills = ['Python', 'Django', 'AWS', 'Serverless', 'Docker']

function Resume() {
  const { t } = useTranslation('portfolio')

  return (
    <section id="resume" className="max-w-3xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">{t('resume.title')}</h2>

      <div className="mb-12">
        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6">
          {t('resume.experience')}
        </h3>
        <div className="space-y-8">
          {experience.map((item) => (
            <div key={item.company} className="border-l-2 border-gray-200 dark:border-gray-800 pl-6">
              <div className="flex items-start justify-between gap-4 mb-1">
                <h4 className="text-gray-900 dark:text-white font-semibold text-lg">{item.role}</h4>
                <span className="text-gray-400 dark:text-gray-500 text-sm whitespace-nowrap">{item.period}</span>
              </div>
              <p className="text-indigo-600 dark:text-indigo-400 text-sm mb-2">{item.company}</p>
              {item.descriptionKey && <p className="text-gray-500 dark:text-gray-400 mb-2">{t(item.descriptionKey)}</p>}
              {item.links.length > 0 && (
                <div className="flex flex-col gap-1 mt-2">
                  {item.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-indigo-500 hover:text-indigo-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-6">
          {t('resume.skills')}
        </h3>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Resume
