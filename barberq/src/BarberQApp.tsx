import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import ClientLogin from './pages/ClientLogin'
import BusinessLogin from './pages/BusinessLogin'

function BarberQApp() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/client" element={<ClientLogin />} />
        <Route path="/login/business" element={<BusinessLogin />} />
      </Routes>
    </div>
  )
}

export default BarberQApp
