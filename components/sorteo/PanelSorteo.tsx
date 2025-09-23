"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Crown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { saveCapitanes, getAllSorteos } from "@/utils/sorteo-actions/actions";
import { toast } from "sonner";

interface Player {
  id: number;
  name: string;
  pos1: string;
  pos2: string;
  level: number;
  isBot: boolean;
}

interface PanelSorteoProps {
  playersOnly: Player[];
}

interface EstadisticaCapitan {
  id: number;
  name: string;
  vecesElegido: number;
}

const PanelSorteo = ({ playersOnly }: PanelSorteoProps) => {
  const [selectedCaptains, setSelectedCaptains] = useState<Player[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticaCapitan[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    loadEstadisticas();
  }, []);

  const loadEstadisticas = async () => {
    try {
      setLoadingStats(true);
      const result = await getAllSorteos();
      if (result.success && result.data) {
        setEstadisticas(result.data as EstadisticaCapitan[]);
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
      toast.error("Error al cargar estadísticas", {
        description: "No se pudieron cargar las estadísticas de capitanías"
      });
    } finally {
      setLoadingStats(false);
    }
  };

  // Función para manejar click manual en un jugador
  const handlePlayerClick = (player: Player) => {
    if (selectedCaptains.length < 2) {
      // Si no está seleccionado y hay menos de 2 capitanes, agregarlo
      if (!selectedCaptains.find(cap => cap.id === player.id)) {
        setSelectedCaptains([...selectedCaptains, player]);
      }
    } else {
      // Si ya hay 2 capitanes, reemplazar o deseleccionar
      if (selectedCaptains.find(cap => cap.id === player.id)) {
        // Si está seleccionado, quitarlo
        setSelectedCaptains(selectedCaptains.filter(cap => cap.id !== player.id));
      } else {
        // Si no está seleccionado, reemplazar el último
        setSelectedCaptains([selectedCaptains[0], player]);
      }
    }
  };

  // Función para sorteo aleatorio
  const handleRandomSelection = () => {
    if (playersOnly.length < 2) {
      toast.error("Jugadores insuficientes", {
        description: "Se necesitan al menos 2 jugadores para hacer un sorteo"
      });
      return;
    }

    // Crear una copia del array y mezclarlo
    const shuffled = [...playersOnly].sort(() => Math.random() - 0.5);
    // Tomar los primeros 2
    const randomCaptains = shuffled.slice(0, 2);
    setSelectedCaptains(randomCaptains);
    
    toast.success("Capitanes sorteados", {
      description: `${randomCaptains.map(cap => cap.name).join(" y ")} han sido seleccionados`
    });
  };

  // Función para confirmar selección y guardar en base de datos
  const handleConfirm = async () => {
    if (selectedCaptains.length !== 2) {
      toast.error("Selección incompleta", {
        description: "Debes seleccionar exactamente 2 capitanes"
      });
      return;
    }
    
    try {
      setLoading(true);
      const result = await saveCapitanes(selectedCaptains[0].id, selectedCaptains[1].id);
      
      if (result.success) {
        toast.success("Capitanes guardados exitosamente", {
          description: `${selectedCaptains.map(cap => cap.name).join(" y ")} han sido registrados como capitanes`
        });
        setSelectedCaptains([]);
        // Recargar estadísticas
        await loadEstadisticas();
      } else {
        toast.error("Error al guardar capitanes", {
          description: result.error || 'No se pudieron guardar los capitanes'
        });
      }
    } catch (error) {
      console.error("Error al guardar capitanes:", error);
      toast.error("Error interno", {
        description: "Ocurrió un error inesperado al guardar los capitanes"
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar selección
  const handleClear = () => {
    setSelectedCaptains([]);
    toast.info("Selección limpiada", {
      description: "Se ha limpiado la selección de capitanes"
    });
  };

  return (
    <div className="space-y-6">
      {/* Grid de jugadores */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        {playersOnly.map((player) => {
          const isSelected = selectedCaptains.find(cap => cap.id === player.id);
          return (
            <Card 
              key={player.id} 
              className={`border cursor-pointer transition-all duration-100 relative ${
                isSelected 
                  ? 'border-gray-200 bg-gradient-to-br from-blue-400 via-white via-50% to-red-400' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => handlePlayerClick(player)}
            >
              {/* Corona centrada arriba */}
              {isSelected && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-sm border border-gray-200">
                  <Crown className="h-4 w-4 text-yellow-500 drop-shadow-sm" />
                </div>
              )}
              
              <CardContent className="p-2 pt-3">
                <div className="text-center">
                  <h3 className="font-medium text-sm">{player.name}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mensaje cuando no hay jugadores */}
      {playersOnly.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No hay jugadores en la selección actual, solo bots.
          </p>
        </div>
      )}

      {/* Separador y botones */}
      {playersOnly.length > 0 && (
        <>
          <Separator className="my-6" />
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button 
              onClick={handleRandomSelection}
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Sortear
            </Button>

            <Button 
              onClick={handleConfirm}
              disabled={selectedCaptains.length !== 2 || loading}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : `Confirmar (${selectedCaptains.length}/2)`}
            </Button>

            {selectedCaptains.length > 0 && (
              <Button 
                onClick={handleClear}
                disabled={loading}
                variant="outline"
                className="w-full sm:w-auto px-4 py-2 rounded-md"
              >
                Limpiar
              </Button>
            )}
          </div>
        </>
      )}

      {/* Tabla de estadísticas */}
      <Separator className="my-8" />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            Estadísticas de Capitanías
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingStats ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando estadísticas...</p>
            </div>
          ) : estadisticas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay sorteos registrados aún</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Posición</TableHead>
                  <TableHead>Nombre del Jugador</TableHead>
                  <TableHead className="text-right">Veces Elegido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estadisticas.map((jugador, index) => (
                  <TableRow key={jugador.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {index === 0 && <Crown className="h-4 w-4 text-yellow-500 mr-2" />}
                        #{index + 1}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{jugador.name}</TableCell>
                    <TableCell className="text-right">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {jugador.vecesElegido}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PanelSorteo
