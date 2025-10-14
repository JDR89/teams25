import { addPlayer } from "@/utils/player-actions/actions";
import FormAgregarJugador from "@/components/admin/FormAgregarJugador";
import { PlayerFormData } from "@/schemas/formSchema";
import { revalidatePath } from "next/cache";

// Server Action
async function handleAddPlayer(data: PlayerFormData) {
  "use server";
  
  try {
    const result = await addPlayer(data);
    if (result.success) {
      // Refrescar páginas/segmentos que muestran jugadores
      revalidatePath("/admin/seleccion");
      revalidatePath("/admin/editar-jugador");

    }
    return result;
  } catch (error) {
    console.error("Error en server action:", error);
    return {
      success: false,
      error: "Error interno del servidor"
    };
  }
}

const AgregarJugadorPage = () => {
  return <FormAgregarJugador addPlayerAction={handleAddPlayer} />;
};

export default AgregarJugadorPage;