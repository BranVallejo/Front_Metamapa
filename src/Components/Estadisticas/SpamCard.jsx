import React from 'react';

const SpamCard = ({ data, onExport }) => {
  // Calculamos el total (asegurando que sea 0 si no hay data)
  const totalSpam = data?.reduce((acc, curr) => acc + (curr.cantidadSpam || 0), 0) || 0;

  return (
    // CONTENEDOR: Usamos el mismo estilo base que CategoriaDestacada pero con tinte rojo
    <div className="h-full relative overflow-hidden rounded-3xl p-8 transition-all duration-300
                    bg-white/80 dark:bg-gray-900/60 
                    border border-red-200/50 dark:border-red-900/30
                    backdrop-blur-xl shadow-xl hover:shadow-2xl group">
      
      {/* Fondo Gradiente Sutil (Rojo muy suave) */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-transparent dark:from-red-900/10 dark:to-transparent pointer-events-none" />

      {/* Icono de Fondo Decorativo */}
      <div className="absolute -right-6 -bottom-6 text-red-500/10 dark:text-red-500/5 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
        <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        
        {/* Encabezado y Botón Exportar */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-1">
              Seguridad
            </h3>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Solicitudes Spam
            </h2>
          </div>
          
          <button 
            onClick={onExport}
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors flex items-center gap-1 bg-red-100/50 dark:bg-red-900/30 px-3 py-1 rounded-full"
          >
            Exportar CSV 
            <span className="text-lg leading-none">↓</span>
          </button>
        </div>

        {/* Dato Central */}
        <div className="flex flex-col items-start mt-2">
          <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-500 dark:to-orange-500 drop-shadow-sm">
            {totalSpam}
          </span>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Detectadas en el período
          </p>
        </div>

        {/* Barra decorativa inferior */}
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-8 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" 
            style={{ width: `${Math.min(totalSpam * 5, 100)}%` }} // Simula una barra de progreso basada en la cantidad (tope 20 para ejemplo)
          />
        </div>

      </div>
    </div>
  );
};

export default SpamCard;