//NOTA IMPORTANTE¡¡ ESTE VA A ADEJAR DE SER CLIENT.
//PARA PODER USAR useState, useEffect, etc.

// import { getAllPlayers } from "@/utils/player-actions/actions";
"use client"
import { useState } from "react";
import playersData from "@/mock/players-data.json";

type Player = {
  id: number;
  name: string;
  pos1: string;
  pos2: string;
  level: number;
  selected: boolean;
  captain: boolean;
  captain_count: number;
}

const SeleccionPage = () => {
  // const players: Player[] = await getAllPlayers()
  const [players] = useState<Player[]>(playersData);

  return (
    <div>
      <h1>Selección de Jugadores</h1>
      <p>Total de jugadores: {players.length}</p>
      {/* Aquí puedes agregar tu lógica de selección */}
    </div>
  )
}

export default SeleccionPage
