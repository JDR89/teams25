import { PrismaClient } from '@prisma/client'
import playersData from '../mock/players-data.json'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding jugadores...')
  
  // Limpiar la tabla primero (opcional)
  await prisma.jugadores.deleteMany()
  
  // Insertar los datos del JSON
  for (const player of playersData) {
    await prisma.jugadores.create({
      data: {
        name: player.name,
        pos1: player.pos1,
        pos2: player.pos2,
        level: player.level,
        selected: false,        // Valor por defecto
        captain: false,         // Valor por defecto
        captain_count: 0,       // Valor por defecto
        isBot: false,          // Valor por defecto para jugadores
      },
    })
  }
  
  console.log('Seeding jugadores completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })