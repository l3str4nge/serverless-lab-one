function Footer() {
  return (
    <footer className="border-t border-zinc-900 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xl font-bold tracking-widest text-[#c9a84c] uppercase">
          BarberQ
        </span>
        <p className="text-zinc-600 text-sm">
          © {new Date().getFullYear()} BarberQ. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-zinc-500">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="/register/business" className="hover:text-white transition-colors">For barbers</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
