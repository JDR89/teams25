import { z } from "zod"

export const formSchema = z.object({
  user: z.string().min(1, {
    message: "El usuario es requerido.",
  }),
  password: z.string().min(1, {
    message: "La contraseña es requerida.",
  }),
})

export type FormData = z.infer<typeof formSchema>