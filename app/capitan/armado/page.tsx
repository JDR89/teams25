"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTeams } from "@/contexts/teams-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Player } from "@/utils/teams";
import { copyTeamsToClipboard } from "@/utils/clipboard";
import { toast } from "sonner";
import Image from "next/image";
import { Crown } from "lucide-react";

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

  // Función para ordenar jugadores por posición (DEF → MED → DEL) usando assignedRole si existe
  const sortPlayersByPosition = (players: Player[]) => {
    const order = { def: 1, med: 2, del: 3 } as const;
    const primary = (p: Player) => p.assignedRole ?? p.pos1;

    return [...players].sort((a, b) => {
      const byAssigned = order[primary(a)] - order[primary(b)];
      if (byAssigned !== 0) return byAssigned;
      const byPos1 = order[a.pos1] - order[b.pos1];
      if (byPos1 !== 0) return byPos1;
      return a.name.localeCompare(b.name);
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

    const newTeamAPlayers = teamsData.teamA.players.filter(p => p.id !== selectedPlayerA.id);
    const newTeamBPlayers = teamsData.teamB.players.filter(p => p.id !== selectedPlayerB.id);

    newTeamAPlayers.push(selectedPlayerB);
    newTeamBPlayers.push(selectedPlayerA);

    const newTeamATotalLevel = newTeamAPlayers.reduce((sum, player) => sum + player.level, 0);
    const newTeamBTotalLevel = newTeamBPlayers.reduce((sum, player) => sum + player.level, 0);

    // Mantener capitanes y cualquier otro metadata del context
    const newTeamsData = {
      // conserva { captains, ... } y lo que exista
      ...teamsData,
      teamA: {
        players: newTeamAPlayers,
        totalLevel: newTeamATotalLevel,
      },
      teamB: {
        players: newTeamBPlayers,
        totalLevel: newTeamBTotalLevel,
      },
    };

    setTeamsData(newTeamsData);

    setSelectedPlayerA(null);
    setSelectedPlayerB(null);
  };

  const handleVolver = () => {
    clearTeamsData(); // Limpiar los datos
    router.push('/capitan');
  };

  const isCaptain = (id: number) =>
    !!teamsData?.captains && (id === teamsData.captains.aId || id === teamsData.captains.bId);

  const sortedTeamA = sortPlayersByPosition([...teamsData.teamA.players]);
  const sortedTeamB = sortPlayersByPosition([...teamsData.teamB.players]);

  // Función para manejar el copiado de equipos
  const handleCopyTeams = async () => {
    const success = await copyTeamsToClipboard(sortedTeamA, sortedTeamB);
    if (success) {
      toast.success("¡Equipos copiados!", {
        description: "Los equipos se han copiado al portapapeles exitosamente"
      });
    } else {
      toast.error("Error al copiar", {
        description: "No se pudieron copiar los equipos al portapapeles"
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-center items-center gap-3 mb-8">
        
        <button 
          className="cursor-pointer flex items-center justify-center hover:scale-110 transition-transform"
          onClick={handleCopyTeams}
          title="Copiar equipos al portapapeles"
        >
          <Image
            src="/manitoSJD.png"
            alt="Copiar"
            width={30}
            height={30}
          />
        </button>
      </div>
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Equipo A - Promedio a la derecha */}
        <div className="flex gap-4">
          <div className="flex-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-bold text-center">Equipo 1</h2>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="w-16 text-center font-semibold text-gray-700">POS</TableHead>
                  <TableHead className="font-semibold text-gray-700">Nombre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* En la tabla del Equipo 1, dentro del map */}
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
                      <span className="inline-flex items-center justify-center h-8 px-2 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                        {(player.assignedRole ?? player.pos1).toUpperCase()}
                        <span className="ml-1 text-[10px] lowercase font-normal">
                          /{(player.assignedRole ?? player.pos1) === player.pos1 ? player.pos2 : player.pos1}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      {player.name}
                      {isCaptain(player.id) && (
                        <Crown className="ml-1 inline text-yellow-600" size={14} />
                      )}
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
              <h2 className="text-xl font-bold text-center">Equipo 2</h2>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="w-16 text-center font-semibold text-gray-700">POS</TableHead>
                  <TableHead className="font-semibold text-gray-700">Nombre</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* En la tabla del Equipo 2, dentro del map */}
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
                      <span className="inline-flex items-center justify-center h-8 px-2 bg-red-100 text-red-700 rounded text-xs font-bold">
                        {(player.assignedRole ?? player.pos1).toUpperCase()}
                        <span className="ml-1 text-[10px] lowercase font-normal">
                          /{(player.assignedRole ?? player.pos1) === player.pos1 ? player.pos2 : player.pos1}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      {player.name}
                      {isCaptain(player.id) && (
                        <Crown className="ml-1 inline text-yellow-600" size={14} />
                      )}
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