const paintings: { title: string; src: string }[] = [
  // Add paintings here, e.g.:
  // { title: 'Sunset', src: '/paintings/sunset.jpg' },
]

function Paintings() {
  return (
    <section id="paintings" className="max-w-3xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Paintings</h2>
      <p className="text-gray-500 dark:text-gray-400 text-lg mb-12">
        A selection of my canvas work.
      </p>
      {paintings.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-600 italic">Coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {paintings.map((painting) => (
            <div key={painting.title} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
              <img src={painting.src} alt={painting.title} className="w-full object-cover" />
              <p className="text-sm text-gray-600 dark:text-gray-400 px-4 py-3">{painting.title}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Paintings
