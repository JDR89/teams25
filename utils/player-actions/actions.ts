import prisma from '@/lib/prisma'

export const getAllPlayers = async () => {
  const players = await prisma.jugadores.findMany({
    orderBy: {
      name: 'asc'
    }
  })
  return players
}

// Agregar action para obtener todos los bots
export const getAllBots = async () => {
  const bots = await prisma.bots.findMany({
    orderBy: {
      name: 'asc'
    }
  })
  return bots
}


export type SeleccionadoData = {
  id: number;
  name: string;
  pos1: string;
  pos2: string;
  level: number;
  isBot: boolean;
}

// Action para guardar múltiples seleccionados
export const saveSeleccionados = async (seleccionados: SeleccionadoData[]) => {
  try {
    // Validación: mínimo 10 seleccionados
    if (seleccionados.length < 10) {
      return {
        success: false,
        error: 'Selección insuficiente',
        details: `Se requieren al menos 10 jugadores/bots. Recibidos: ${seleccionados.length}`
      };
    }

    // Separar jugadores y bots
    const jugadores = seleccionados.filter(item => !item.isBot);
    const bots = seleccionados.filter(item => item.isBot);
    
    // Extraer solo los IDs
    const jugadoresIds = jugadores.map(j => j.id);
    const botsIds = bots.map(b => b.id);
    
    // Limpiar selecciones anteriores (opcional)
    await prisma.seleccionados.deleteMany();
    
    // Guardar los nuevos seleccionados
    const result = await prisma.seleccionados.create({
      data: {
        jugadores_ids: JSON.stringify(jugadoresIds),
        bots_ids: JSON.stringify(botsIds)
      }
    });
    
    return {
      success: true,
      data: result,
      message: `Se guardaron ${seleccionados.length} seleccionados correctamente`
    };
  } catch (error) {
    console.error('Error al guardar seleccionados:', error);
    return {
      success: false,
      error: 'Error al guardar en la base de datos',
      details: error
    };
  }
}

// Action para obtener todos los seleccionados con detalles completos
export const getAllSeleccionados = async () => {
  try {
    const seleccionados = await prisma.seleccionados.findMany({
      orderBy: {
        fecha_seleccion: 'desc'
      }
    });
    
    // Para cada registro, obtener los detalles completos
    const seleccionadosConDetalles = await Promise.all(
      seleccionados.map(async (seleccion) => {
        const jugadoresIds = JSON.parse(seleccion.jugadores_ids) as number[];
        const botsIds = JSON.parse(seleccion.bots_ids) as number[];
        
        // Obtener detalles de jugadores
        const jugadores = await prisma.jugadores.findMany({
          where: {
            id: {
              in: jugadoresIds
            }
          }
        });
        
        // Obtener detalles de bots
        const bots = await prisma.bots.findMany({
          where: {
            id: {
              in: botsIds
            }
          }
        });
        
        return {
          id: seleccion.id,
          fecha_seleccion: seleccion.fecha_seleccion,
          jugadores,
          bots,
          total: jugadores.length + bots.length
        };
      })
    );
    
    return {
      success: true,
      data: seleccionadosConDetalles
    };
  } catch (error) {
    console.error('Error al obtener seleccionados:', error);
    return {
      success: false,
      error: 'Error al obtener los datos',
      details: error
    };
  }
}

// Action para limpiar todas las selecciones
export const clearAllSeleccionados = async () => {
  try {
    const result = await prisma.seleccionados.deleteMany();
    
    return {
      success: true,
      count: result.count,
      message: `Se eliminaron ${result.count} seleccionados`
    };
  } catch (error) {
    console.error('Error al limpiar seleccionados:', error);
    return {
      success: false,
      error: 'Error al limpiar los datos',
      details: error
    };
  }
}

