"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { playerSchema, type PlayerFormData } from "@/schemas/formSchema";

interface FormAgregarJugadorProps {
  addPlayerAction: (data: PlayerFormData) => Promise<{ success: boolean; message?: string; error?: string }>;
}

const FormAgregarJugador = ({ addPlayerAction }: FormAgregarJugadorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: "",
      pos1: undefined,
      pos2: undefined,
      level: 80 
    }
  });

  const onSubmit = async (data: PlayerFormData) => {
    setIsLoading(true);
    
    try {
      const result = await addPlayerAction(data);
      
      if (result.success) {
        toast.success("¡Jugador agregado!", {
          description: result.message
        });
        
        // Limpiar formulario
        form.reset();
        
        // Opcional: redirigir después de un delay
        setTimeout(() => {
          router.push("/admin");
        }, 1500);
        
      } else {
        toast.error("Error al agregar jugador", {
          description: result.error
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error inesperado", {
        description: "Ocurrió un error al procesar la solicitud"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-center mb-2">
           Agregar Nuevo Jugador
        </h1>
        <p className="text-muted-foreground text-center">
          Completa los datos del jugador para agregarlo al sistema
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Nombre */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Jugador</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nombre" 
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Nombre del jugador
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Posiciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pos1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posición Principal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona posición" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="del">Delantero</SelectItem>
                      <SelectItem value="med">Mediocampista</SelectItem>
                      <SelectItem value="def">Defensor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pos2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posición Secundaria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona posición" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="del">Delantero</SelectItem>
                      <SelectItem value="med">Mediocampista</SelectItem>
                      <SelectItem value="def">Defensor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Nivel */}
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivel de Habilidad</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="80" 
                    max="99" 
                    placeholder="85"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Nivel de habilidad del jugador (80-99)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white hover:bg-red-500 hover:text-black"
              disabled={isLoading}
            >
              {isLoading ? "Agregando..." : "✅ Agregar Jugador"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/admin")}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormAgregarJugador;