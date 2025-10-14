import PlayersGrid from "@/components/editar-jugador/PlayersGrid";
import { getAllPlayers } from "@/utils/player-actions/actions";
import { Player } from "@/utils/teams";

export const revalidate = 0 

const EditarJugador = async () => {

  const players: Player[] = await getAllPlayers();

  return (

    <PlayersGrid players={players} />
    
  
  )
}

export default EditarJugador
