"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";


// Tipo unificado para manejar tanto jugadores como bots (solo para el estado del componente)
type Entity = {
  id: number;
  name: string;
  pos1: string;
  pos2: string;
  level: number;
  selected: boolean; // Solo para el estado del componente
  isBot: boolean;
}

// Tipo específico para los datos que se envían al servidor
type SelectedEntityData = {
  id: number;
  name: string;
  pos1: string;
  pos2: string;
  level: number;
  isBot: boolean;
}

// Tipo para la respuesta del servidor
type SaveResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
  error?: string;
  details?: unknown;
}

interface PanelSeleccionProps {
  initialPlayers: Entity[];
  initialBots: Entity[];
  onSaveSelection: (selectedData: SelectedEntityData[]) => Promise<SaveResponse>;
}

const PanelSeleccion = ({ initialPlayers, initialBots, onSaveSelection }: PanelSeleccionProps) => {
  const [players, setPlayers] = useState<Entity[]>(initialPlayers);
  const [bots, setBots] = useState<Entity[]>(initialBots);
  const [searchTerm, setSearchTerm] = useState("");
  const [showType, setShowType] = useState<"all" | "players" | "bots">("players");
  const [isLoading, setIsLoading] = useState(false);

  // Combinar jugadores y bots en una sola lista
  const allEntities: Entity[] = [...players, ...bots];

  // Filtrar entidades usando isBot
  const filteredEntities = allEntities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = showType === "all" || 
      (showType === "players" && !entity.isBot) ||
      (showType === "bots" && entity.isBot);
    
    return matchesSearch && matchesType;
  });

  // Función para alternar selección usando isBot
  const toggleSelection = (id: number, isBot: boolean) => {
    if (!isBot) {
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
  const confirmSelection = async () => {
    if (totalSelected === 0) {
      toast.error("No hay jugadores seleccionados");
      return;
    }
  
    // Validación de mínimo 10 seleccionados y número par
    if (totalSelected < 10) {
      toast.error("Selección insuficiente", {
        description: `Necesitas seleccionar al menos 10 jugadores/bots. Actualmente tienes ${totalSelected} seleccionados.`
      });
      return;
    }

    // Validación de número par
    if (totalSelected % 2 !== 0) {
      toast.error("Número impar de jugadores", {
        description: `Necesitas seleccionar un número par de jugadores/bots. Actualmente tienes ${totalSelected} seleccionados.`
      });
      return;
    }
  
    setIsLoading(true);
    
    try {
      // Preparar datos para enviar al servidor
      const selectedData: SelectedEntityData[] = [
        ...players.filter(p => p.selected).map(p => ({
          id: p.id,
          name: p.name,
          pos1: p.pos1,
          pos2: p.pos2,
          level: p.level,
          isBot: p.isBot
        })),
        ...bots.filter(b => b.selected).map(b => ({
          id: b.id,
          name: b.name,
          pos1: b.pos1,
          pos2: b.pos2,
          level: b.level,
          isBot: b.isBot
        }))
      ];
  
      const result = await onSaveSelection(selectedData);
      
      if (result.success) {
        toast.success(result.message || 'Selección guardada exitosamente');
        
        // Limpiar selecciones después del éxito
        setPlayers(prev => prev.map(p => ({ ...p, selected: false })));
        setBots(prev => prev.map(b => ({ ...b, selected: false })));
      } else {
        toast.error('Error al guardar la selección', {
          description: result.error || 'Error desconocido'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado', {
        description: 'No se pudo guardar la selección'
      });
    } finally {
      setIsLoading(false);
    }
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
              <div className="">
                <Button 
                  onClick={confirmSelection}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                  disabled={totalSelected === 0 || isLoading}
                >
                  {isLoading ? 'Guardando...' : 'Confirmar'}
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
            key={`${entity.isBot ? 'bot' : 'player'}-${entity.id}`}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg min-h-[120px] ${
              entity.selected 
                ? 'bg-green-100 border-green-300' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => toggleSelection(entity.id, entity.isBot)}
          >
            <CardContent className="p-3 h-full flex flex-col items-center justify-center">
              <div className="text-center w-full">
                <h3
                  className="font-semibold text-sm mb-2 leading-tight break-words [overflow-wrap:anywhere] [hyphens:auto]"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {entity.name}
                </h3>
                <div className="flex justify-center">
                  {entity.isBot && (
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

      {/* Solo contador informativo flotante */}
      {totalSelected > 0 && (
        <div className="fixed bottom-6 right-6">
          <div className="bg-white border-2 border-blue-200 text-blue-700 px-4 py-2 rounded-full shadow-lg">
            <span className="font-semibold">{totalSelected}</span>
            <span className="ml-1 text-sm">seleccionado{totalSelected !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelSeleccion;
