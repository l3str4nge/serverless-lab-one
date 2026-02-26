import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageToggle from '../../../src/components/LanguageToggle'

function Navbar() {
  const { t } = useTranslation('barberq')

  return (
    <nav className="fixed top-0 w-full z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/barberq/" className="text-xl font-bold tracking-widest text-[#c9a84c] uppercase">
          BarberQ
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle variant="dark" />
          <Link
            to="/barberq/login/client"
            className="text-sm border border-zinc-700 hover:border-zinc-400 text-zinc-300 hover:text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {t('nav.loginClient')}
          </Link>
          <Link
            to="/barberq/login/business"
            className="text-sm bg-[#c9a84c] hover:bg-[#e2c070] text-zinc-950 font-bold px-4 py-2 rounded-lg transition-colors"
          >
            {t('nav.loginBarber')}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
