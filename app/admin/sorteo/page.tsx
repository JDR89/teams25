
import { getAllSeleccionados } from "@/utils/player-actions/actions";
import NoDataInfo from "@/components/sorteo/NoDataInfo";
import PanelSorteo from "@/components/sorteo/PanelSorteo";

export const revalidate = 0;

const SorteoPage = async () => {
  // Esta línea hace que la página siempre haga fetch fresco
  

  // Obtener los seleccionados de la base de datos
  const result = await getAllSeleccionados();

  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <NoDataInfo />
    );
  }

  // Obtener la selección más reciente
  const latestSelection = result.data[0];
  // Filtrar solo jugadores (no bots)
  const playersOnly = latestSelection.jugadores;

  

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sorteo de Capitanías</h1>
       
      </div>

      {/* Grid con cards más pequeñas */}
      <PanelSorteo playersOnly={playersOnly} />

      

    </div>
  );
};

export default SorteoPage;
