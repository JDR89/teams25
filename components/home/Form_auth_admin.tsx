"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod" // Agregar esta línea
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// Importar el schema desde el archivo separado
import { formSchema, type FormData } from "@/schemas/formSchema"
import { useAuth } from '../../context/AuthContext'

// Al final del archivo, cambiar:
// export default function FormAuthAdmin() {

export function FormAuthAdmin() {
  const { isAuthorized, login, logout } = useAuth()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        login() // Usa login() en lugar de setIsAuthorized(true)
      } else {
        setError('Credenciales incorrectas')
      }
    } catch (error) {
        console.log(error)
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthorized) {
    return (
      <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg">
        <div className="text-green-600 text-xl font-semibold mb-2">✅ Autorizado</div>
        <p className="text-green-700">Acceso concedido al panel de administración</p>
        <Button 
          onClick={logout} // Cambiar a logout en lugar de setIsAuthorized(false)
          variant="outline" 
          className="mt-4"
        >
          Cerrar Sesión
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3">
            {error}
          </div>
        )}
        
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Usuario" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Contraseña" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Verificando..." : "Iniciar Sesión"}
        </Button>
      </form>
    </Form>
  )
}

// Y agregar al final:
export default FormAuthAdmin;