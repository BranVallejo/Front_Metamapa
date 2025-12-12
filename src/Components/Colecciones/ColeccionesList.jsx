import React from 'react';

const ColeccionesList = ({ colecciones, cargando, onEditar, onEliminar, seleccionada }) => {
  
  if (cargando) {
      return <div className="p-10 text-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white/50 mx-auto"></div></div>;
  }

  if (colecciones.length === 0) {
      return (
          <div className="p-10 text-center bg-white/20 dark:bg-black/20 rounded-2xl border-2 border-dashed border-white/10 backdrop-blur-sm">
              <p className="text-gray-500 dark:text-gray-400">No hay colecciones disponibles.</p>
          </div>
      );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {colecciones.map((col, idx) => {
            const isSelected = seleccionada?.handle === col.handle;
            
            return (
                <div 
                    key={col.handle || idx}
                    className={`relative p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 group ${
                        isSelected 
                        ? "bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]" 
                        : "bg-white/60 dark:bg-gray-900/60 border-white/40 dark:border-white/5 hover:border-blue-400/50 hover:shadow-lg"
                    }`}
                >
                    {/* Header Card */}
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white leading-tight mb-1">
                                {col.titulo || "Sin Título"}
                            </h3>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400">
                                {col.algoritmo}
                            </span>
                        </div>
                        {isSelected && <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 animate-pulse">EDITANDO</span>}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 min-h-[2.5em]">
                        {col.descripcion || "Sin descripción disponible."}
                    </p>

                    {/* Stats / Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                        {col.criterios?.filter(c => c.tipo === 'porcategoria').slice(0, 3).map((c, i) => (
                            <span key={i} className="px-2 py-1 text-[10px] rounded bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                {c.params.categoriaDeseada}
                            </span>
                        ))}
                        {(col.criterios?.filter(c => c.tipo === 'porcategoria').length > 3) && (
                            <span className="px-2 py-1 text-[10px] text-gray-500">+ más</span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200/50 dark:border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => onEditar(col)}
                            className="flex-1 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                            EDITAR
                        </button>
                        <button 
                            onClick={() => onEliminar(col.handle)}
                            className="py-1.5 px-3 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            );
        })}
    </div>
  );
};

export default ColeccionesList;