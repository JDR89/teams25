"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
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

export default function FormAuthAdmin() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Aquí puedes hacer lo que quieras con los valores
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Usuario" {...field} />
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  )
}