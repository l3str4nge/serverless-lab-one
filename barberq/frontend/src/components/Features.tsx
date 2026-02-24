const features = [
  {
    icon: '✂️',
    title: 'Top barbers, verified',
    description: 'Every barber on BarberQ is vetted. Browse portfolios, read reviews, and pick your perfect match.',
  },
  {
    icon: '📅',
    title: 'Instant booking',
    description: 'See real-time availability and book your slot in seconds. No back-and-forth, no phone calls.',
  },
  {
    icon: '🔔',
    title: 'Smart reminders',
    description: 'Get notified before your appointment so you never miss a cut again.',
  },
  {
    icon: '💈',
    title: 'Built for barbers',
    description: 'Manage your schedule, track clients, and grow your business — all from one place.',
  },
]

function Features() {
  return (
    <section id="features" className="py-32 px-6 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-[0.3em] uppercase mb-4 text-center">
          Why BarberQ
        </p>
        <h2 className="text-4xl sm:text-5xl font-black text-center mb-20">
          Everything you need,<br />nothing you don't.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-[#c9a84c]/40 transition-colors"
            >
              <span className="text-4xl mb-6 block">{f.icon}</span>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
