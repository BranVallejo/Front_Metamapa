import React from 'react';

const FiltrosFecha = ({ desde, hasta, setDesde, setHasta, onFiltrar }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-full md:w-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        
        {/* Input Desde */}
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Desde
          </label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="w-full sm:w-40 p-2 text-sm border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Input Hasta */}
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Hasta
          </label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="w-full sm:w-40 p-2 text-sm border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Botón Filtrar */}
        <button
          onClick={onFiltrar}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          Filtrar
        </button>
      </div>
    </div>
  );
};

export default FiltrosFecha;