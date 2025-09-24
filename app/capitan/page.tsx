
import PanelCapitan from "@/components/capitan/PanelCapitan";
import { getAllSeleccionados } from "@/utils/player-actions/actions";

export default async function Capitan() {
  const seleccionadosResult = await getAllSeleccionados();

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

  return (
    <div>
      <PanelCapitan seleccionados={seleccionados} />
    </div>
  );
}

