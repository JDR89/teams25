
import PanelCapitan from "@/components/capitan/PanelCapitan";
import { getAllSeleccionados } from "@/utils/player-actions/actions";
import { getLatestSorteo } from "@/utils/sorteo-actions/actions";
import { UltimoSorteo } from "@/components/capitan/PanelCapitan";

// Esta línea hace que la página siempre haga fetch fresco
export const revalidate = 0;

export default async function Capitan() {
  const seleccionadosResult = await getAllSeleccionados();
  const sorteoResult = await getLatestSorteo();

  if (!seleccionadosResult.success || !seleccionadosResult.data) {
    return (
      <div className="p-6">
        <div className="text-red-600">Error al cargar los datos</div>
      </div>
    );
  }

  if (seleccionadosResult.data.length === 0) {
    return (
      <div className="p-6">
        <div className="text-yellow-600">No hay seleccionados todavía</div>
      </div>
    );
  }

  const seleccionados = seleccionadosResult.data;
  const ultimoSorteo = sorteoResult.success ? (sorteoResult.data as UltimoSorteo) : null;

  return (
    <div>
      <PanelCapitan 
        seleccionados={seleccionados} 
        ultimoSorteo={ultimoSorteo}
      />
    </div>
  );
}

