import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function Admin() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      
      {/* Card: Agregar jugador */}
      <Link href="/admin/seleccion">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Seleccionar jugadores</h3>
        <p className="text-gray-600 text-center">Selección de participantes</p>
      </div>
      </Link>

      {/* Card: Sortear jugadores */}
      <Link href="/admin/sorteo">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Sortear capitanías</h3>
        <p className="text-gray-600 text-center">Sorteo aleatorio de jugadores</p>
      </div>
      </Link>

    </div>
  );
}

