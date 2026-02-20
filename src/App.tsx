import Hero from './components/Hero'
import About from './components/About'
import Resume from './components/Resume'
import Contact from './components/Contact'

function App() {
  return (
    <main className="bg-gray-950 text-gray-100 min-h-screen">
      <Hero />
      <About />
      <Resume />
      <Contact />
    </main>
  )
}

export default App
