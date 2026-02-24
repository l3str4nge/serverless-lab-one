import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth()
  if (!accessToken) return <Navigate to="/barberq/login/client" replace />
  return <>{children}</>
}
