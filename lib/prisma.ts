import { PrismaClient } from '@prisma/client';

// Agrega una instancia de Prisma a la variable global de Node.js
// para que se pueda reutilizar durante el desarrollo.
declare global {
  var prisma: PrismaClient | undefined;
}

// Crea una instancia de Prisma o reutiliza la existente.
const prisma = global.prisma || new PrismaClient();

// Si no estás en producción, guarda la instancia en la variable global.
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
