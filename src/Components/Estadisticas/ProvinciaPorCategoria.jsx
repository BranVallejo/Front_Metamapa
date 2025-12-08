import React from 'react';

const ProvinciaPorCategoria = ({ data, onExport }) => {
  
  // Ordenamos por cantidad de mayor a menor para ver lo más grave primero
  const datosOrdenados = [...data].sort((a, b) => b.cantidadHechos - a.cantidadHechos);

  // Función auxiliar para determinar el color del borde según la "gravedad" relativa
  // (Esto es visual candy: asume que el primero es el máximo 100%)
  const getIntensidadColor = (valor, maximo) => {
    const porcentaje = (valor / maximo);
    if (porcentaje > 0.75) return "border-red-500";    // Muy alto
    if (porcentaje > 0.40) return "border-orange-400"; // Medio
    return "border-green-500";                         // Bajo
  };

  const maximoHechos = datosOrdenados.length > 0 ? datosOrdenados[0].cantidadHechos : 1;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Provincia con más hechos por Categoría
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Provincia con mayor incidencia para cada tipo de hecho.
          </p>
        </div>
        <button onClick={onExport} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          Exportar CSV
        </button>
      </div>

      {/* Grilla de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {datosOrdenados.map((item, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border-l-4 ${getIntensidadColor(item.cantidadHechos, maximoHechos)} shadow-sm hover:shadow-md transition-shadow`}
          >
            {/* Título Categoría */}
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              {item.categoriaNombre}
            </h3>
            
            {/* Contenido Principal */}
            <div className="flex justify-between items-end">
              <div>
                {/* Provincia Ganadora */}
                <div className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {item.provincia}
                </div>
              </div>
              
              {/* Cantidad */}
              <div className="text-right">
                <span className="block text-2xl font-extrabold text-gray-900 dark:text-white leading-none">
                  {item.cantidadHechos}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">hechos</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProvinciaPorCategoria;