import prisma from '@/lib/prisma'
import type { Player } from '@/utils/teams'

export type SeleccionadoData = {
  id: number;
  name: string;
  pos1: string;
  pos2: string;
  level: number;
  isBot: boolean;
}

export const getAllPlayers = async (): Promise<Player[]> => {
  const rows = await prisma.jugadores.findMany({
    orderBy: { name: 'asc' }
  })

  const isPos = (pos: string): pos is Player['pos1'] =>
    pos === 'del' || pos === 'med' || pos === 'def'

  return rows.map(r => ({
    id: r.id,
    name: r.name,
    pos1: isPos(r.pos1) ? r.pos1 : 'med',
    pos2: isPos(r.pos2) ? r.pos2 : 'med',
    level: r.level,
    isBot: r.isBot ?? false,
  }))
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


// Action para agregar un nuevo jugador
export const addPlayer = async (playerData: {
  name: string;
  pos1: string;
  pos2: string;
  level: number;
}) => {
  try {
    // Validaciones
    if (!playerData.name.trim()) {
      return {
        success: false,
        error: 'El nombre es requerido'
      };
    }

    if (playerData.level < 80 || playerData.level > 99) {
      return {
        success: false,
        error: 'El nivel debe estar entre 80 y 100'
      };
    }

    const validPositions = ['del', 'med', 'def'];
    if (!validPositions.includes(playerData.pos1) || !validPositions.includes(playerData.pos2)) {
      return {
        success: false,
        error: 'Las posiciones deben ser: del, med o def'
      };
    }

    // Verificar si ya existe un jugador con ese nombre
    const existingPlayer = await prisma.jugadores.findFirst({
      where: {
        name: playerData.name.trim()
      }
    });

    if (existingPlayer) {
      return {
        success: false,
        error: 'Ya existe un jugador con ese nombre'
      };
    }

    // Crear el jugador
    const newPlayer = await prisma.jugadores.create({
      data: {
        name: playerData.name.trim(),
        pos1: playerData.pos1,
        pos2: playerData.pos2,
        level: playerData.level,
        isBot: false
      }
    });

    return {
      success: true,
      data: newPlayer,
      message: `Jugador ${newPlayer.name} agregado exitosamente`
    };

  } catch (error) {
    console.error('Error al agregar jugador:', error);
    return {
      success: false,
      error: 'Error al guardar en la base de datos',
      details: error
    };
  }
};


export const getPlayerByID = async (id: number): Promise<Player | null> => {
  try {
    const r = await prisma.jugadores.findUnique({ where: { id } });
    if (!r) return null;

    const isPos = (pos: string): pos is Player['pos1'] => (
      pos === 'del' || pos === 'med' || pos === 'def'
    );

    return {
      id: r.id,
      name: r.name,
      pos1: isPos(r.pos1) ? r.pos1 : 'med',
      pos2: isPos(r.pos2) ? r.pos2 : 'med',
      level: r.level,
      isBot: r.isBot ?? false,
    };
  } catch (error) {
    console.error('Error al obtener jugador por ID:', error);
    return null;
  }
}

export const editPlayer = async (
  id: number,
  updates: { name?: string; pos1?: string; pos2?: string; level?: number }
): Promise<{ success: true; data: Player; message: string } | { success: false; error: string; details?: unknown }> => {
  try {
    if (
      !updates ||
      (updates.name === undefined &&
        updates.pos1 === undefined &&
        updates.pos2 === undefined &&
        updates.level === undefined)
    ) {
      return { success: false, error: 'No hay cambios para aplicar' };
    }

    if (updates.name !== undefined && !updates.name.trim()) {
      return { success: false, error: 'El nombre no puede estar vacío' };
    }

    if (updates.level !== undefined && (updates.level < 80 || updates.level > 99)) {
      return { success: false, error: 'El nivel debe estar entre 80 y 99' };
    }

    const isPos = (pos: string): pos is Player['pos1'] =>
      pos === 'del' || pos === 'med' || pos === 'def';

    if (updates.pos1 !== undefined && !isPos(updates.pos1)) {
      return { success: false, error: 'pos1 inválida: use del, med o def' };
    }
    if (updates.pos2 !== undefined && !isPos(updates.pos2)) {
      return { success: false, error: 'pos2 inválida: use del, med o def' };
    }

    if (updates.name) {
      const existing = await prisma.jugadores.findFirst({
        where: {
          AND: [
            { name: updates.name.trim() },
            { NOT: { id: id } }
          ]
        }
      });
      if (existing) {
        return { success: false, error: 'Ya existe otro jugador con ese nombre' };
      }
    }

    const dataToUpdate: { name?: string; pos1?: string; pos2?: string; level?: number } = {};
    if (updates.name !== undefined) dataToUpdate.name = updates.name.trim();
    if (updates.pos1 !== undefined) dataToUpdate.pos1 = updates.pos1;
    if (updates.pos2 !== undefined) dataToUpdate.pos2 = updates.pos2;
    if (updates.level !== undefined) dataToUpdate.level = updates.level;

    const updated = await prisma.jugadores.update({
      where: { id },
      data: dataToUpdate
    });

    const mapped: Player = {
      id: updated.id,
      name: updated.name,
      pos1: isPos(updated.pos1) ? updated.pos1 : 'med',
      pos2: isPos(updated.pos2) ? updated.pos2 : 'med',
      level: updated.level,
      isBot: updated.isBot ?? false
    };

    return { success: true, data: mapped, message: `Jugador ${mapped.name} actualizado` };
  } catch (error) {
    console.error('Error al editar jugador:', error);
    return { success: false, error: 'Error al actualizar en la base de datos', details: error };
  }
}

export const deletePlayer = async (id: number): Promise<{ success: true; message: string } | { success: false; error: string; details?: unknown }> => {
  try {
    const player = await prisma.jugadores.findUnique({ where: { id } });
    if (!player) {
      return { success: false, error: 'Jugador no encontrado' };
    }

    await prisma.jugadores.delete({ where: { id } });
    return { success: true, message: `Jugador ${player.name} eliminado` };
  } catch (error) {
    console.error('Error al eliminar jugador:', error);
    return { success: false, error: 'Error al eliminar en la base de datos', details: error };
  }
}


// Action para agregar un nuevo bot
export const addBot = async (botData: {
  name: string;
  pos1: string;
  pos2: string;
  level: number;
}) => {
  try {
    // Validaciones
    if (!botData.name.trim()) {
      return {
        success: false,
        error: 'El nombre es requerido'
      };
    }

    if (botData.level < 80 || botData.level > 99) {
      return {
        success: false,
        error: 'El nivel debe estar entre 80 y 100'
      };
    }

    const validPositions = ['del', 'med', 'def'];
    if (!validPositions.includes(botData.pos1) || !validPositions.includes(botData.pos2)) {
      return {
        success: false,
        error: 'Las posiciones deben ser: del, med o def'
      };
    }

    // Verificar si ya existe un bot con ese nombre
    const existingBot = await prisma.bots.findFirst({
      where: { name: botData.name.trim() }
    });

    if (existingBot) {
      return {
        success: false,
        error: 'Ya existe un bot con ese nombre'
      };
    }

    // Crear el bot
    const newBot = await prisma.bots.create({
      data: {
        name: botData.name.trim(),
        pos1: botData.pos1,
        pos2: botData.pos2,
        level: botData.level,
        isBot: true
      }
    });

    return {
      success: true,
      data: newBot,
      message: `Bot ${newBot.name} agregado exitosamente`
    };

  } catch (error) {
    console.error('Error al agregar bot:', error);
    return {
      success: false,
      error: 'Error al guardar en la base de datos',
      details: error
    };
  }
};


export const getBotByID = async (id: number) => {
  try {
    const r = await prisma.bots.findUnique({ where: { id } });
    if (!r) return null;

    const isPos = (pos: string): pos is Player['pos1'] =>
      pos === 'del' || pos === 'med' || pos === 'def';

    const mapped: Player = {
      id: r.id,
      name: r.name,
      pos1: isPos(r.pos1) ? r.pos1 : 'med',
      pos2: isPos(r.pos2) ? r.pos2 : 'med',
      level: r.level,
      isBot: r.isBot ?? true,
    };

    return mapped;
  } catch (error) {
    console.error('Error al obtener bot por ID:', error);
    return null;
  }
}

export const editBot = async (
  id: number,
  updates: { name?: string; pos1?: string; pos2?: string; level?: number }
): Promise<{ success: true; data: Player; message: string } | { success: false; error: string; details?: unknown }> => {
  try {
    if (
      !updates ||
      (updates.name === undefined &&
        updates.pos1 === undefined &&
        updates.pos2 === undefined &&
        updates.level === undefined)
    ) {
      return { success: false, error: 'No hay cambios para aplicar' };
    }

    if (updates.name !== undefined && !updates.name.trim()) {
      return { success: false, error: 'El nombre no puede estar vacío' };
    }

    if (updates.level !== undefined && (updates.level < 80 || updates.level > 99)) {
      return { success: false, error: 'El nivel debe estar entre 80 y 99' };
    }

    const isPos = (pos: string): pos is Player['pos1'] =>
      pos === 'del' || pos === 'med' || pos === 'def';

    if (updates.pos1 !== undefined && !isPos(updates.pos1)) {
      return { success: false, error: 'pos1 inválida: use del, med o def' };
    }
    if (updates.pos2 !== undefined && !isPos(updates.pos2)) {
      return { success: false, error: 'pos2 inválida: use del, med o def' };
    }

    if (updates.name) {
      const existing = await prisma.bots.findFirst({
        where: {
          AND: [
            { name: updates.name.trim() },
            { NOT: { id } }
          ]
        }
      });
      if (existing) {
        return { success: false, error: 'Ya existe otro bot con ese nombre' };
      }
    }

    const dataToUpdate: { name?: string; pos1?: string; pos2?: string; level?: number } = {};
    if (updates.name !== undefined) dataToUpdate.name = updates.name.trim();
    if (updates.pos1 !== undefined) dataToUpdate.pos1 = updates.pos1;
    if (updates.pos2 !== undefined) dataToUpdate.pos2 = updates.pos2;
    if (updates.level !== undefined) dataToUpdate.level = updates.level;

    const updated = await prisma.bots.update({
      where: { id },
      data: dataToUpdate
    });

    const mapped: Player = {
      id: updated.id,
      name: updated.name,
      pos1: isPos(updated.pos1) ? updated.pos1 : 'med',
      pos2: isPos(updated.pos2) ? updated.pos2 : 'med',
      level: updated.level,
      isBot: updated.isBot ?? true
    };

    return { success: true, data: mapped, message: `Bot ${mapped.name} actualizado` };
  } catch (error) {
    console.error('Error al editar bot:', error);
    return { success: false, error: 'Error al actualizar en la base de datos', details: error };
  }
}

export const deleteBot = async (id: number): Promise<{ success: true; message: string } | { success: false; error: string; details?: unknown }> => {
  try {
    const bot = await prisma.bots.findUnique({ where: { id } });
    if (!bot) {
      return { success: false, error: 'Bot no encontrado' };
    }

    await prisma.bots.delete({ where: { id } });
    return { success: true, message: `Bot ${bot.name} eliminado` };
  } catch (error) {
    console.error('Error al eliminar bot:', error);
    return { success: false, error: 'Error al eliminar en la base de datos', details: error };
  }
}