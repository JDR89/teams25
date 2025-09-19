import { z } from "zod"

export const formSchema = z.object({
  email: z.string().min(4, {
    message: "El email es requerido.",
  }),
  password: z.string().min(4, {
    message: "La contraseña es requerida.",
  }),
})

export type FormData = z.infer<typeof formSchema>