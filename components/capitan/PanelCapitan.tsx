
"use client";

import { useState, useEffect } from "react";

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
// Tipo unificado para jugadores confirmados
export type JugadorConfirmado = Jugador | Bot;

interface PanelCapitanProps {
  seleccionados: Seleccion[];
}

export default function PanelCapitan({ seleccionados }: PanelCapitanProps) {
  const [jugadoresConfirmados, setJugadoresConfirmados] = useState<JugadorConfirmado[]>([]);

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

  if (seleccionados.length === 0) {
    return (
      <div className="p-6">
        <div className="text-yellow-600">No hay selecciones disponibles</div>
      </div>
    );
  }

  return (
    <div className="p-6">
        
      <div className="bg-white rounded-lg shadow p-4">
        <div className="space-y-1">
          {jugadoresConfirmados.map((jugador) => (
            <div key={`${jugador.tipo}-${jugador.id}`} className="flex justify-between items-center">
              {jugador.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
