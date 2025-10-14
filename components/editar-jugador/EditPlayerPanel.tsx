"use client"
import { useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Player } from "@/utils/teams";
import { playerSchema, type PlayerFormData } from "@/schemas/formSchema";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";


interface EditPlayerPanelProps {
  player: Player;
  editPlayerAction: (data: PlayerFormData) => Promise<{ success: boolean; message?: string; error?: string }>;
  deletePlayerAction: () => Promise<{ success: boolean; message?: string; error?: string }>; // añadido
}

// Componente EditPlayerPanel
const EditPlayerPanel = ({ player, editPlayerAction, deletePlayerAction }: EditPlayerPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // nuevo estado
  const router = useRouter();

  const form = useForm<PlayerFormData>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: player.name,
      pos1: player.pos1,
      pos2: player.pos2,
      level: player.level,
    },
  });

  const onSubmit = async (data: PlayerFormData) => {
    setIsLoading(true);
    try {
      const result = await editPlayerAction(data);
      if (result.success) {
        toast.success("Jugador actualizado", { description: result.message });
        setTimeout(() => {
          router.push("/admin/editar-jugador");
        }, 1200);
      } else {
        toast.error("Error al actualizar", { description: result.error });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado", { description: "No se pudo actualizar el jugador" });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    // eliminado window.confirm; la confirmación ahora es con modal
    setIsLoading(true);
    try {
      const result = await deletePlayerAction();
      if (result.success) {
        toast.success("Jugador eliminado", { description: result.message });
        setTimeout(() => {
          router.push("/admin/editar-jugador");
        }, 1000);
      } else {
        toast.error("Error al eliminar", { description: result.error });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado", { description: "No se pudo eliminar el jugador" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-center mb-2">Editar Jugador</h1>
        <p className="text-muted-foreground text-center">Actualiza los datos del jugador</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>Nombre del jugador</FormDescription>
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
                <FormLabel>Nivel</FormLabel>
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
                <FormDescription>Nivel del jugador (80-99)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-red-500 hover:text-black" disabled={isLoading}>
              {isLoading ? "Guardando..." : "💾 Guardar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/editar-jugador")} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={() => setIsConfirmOpen(true)} disabled={isLoading}>
              <Trash />
            </Button>
          </div>

          {/* Modal de confirmación accesible y responsive */}
          {isConfirmOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                <h3 className="text-lg font-semibold">Confirmar eliminación</h3>
                
                <div className="mt-6 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsConfirmOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex-1"
                    onClick={async () => {
                      setIsConfirmOpen(false);
                      await onDelete();
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default EditPlayerPanel;
