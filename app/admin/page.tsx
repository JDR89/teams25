"use client"

import ProtectedRoute from '../../components/ProtectedRoute'
import { useAuth } from '../../context/AuthContext'

export default function Admin() {

    const { isAuthorized} = useAuth()

    console.log(isAuthorized)

    return (
        <ProtectedRoute>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
                <p>Esta es una página protegida.</p>
            </div>
        </ProtectedRoute>
    )
}

