import Link from "next/link";
import { Dices, MousePointerClick } from "lucide-react";

export default function Admin() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto px-4">
      
      {/* Card: Agregar jugador */}
      <Link href="/admin/seleccion">
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
        <div className="flex items-center justify-center mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <MousePointerClick className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">Seleccionar jugadores</h3>
        <p className="text-gray-600 text-center text-sm">Selección de participantes</p>
      </div>
      </Link>

      {/* Card: Sortear jugadores */}
      <Link href="/admin/sorteo">
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
        <div className="flex items-center justify-center mb-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Dices className="w-5 h-5 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">Sortear capitanías</h3>
        <p className="text-gray-600 text-center text-sm">Sorteo aleatorio de jugadores</p>
      </div>
      </Link>

    </div>
  );
}

