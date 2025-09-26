"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTeams } from "@/contexts/teams-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Player } from "@/utils/teams";

export default function ArmadoPage() {
  const { teamsData, clearTeamsData, setTeamsData } = useTeams();
  const router = useRouter();
  
  // Estados para jugadores seleccionados
  const [selectedPlayerA, setSelectedPlayerA] = useState<Player | null>(null);
  const [selectedPlayerB, setSelectedPlayerB] = useState<Player | null>(null);

  useEffect(() => {
    if (!teamsData) {
      // Si no hay datos, redirigir de vuelta
      router.push('/capitan');
    }
  }, [teamsData, router]);

  if (!teamsData) {
    return (
      <div className="p-6">
        <div className="text-center">Cargando jugadores...</div>
      </div>
    );
  }

  // Función para ordenar jugadores por posición
  const sortPlayersByPosition = (players: Player[]) => {
    const positionOrder = { 'def': 1, 'med': 2, 'del': 3 };
    return players.sort((a, b) => {
      return positionOrder[a.pos1 as keyof typeof positionOrder] - positionOrder[b.pos1 as keyof typeof positionOrder];
    });
  };

  // Función para calcular promedio
  const calculateAverage = (totalLevel: number, playerCount: number) => {
    return Math.round(totalLevel / playerCount);
  };

  // Función para seleccionar jugador del Equipo A
  const handleSelectPlayerA = (player: Player) => {
    setSelectedPlayerA(selectedPlayerA?.id === player.id ? null : player);
  };

  // Función para seleccionar jugador del Equipo B
  const handleSelectPlayerB = (player: Player) => {
    setSelectedPlayerB(selectedPlayerB?.id === player.id ? null : player);
  };

  // Función para intercambiar jugadores
  const handleTransferPlayers = () => {
    if (!selectedPlayerA || !selectedPlayerB || !teamsData) return;

    // Crear nuevos arrays sin los jugadores seleccionados
    const newTeamAPlayers = teamsData.teamA.players.filter(p => p.id !== selectedPlayerA.id);
    const newTeamBPlayers = teamsData.teamB.players.filter(p => p.id !== selectedPlayerB.id);

    // Agregar los jugadores intercambiados
    newTeamAPlayers.push(selectedPlayerB);
    newTeamBPlayers.push(selectedPlayerA);

    // Calcular nuevos totales
    const newTeamATotalLevel = newTeamAPlayers.reduce((sum, player) => sum + player.level, 0);
    const newTeamBTotalLevel = newTeamBPlayers.reduce((sum, player) => sum + player.level, 0);

    // Actualizar los datos
    const newTeamsData = {
      teamA: {
        players: newTeamAPlayers,
        totalLevel: newTeamATotalLevel
      },
      teamB: {
        players: newTeamBPlayers,
        totalLevel: newTeamBTotalLevel
      }
    };

    setTeamsData(newTeamsData);
    
    // Limpiar selecciones
    setSelectedPlayerA(null);
    setSelectedPlayerB(null);
  };

  const handleVolver = () => {
    clearTeamsData(); // Limpiar los datos
    router.push('/capitan');
  };

  const sortedTeamA = sortPlayersByPosition([...teamsData.teamA.players]);
  const sortedTeamB = sortPlayersByPosition([...teamsData.teamB.players]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Equipos Armados</h1>
      
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Equipo A - Promedio a la derecha */}
        <div className="flex gap-4">
          <div className="flex-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-bold text-center">Equipo A</h2>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="w-16 text-center font-semibold text-gray-700">POS</TableHead>
                  <TableHead className="font-semibold text-gray-700">Nombre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTeamA.map((player, index) => (
                  <TableRow 
                    key={player.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedPlayerA?.id === player.id 
                        ? 'bg-blue-200 hover:bg-blue-300' 
                        : `hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`
                    }`}
                    onClick={() => handleSelectPlayerA(player)}
                  >
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                        {player.pos1.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      {player.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Promedio al costado derecho para Equipo A */}
          <div className="flex items-center justify-center bg-blue-50 border-2 border-blue-200 rounded-lg p-6 min-w-[120px]">
            <div className="text-center">
              <div className="text-sm text-blue-600 font-medium mb-1">Promedio</div>
              <div className="text-3xl font-bold text-blue-700">
                {calculateAverage(teamsData.teamA.totalLevel, teamsData.teamA.players.length)}
              </div>
            </div>
          </div>
        </div>

        {/* Equipo B - Promedio a la izquierda */}
        <div className="flex gap-4">
          {/* Promedio al costado izquierdo para Equipo B */}
          <div className="flex items-center justify-center bg-red-50 border-2 border-red-200 rounded-lg p-6 min-w-[120px]">
            <div className="text-center">
              <div className="text-sm text-red-600 font-medium mb-1">Promedio</div>
              <div className="text-3xl font-bold text-red-700">
                {calculateAverage(teamsData.teamB.totalLevel, teamsData.teamB.players.length)}
              </div>
            </div>
          </div>
          
          <div className="flex-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-red-600 text-white p-4">
              <h2 className="text-xl font-bold text-center">Equipo B</h2>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="w-16 text-center font-semibold text-gray-700">POS</TableHead>
                  <TableHead className="font-semibold text-gray-700">Nombre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTeamB.map((player, index) => (
                  <TableRow 
                    key={player.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedPlayerB?.id === player.id 
                        ? 'bg-red-200 hover:bg-red-300' 
                        : `hover:bg-red-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`
                    }`}
                    onClick={() => handleSelectPlayerB(player)}
                  >
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 rounded text-xs font-bold">
                        {player.pos1.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      {player.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-10">
        {/* Botón de intercambiar - solo aparece cuando hay uno de cada equipo seleccionado */}
        {selectedPlayerA && selectedPlayerB && (
          <Button 
            onClick={handleTransferPlayers}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
          >
            Intercambiar Jugadores
          </Button>
        )}
        
        <Button 
          onClick={handleVolver}
          variant="outline"
          size="lg"
          className="px-8 py-3 text-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          ← Volver al Panel
        </Button>
      </div>
    </div>
  );
}