import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import ClientLogin from './pages/ClientLogin'
import BusinessLogin from './pages/BusinessLogin'
import ClientRegister from './pages/ClientRegister'
import BusinessRegister from './pages/BusinessRegister'
import Barbers from './pages/Barbers'
import BusinessDashboard from './pages/BusinessDashboard'
import AddService from './pages/AddService'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function BarberQApp() {
  return (
    <AuthProvider>
    <div className="bg-zinc-950 text-white min-h-screen">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/client" element={<ClientLogin />} />
        <Route path="/login/business" element={<BusinessLogin />} />
        <Route path="/register/client" element={<ClientRegister />} />
        <Route path="/register/business" element={<BusinessRegister />} />
        <Route path="/barbers" element={<ProtectedRoute><Barbers /></ProtectedRoute>} />
        <Route path="/dashboard/business" element={<ProtectedRoute><BusinessDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/business/add-service" element={<ProtectedRoute><AddService /></ProtectedRoute>} />
      </Routes>
    </div>
    </AuthProvider>
  )
}

export default BarberQApp
