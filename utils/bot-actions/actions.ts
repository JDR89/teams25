

import prisma from '@/lib/prisma'
export const getAllBots = async () => {
  const bots = await prisma.bots.findMany({
    orderBy: {
      name: 'asc'
    }
  })
  return bots
}