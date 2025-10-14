import { getAllPlayers, getAllBots, saveSeleccionados } from "@/utils/player-actions/actions";
import PanelSeleccion from "@/components/seleccion/PanelSeleccion";

// Tipo para los datos de selección
type SelectedEntityData = {
  id: number;
  name: string;
  pos1: string;
  pos2: string;
  level: number;
  isBot: boolean;
}

export const revalidate = 0;


const SeleccionPage = async () => {
  
  
  const players = await getAllPlayers();
  const bots = await getAllBots();

 
  const initialPlayersData = players.map(player => ({
    ...player,
    selected: false
  }));

 
  const initialBotsData = bots.map(bot => ({
    ...bot,
    selected: false
  }));

 
  const handleSaveSelection = async (selectedData: SelectedEntityData[]) => {
    "use server";
    return await saveSeleccionados(selectedData);
  };

  return (
    <div className="container mx-auto p-6">
      <PanelSeleccion 
        initialPlayers={initialPlayersData}
        initialBots={initialBotsData}
        onSaveSelection={handleSaveSelection}
      />
    </div>
  );
};

export default SeleccionPage;