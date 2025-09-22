import { PrismaClient } from '@prisma/client'
import botsData from '../mock/bots-data.json'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding bots...')
  
  // Limpiar la tabla primero (opcional)
  await prisma.bots.deleteMany()
  
  // Insertar los datos del JSON
  for (const bot of botsData) {
    await prisma.bots.create({
      data: {
        name: bot.name,
        pos1: bot.pos1,
        pos2: bot.pos2,
        level: bot.level,
      },
    })
  }
  
  console.log('Seeding bots completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })