function About() {
  return (
    <section id="about" className="max-w-3xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">About me</h2>
      <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-4">
        I'm a Software Engineer with a passion for building scalable,
        serverless applications on AWS. I enjoy working across the entire stack —
        from crafting clean UIs to designing cloud infrastructure.
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
        Outside of work, I'm a father of two. I enjoy swimming and painting on canvas —{' '}
        <a href="#paintings" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          see my work
        </a>
        .
      </p>
    </section>
  )
}

export default About
