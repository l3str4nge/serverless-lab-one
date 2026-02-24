function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-bold tracking-widest text-[#c9a84c] uppercase">
          BarberQ
        </span>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="text-sm text-zinc-300 hover:text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Log in
          </a>
          <a
            href="/register/client"
            className="text-sm bg-[#c9a84c] hover:bg-[#e2c070] text-zinc-950 font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Get started
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
