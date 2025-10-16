

import BotsGrid from "@/components/editar-bot/BotsGrid";
import { getAllBots } from "@/utils/player-actions/actions";

export const revalidate = 0;

const EditarBot = async () => {
  const bots = await getAllBots();

  return (
    <BotsGrid bots={bots} />
  );
}

export default EditarBot;
