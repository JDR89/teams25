"use client"
import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Crown } from 'lucide-react';

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

const PanelSorteo = ({ playersOnly }: PanelSorteoProps) => {
  const [selectedCaptains, setSelectedCaptains] = useState<Player[]>([]);

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
      alert("Se necesitan al menos 2 jugadores para hacer un sorteo");
      return;
    }

    // Crear una copia del array y mezclarlo
    const shuffled = [...playersOnly].sort(() => Math.random() - 0.5);
    // Tomar los primeros 2
    const randomCaptains = shuffled.slice(0, 2);
    setSelectedCaptains(randomCaptains);
  };

  // Función para confirmar selección
  const handleConfirm = () => {
    if (selectedCaptains.length !== 2) {
      alert("Debes seleccionar exactamente 2 capitanes");
      return;
    }
    
    console.log("Capitanes seleccionados:", selectedCaptains);
    // Aquí puedes agregar la lógica para guardar en base de datos
    alert(`Capitanes confirmados: ${selectedCaptains.map(cap => cap.name).join(" y ")}`);
  };

  // Función para limpiar selección
  const handleClear = () => {
    setSelectedCaptains([]);
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
          <div className="text-center justify-center flex space-x-4">
            <Button 
              onClick={handleRandomSelection}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Sortear Capitanes
            </Button>

            <Button 
              onClick={handleConfirm}
              disabled={selectedCaptains.length !== 2}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Confirmar ({selectedCaptains.length}/2)
            </Button>

            {selectedCaptains.length > 0 && (
              <Button 
                onClick={handleClear}
                variant="outline"
                className="px-4 py-2 rounded-md"
              >
                Limpiar
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default PanelSorteo
