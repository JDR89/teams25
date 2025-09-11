'use client'

import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthorized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthorized) {
      router.push('/') // Redirige al login si no está autorizado
    }
  }, [isAuthorized, router])

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Acceso denegado. Redirigiendo...</p>
      </div>
    )
  }

  return <>{children}</>
}