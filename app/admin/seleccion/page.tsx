"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import playersData from "@/mock/players-data.json";
import botsData from "@/mock/bots-data.json";   

type Player = {
  id: number;
  name: string;
  pos1: string;
  pos2: string;
  level: number;
  selected: boolean;
  captain: boolean;
  captain_count: number;
  isBot: boolean;
}

type Bot = {
  id: number;
  name: string;
  pos1: string;
  pos2: string;
  level: number;
  selected: boolean;
  isBot: boolean;
}

const SeleccionPage = () => {
  const [players, setPlayers] = useState<Player[]>(
    playersData.sort((a, b) => a.name.localeCompare(b.name))
  );
  
  const [bots, setBots] = useState<Bot[]>(
    botsData.sort((a, b) => a.name.localeCompare(b.name))
  );
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showType, setShowType] = useState<"all" | "players" | "bots">("players");

  // Combinar jugadores y bots para mostrar en una sola lista
  const allEntities = [
    ...players.map(p => ({ ...p, type: 'player' as const })),
    ...bots.map(b => ({ ...b, type: 'bot' as const, captain: false, captain_count: 0 }))
  ];

  // Filtrar entidades
  const filteredEntities = allEntities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = showType === "all" || 
      (showType === "players" && entity.type === "player") ||
      (showType === "bots" && entity.type === "bot");
    
    return matchesSearch && matchesType;
  });

  // Función para alternar selección
  const toggleSelection = (id: number, type: 'player' | 'bot') => {
    if (type === 'player') {
      setPlayers(prev => prev.map(player => 
        player.id === id ? { ...player, selected: !player.selected } : player
      ));
    } else {
      setBots(prev => prev.map(bot => 
        bot.id === id ? { ...bot, selected: !bot.selected } : bot
      ));
    }
  };

  // Estadísticas de selección
  const selectedPlayers = players.filter(p => p.selected);
  const selectedBots = bots.filter(b => b.selected);
  const totalSelected = selectedPlayers.length + selectedBots.length;

  // Función para confirmar selección
  const confirmSelection = () => {
    // Aquí puedes agregar la lógica para procesar la selección
    console.log('Jugadores seleccionados:', selectedPlayers);
    console.log('Bots seleccionados:', selectedBots);
    
    
  };

  

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
      
        
        {/* Panel de estadísticas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resumen de Selección</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center items-center">
              <div>
                <p className="text-3xl font-bold text-blue-600">{totalSelected}</p>
                <p className="text-sm text-gray-600">Seleccionados</p>
              </div>
              <div>
                <Button 
                  onClick={confirmSelection}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                  disabled={totalSelected === 0}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Buscar</label>
                <Input
                  placeholder="Nombre del jugador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={showType}
                  onChange={(e) => setShowType(e.target.value as "all" | "players" | "bots")}
                >
                  <option value="players">Solo Jugadores</option>
                  <option value="bots">Solo Bots</option>
                  <option value="all">Todos</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de jugadores/bots */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {filteredEntities.map((entity) => (
          <Card 
            key={`${entity.type}-${entity.id}`}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              entity.selected 
                ? 'bg-green-100 border-green-300' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => toggleSelection(entity.id, entity.type)}
          >
            <CardContent className="p-3">
              <div className="text-center">
                <h3 className="font-semibold text-sm mb-2">{entity.name}</h3>
                <div className="flex justify-center">
                  {entity.type === 'bot' && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      BOT
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEntities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron jugadores con los filtros aplicados</p>
        </div>
      )}

      {/* Botón flotante simplificado */}
      {totalSelected > 0 && (
        <div className="fixed bottom-6 right-6">
          <Button size="lg" className="shadow-lg">
            {totalSelected} seleccionados
          </Button>
        </div>
      )}
    </div>
  )
}

export default SeleccionPage
