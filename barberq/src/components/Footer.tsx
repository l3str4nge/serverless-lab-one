import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation('barberq')

  return (
    <footer className="border-t border-zinc-900 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xl font-bold tracking-widest text-[#c9a84c] uppercase">
          BarberQ
        </span>
        <p className="text-zinc-600 text-sm">
          © {new Date().getFullYear()} BarberQ. {t('footer.rights')}
        </p>
        <div className="flex gap-6 text-sm text-zinc-500">
          <a href="#features" className="hover:text-white transition-colors">{t('footer.features')}</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">{t('footer.howItWorks')}</a>
          <a href="/register/business" className="hover:text-white transition-colors">{t('footer.forBarbers')}</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
