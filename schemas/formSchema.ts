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

// Schema para agregar jugador
export const playerSchema = z.object({
  name: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(20, { message: "El nombre no puede exceder 20 caracteres" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: "El nombre solo puede contener letras y espacios" }),
  
  pos1: z.enum(["del", "med", "def"], {
    message: "Selecciona una posición principal válida"
  }),
  
  pos2: z.enum(["del", "med", "def"], {
    message: "Selecciona una posición secundaria válida"
  }),
  
  level: z.number()
    .min(80, { message: "El nivel mínimo es 80" })
    .max(99, { message: "El nivel máximo es 99" })
    .int({ message: "El nivel debe ser un número entero" })
})

export type PlayerFormData = z.infer<typeof playerSchema>