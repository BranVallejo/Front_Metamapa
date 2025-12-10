import React from 'react';

const CategoriaDestacada = ({ data, onExport }) => {
  // Verificamos si hay datos
  const ganador = data && data.length > 0 ? data[0] : null;

  if (!ganador) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center h-full min-h-[300px]">
        <p className="text-gray-500">Sin datos de categoría.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full relative overflow-hidden group">
      
      {/* Fondo decorativo sutil */}
      <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform duration-500">
        <svg className="w-32 h-32 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start z-10">
        <div>
          <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            Categoría Más Reportada
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            La tipología con mayor frecuencia en el periodo.
          </p>
        </div>
        <button 
          onClick={onExport} 
          className="text-xs font-medium text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors"
        >
          Exportar CSV
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="mt-8 z-10">
        <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight capitalize mb-4">
          {ganador.categoriaNombre}
        </h3>
        
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">
            {ganador.cantidadHechos}
          </span>
          <span className="text-xl font-medium text-gray-500 dark:text-gray-400">
            hechos registrados
          </span>
        </div>
      </div>

      {/* Barra de adorno (simula un 100%) */}
      <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 mt-8 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 dark:bg-blue-500 w-full animate-pulse"></div>
      </div>
      
      <div className="mt-2 text-right">
        <span className="text-xs text-gray-400">
          Datos actualizados al {new Date(ganador.fechaCalculo).toLocaleDateString()}
        </span>
      </div>

    </div>
  );
};

export default CategoriaDestacada;