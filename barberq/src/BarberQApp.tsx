import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import ClientLogin from './pages/ClientLogin'
import BusinessLogin from './pages/BusinessLogin'
import ClientRegister from './pages/ClientRegister'
import BusinessRegister from './pages/BusinessRegister'

function BarberQApp() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/client" element={<ClientLogin />} />
        <Route path="/login/business" element={<BusinessLogin />} />
        <Route path="/register/client" element={<ClientRegister />} />
        <Route path="/register/business" element={<BusinessRegister />} />
      </Routes>
    </div>
  )
}

export default BarberQApp
