"use server"

import  prisma  from "@/lib/prisma";

// Tipo para la respuesta de las acciones
type ActionResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
  error?: string;
  details?: unknown;
}

// Acción para guardar capitanes en la tabla Sorteos (solo IDs)
export async function saveCapitanes(capitan1Id: number, capitan2Id: number): Promise<ActionResponse> {
  try {
    // Validar que ambos IDs estén presentes
    if (!capitan1Id || !capitan2Id) {
      return {
        success: false,
        error: "Ambos IDs de capitanes son requeridos"
      };
    }

    // Validar que los capitanes sean diferentes
    if (capitan1Id === capitan2Id) {
      return {
        success: false,
        error: "Los capitanes deben ser diferentes"
      };
    }

    // Verificar que ambos jugadores existan en la base de datos
    const [jugador1, jugador2] = await Promise.all([
      prisma.jugadores.findUnique({ where: { id: capitan1Id } }),
      prisma.jugadores.findUnique({ where: { id: capitan2Id } })
    ]);

    if (!jugador1 || !jugador2) {
      return {
        success: false,
        error: "Uno o ambos jugadores no existen en la base de datos"
      };
    }

    // Guardar en la base de datos
    const sorteo = await prisma.sorteos.create({
      data: {
        capitan1: capitan1Id,
        capitan2: capitan2Id,
        fecha: new Date()
      }
    });

    return {
      success: true,
      message: `Capitanes guardados exitosamente: ${jugador1.name} y ${jugador2.name}`,
      data: sorteo
    };

  } catch (error) {
    console.error("Error al guardar capitanes:", error);
    return {
      success: false,
      error: "Error interno del servidor al guardar capitanes",
      details: error
    };
  }
}

// Acción para obtener estadísticas de capitanes (nombre y cantidad de veces elegido)
export async function getAllSorteos(): Promise<ActionResponse> {
  try {
    // Obtener todos los sorteos
    const sorteos = await prisma.sorteos.findMany();

    // Crear un mapa para contar las apariciones de cada capitán
    const conteoCapitanes = new Map<number, number>();

    // Contar apariciones de cada capitán
    sorteos.forEach(sorteo => {
      // Contar capitan1
      const count1 = conteoCapitanes.get(sorteo.capitan1) || 0;
      conteoCapitanes.set(sorteo.capitan1, count1 + 1);

      // Contar capitan2
      const count2 = conteoCapitanes.get(sorteo.capitan2) || 0;
      conteoCapitanes.set(sorteo.capitan2, count2 + 1);
    });

    // Obtener los datos de los jugadores y crear el resultado final
    const estadisticas = await Promise.all(
      Array.from(conteoCapitanes.entries()).map(async ([jugadorId, cantidad]) => {
        const jugador = await prisma.jugadores.findUnique({ 
          where: { id: jugadorId } 
        });

        return {
          id: jugadorId,
          name: jugador?.name || 'Jugador no encontrado',
          vecesElegido: cantidad
        };
      })
    );

    // Ordenar por cantidad de veces elegido (descendente)
    estadisticas.sort((a, b) => b.vecesElegido - a.vecesElegido);

    return {
      success: true,
      message: `Estadísticas de ${estadisticas.length} capitanes`,
      data: estadisticas
    };

  } catch (error) {
    console.error("Error al obtener estadísticas de sorteos:", error);
    return {
      success: false,
      error: "Error interno del servidor al obtener estadísticas",
      details: error
    };
  }
}

// Acción para obtener el último sorteo con nombres de capitanes
export async function getLatestSorteo(): Promise<ActionResponse> {
  try {
    // Obtener el sorteo más reciente
    const ultimoSorteo = await prisma.sorteos.findFirst({
      orderBy: {
        fecha: 'desc'
      }
    });

    if (!ultimoSorteo) {
      return {
        success: false,
        error: "No hay sorteos registrados"
      };
    }

    // Obtener los nombres de los capitanes
    const [capitan1, capitan2] = await Promise.all([
      prisma.jugadores.findUnique({ where: { id: ultimoSorteo.capitan1 } }),
      prisma.jugadores.findUnique({ where: { id: ultimoSorteo.capitan2 } })
    ]);

    const sorteoConNombres = {
      id: ultimoSorteo.id,
      fecha: ultimoSorteo.fecha,
      capitan1: {
        id: ultimoSorteo.capitan1,
        name: capitan1?.name || 'Capitán no encontrado'
      },
      capitan2: {
        id: ultimoSorteo.capitan2,
        name: capitan2?.name || 'Capitán no encontrado'
      }
    };

    return {
      success: true,
      message: "Último sorteo obtenido exitosamente",
      data: sorteoConNombres
    };

  } catch (error) {
    console.error("Error al obtener el último sorteo:", error);
    return {
      success: false,
      error: "Error interno del servidor al obtener el último sorteo",
      details: error
    };
  }
}