import EditBotPanel from "@/components/editar-bot/EditBotPanel";
import { getBotByID, editBot, deleteBot } from "@/utils/player-actions/actions";
import { type PlayerFormData } from "@/schemas/formSchema";

export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const botId = Number(id);
  const bot = await getBotByID(botId);

  if (!bot) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-3">Bot no encontrado</h1>
      </div>
    );
  }

  async function handleEditBot(data: PlayerFormData) {
    "use server";
    return await editBot(botId, data);
  }

  async function handleDeleteBot() {
    "use server";
    return await deleteBot(botId);
  }

  return (
    <div>
      <EditBotPanel bot={bot} editBotAction={handleEditBot} deleteBotAction={handleDeleteBot} />
    </div>
  );
}