import React from 'react'

const NoDataInfo = () => {
  return (
    <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Sorteo de Capitanías</h1>
          <p className="text-gray-500 text-lg">
            No hay jugadores seleccionados para el sorteo.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Ve a la sección de selección para elegir jugadores primero.
          </p>
        </div>
      </div>
  )
}

export default NoDataInfo
