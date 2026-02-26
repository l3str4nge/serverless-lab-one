import { useTranslation } from 'react-i18next'

const projects = [
  {
    name: 'serverless-lab-one',
    descriptionKey: 'projects.serverlessLabOne',
    tags: ['React', 'TypeScript', 'AWS', 'S3', 'CloudFront', 'Serverless', 'Terraform'],
    url: 'https://github.com/l3str4nge/serverless-lab-one',
  },
  {
    name: 'barberq',
    descriptionKey: 'projects.barberq',
    tags: ['React', 'TypeScript', 'Python', 'AWS', 'Cognito', 'Lambda', 'API Gateway', 'Terraform'],
    url: '/barberq',
  },
  {
    name: 'kidnoti',
    descriptionKey: 'projects.kidnoti',
    tags: ['Python', 'AWS', 'Serverless', 'Bedrock', 'SNS', 'Web Scraping'],
    url: null,
  },
]

function Projects() {
  const { t } = useTranslation('portfolio')

  return (
    <section id="projects" className="max-w-3xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">{t('projects.title')}</h2>
      <div className="space-y-8">
        {projects.map((project) => (
          <div
            key={project.name}
            className="border border-gray-200 dark:border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {project.name}
              </h3>
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
                >
                  {t('projects.view')}
                </a>
              ) : (
                <span className="text-sm text-gray-400 dark:text-gray-600 whitespace-nowrap">
                  {t('projects.tbd')}
                </span>
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t(project.descriptionKey)}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Projects
