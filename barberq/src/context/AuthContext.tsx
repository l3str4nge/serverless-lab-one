import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface AuthContextValue {
  accessToken: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem('barberq_access_token')
  )

  function login(token: string) {
    localStorage.setItem('barberq_access_token', token)
    setAccessToken(token)
  }

  function logout() {
    localStorage.removeItem('barberq_access_token')
    setAccessToken(null)
  }

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
