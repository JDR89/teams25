import prisma from '@/lib/prisma'

export const getAllPlayers = async () => {
  const players = await prisma.jugadores.findMany({
    orderBy: {
      name: 'asc'
    }
  })
  return players
}