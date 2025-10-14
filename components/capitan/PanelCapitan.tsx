
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { balanceTeams, type Player } from "@/utils/teams";
import { useTeams } from "@/contexts/teams-context";
import { Crown } from "lucide-react";

export const revalidate = 0

// Tipos para el Panel Capitán
export interface Jugador {
  id: number;
  name: string;
  pos1: string;
  pos2: string;
  level: number;
  tipo: 'jugador';
}

export interface Bot {
  id: number;
  name: string;
  pos1: string;
  pos2: string;
  level: number;
  tipo: 'bot';
}

export interface Seleccion {
  id: number;
  fecha_seleccion: Date;
  jugadores: Omit<Jugador, 'tipo'>[];
  bots: Omit<Bot, 'tipo'>[];
}

// Tipo para el último sorteo
export interface UltimoSorteo {
  id: number;
  fecha: Date;
  capitan1: {
    id: number;
    name: string;
  };
  capitan2: {
    id: number;
    name: string;
  };
}

// Tipo unificado para jugadores confirmados
export type JugadorConfirmado = Jugador | Bot;

interface PanelCapitanProps {
  seleccionados: Seleccion[];
  ultimoSorteo?: UltimoSorteo | null;
}

export default function PanelCapitan({ seleccionados, ultimoSorteo }: PanelCapitanProps) {
  const [jugadoresConfirmados, setJugadoresConfirmados] = useState<JugadorConfirmado[]>([]);
  const router = useRouter();
  const { setTeamsData } = useTeams();

  useEffect(() => {
    if (seleccionados.length > 0) {
      // Tomar la primera selección y combinar jugadores y bots
      const seleccion = seleccionados[0];
      
      const jugadoresConTipo: JugadorConfirmado[] = [
        ...seleccion.jugadores.map(jugador => ({ ...jugador, tipo: 'jugador' as const })),
        ...seleccion.bots.map(bot => ({ ...bot, tipo: 'bot' as const }))
      ];
      
      setJugadoresConfirmados(jugadoresConTipo);
    }
  }, [seleccionados]);

  const handleArmarEquipos = () => {
    try {
      const playersForBalance: Player[] = jugadoresConfirmados.map(jugador => ({
        id: jugador.id,
        name: jugador.name,
        pos1: jugador.pos1 as "del" | "med" | "def",
        pos2: jugador.pos2 as "del" | "med" | "def",
        level: jugador.level,
        isBot: jugador.tipo === 'bot'
      }));

      const teams = balanceTeams(playersForBalance, {
        captainAId: ultimoSorteo?.capitan1.id,
        captainBId: ultimoSorteo?.capitan2.id,
      });
      
      // Guardar en el context
      setTeamsData({
        ...teams,
        captains: { aId: ultimoSorteo?.capitan1.id, bId: ultimoSorteo?.capitan2.id }, // añade capitanes
      });
      router.push('/capitan/armado');
      
    } catch (error) {
      console.error('Error al armar equipos:', error);
    }
  };

  // Función para formatear la fecha (solo fecha, sin horario)
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (seleccionados.length === 0) {
    return (
      <div className="p-6">
        <div className="text-yellow-600">No hay selecciones disponibles</div>
      </div>
    );
  }

  const fechaSeleccion = seleccionados[0].fecha_seleccion;

  // Helper: identificar capitán
  const isCaptain = (id: number) =>
    !!ultimoSorteo && (id === ultimoSorteo.capitan1.id || id === ultimoSorteo.capitan2.id);

  return (
    <div className="p-6">
      <div className="mb-6">
        
        
        {/* Información de fechas y capitanes */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-2">
            <span className="font-medium">Fecha de selección:</span> {formatDate(fechaSeleccion)}
          </div>
          
          {ultimoSorteo && (
            <div className="text-sm text-gray-600 bg-blue-50 rounded-lg px-3 py-2">
              <span className="font-medium">Último sorteo:</span> {formatDate(ultimoSorteo.fecha)}
              <div className="mt-1">
                <span className="font-medium">Capitanes:</span> {ultimoSorteo.capitan1.name} vs {ultimoSorteo.capitan2.name}
              </div>
            </div>
          )}
        </div>
        
        {!ultimoSorteo && (
          <div className="text-sm text-yellow-600 bg-yellow-50 rounded-lg px-3 py-2 mb-4">
            No hay sorteos de capitanes registrados aún
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Jugadores Seleccionados</h2>
        {/* Grilla de jugadores */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          {jugadoresConfirmados.map((jugador) => (
            <div
              key={`${jugador.tipo}-${jugador.id}`}
              className="bg-gray-50 rounded-lg p-3 text-center border hover:shadow-md transition-shadow"
            >
              <div className="font-medium text-gray-800 text-sm">
                {jugador.name}
                {isCaptain(jugador.id) && (
                  <Crown className="ml-1 inline text-yellow-600" size={14} />
                )}
              </div>
              <div
                className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                  jugador.tipo === "jugador" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                }`}
              >
                {jugador.tipo}
              </div>
            </div>
          ))}
        </div>
        {/* Botón centrado */}
        <div className="flex justify-center">
          <button
            onClick={handleArmarEquipos}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors"
          >
            Armar Equipos
          </button>
        </div>
      </div>
    </div>
  );
}
