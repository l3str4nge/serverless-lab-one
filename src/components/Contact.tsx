function Contact() {
  return (
    <section id="contact" className="max-w-3xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Contact</h2>
      <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
        Have a project in mind or just want to say hi? Reach out.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="mailto:mtszzwdzk@gmail.com"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-center"
        >
          mtszzwdzk@gmail.com
        </a>
        <a
          href="https://github.com/l3str4nge"
          target="_blank"
          rel="noreferrer"
          className="border border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors text-center"
        >
          GitHub
        </a>
      </div>
    </section>
  )
}

export default Contact
