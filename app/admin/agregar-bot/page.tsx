

import { addBot } from "@/utils/player-actions/actions";
import FormAgregarBot from "@/components/admin/FormAgregarBot";
import { PlayerFormData } from "@/schemas/formSchema";
import { revalidatePath } from "next/cache";

// Server Action
async function handleAddBot(data: PlayerFormData) {
  "use server";

  try {
    const result = await addBot(data);
    if (result.success) {
      // Refrescar páginas/segmentos que muestran bots
      revalidatePath("/admin/seleccion");
      revalidatePath("/admin/editar-bot");
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

const AgregarBotPage = () => {
  return <FormAgregarBot addBotAction={handleAddBot} />;
};

export default AgregarBotPage;
