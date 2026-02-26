import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import ClientLogin from './pages/ClientLogin'
import BusinessLogin from './pages/BusinessLogin'
import ClientRegister from './pages/ClientRegister'
import BusinessRegister from './pages/BusinessRegister'
import Barbers from './pages/Barbers'
import BusinessDashboard from './pages/BusinessDashboard'
import AddService from './pages/AddService'
import SetAvailability from './pages/SetAvailability'
import BarberProfile from './pages/BarberProfile'
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
        <Route path="/barbers/:businessId" element={<ProtectedRoute><BarberProfile /></ProtectedRoute>} />
        <Route path="/dashboard/business" element={<ProtectedRoute><BusinessDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/business/add-service" element={<ProtectedRoute><AddService /></ProtectedRoute>} />
        <Route path="/dashboard/business/set-availability" element={<ProtectedRoute><SetAvailability /></ProtectedRoute>} />
      </Routes>
    </div>
    </AuthProvider>
  )
}

export default BarberQApp
