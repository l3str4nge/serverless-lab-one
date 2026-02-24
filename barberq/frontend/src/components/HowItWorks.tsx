const steps = [
  {
    number: '01',
    title: 'Create your account',
    description: 'Sign up as a client or a barber in under a minute.',
  },
  {
    number: '02',
    title: 'Find your barber',
    description: 'Browse nearby barbers, check their work, and pick your favourite.',
  },
  {
    number: '03',
    title: 'Book your slot',
    description: 'Pick a time that suits you and confirm instantly.',
  },
  {
    number: '04',
    title: 'Show up fresh',
    description: 'Get a reminder, walk in, and walk out looking sharp.',
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#c9a84c] text-sm font-semibold tracking-[0.3em] uppercase mb-4 text-center">
          How it works
        </p>
        <h2 className="text-4xl sm:text-5xl font-black text-center mb-20">
          Four steps to a fresh cut.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <span className="text-6xl font-black text-zinc-800 block mb-4">
                {step.number}
              </span>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center bg-zinc-900 border border-zinc-800 rounded-3xl p-16">
          <h3 className="text-4xl font-black mb-4">Ready to get started?</h3>
          <p className="text-zinc-400 mb-8 text-lg">Join thousands of clients and barbers already on BarberQ.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register/client"
              className="bg-[#c9a84c] hover:bg-[#e2c070] text-zinc-950 font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Book a barber
            </a>
            <a
              href="/register/business"
              className="border border-zinc-700 hover:border-[#c9a84c] text-zinc-300 hover:text-[#c9a84c] font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Join as a barber
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
