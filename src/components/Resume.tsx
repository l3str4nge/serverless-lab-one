const experience = [
  {
    role: 'Software Engineer',
    company: 'Adverity',
    period: '2021 — Present',
    description:
      'Building data integration and analytics platform features across frontend and backend.',
  },
]

const skills = ['TypeScript', 'React', 'Python', 'AWS', 'Serverless', 'Docker']

function Resume() {
  return (
    <section id="resume" className="max-w-3xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-white mb-12">Resume</h2>

      <div className="mb-12">
        <h3 className="text-lg font-semibold text-indigo-400 uppercase tracking-widest mb-6">
          Experience
        </h3>
        <div className="space-y-8">
          {experience.map((item) => (
            <div key={item.company} className="border-l-2 border-gray-800 pl-6">
              <div className="flex items-start justify-between gap-4 mb-1">
                <h4 className="text-white font-semibold text-lg">{item.role}</h4>
                <span className="text-gray-500 text-sm whitespace-nowrap">{item.period}</span>
              </div>
              <p className="text-indigo-400 text-sm mb-2">{item.company}</p>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-indigo-400 uppercase tracking-widest mb-6">
          Skills
        </h3>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-gray-800 text-gray-300 px-4 py-1.5 rounded-full text-sm"
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
