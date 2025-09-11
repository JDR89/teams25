'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  isAuthorized: boolean
  setIsAuthorized: (authorized: boolean) => void
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState(false)

  const login = () => {
    setIsAuthorized(true)
  }

  const logout = () => {
    setIsAuthorized(false)
  }

  return (
    <AuthContext.Provider value={{
      isAuthorized,
      setIsAuthorized,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}