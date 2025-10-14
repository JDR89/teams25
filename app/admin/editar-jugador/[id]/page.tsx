// Server Component
import EditPlayerPanel from "@/components/editar-jugador/EditPlayerPanel";
import { editPlayer, getPlayerByID, deletePlayer } from "@/utils/player-actions/actions";
import { type PlayerFormData } from "@/schemas/formSchema";

export const revalidate = 0;   

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const playerId = Number(id);
  const player = await getPlayerByID(playerId);

  if (!player) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-3">Jugador no encontrado</h1>
      </div>
    );
  }

  async function handleEditPlayer(data: PlayerFormData) {
    "use server";
    return await editPlayer(playerId, data);
  }

  async function handleDeletePlayer() {
    "use server";
    return await deletePlayer(playerId);
  }

  return (
    <div>
      <EditPlayerPanel player={player} editPlayerAction={handleEditPlayer} deletePlayerAction={handleDeletePlayer} />
    </div>
  );
}
