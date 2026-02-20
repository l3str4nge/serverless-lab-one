import { ThemeProvider } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import Hero from './components/Hero'
import About from './components/About'
import Resume from './components/Resume'
import Contact from './components/Contact'

function App() {
  return (
    <ThemeProvider>
      <main className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
        <ThemeToggle />
        <Hero />
        <About />
        <Resume />
        <Contact />
      </main>
    </ThemeProvider>
  )
}

export default App
