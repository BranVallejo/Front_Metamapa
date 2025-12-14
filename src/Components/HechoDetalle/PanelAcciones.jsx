import React from "react";
import { Link } from "react-router-dom";

// 1. Recibir fechaCarga en las props
const PanelAcciones = ({ idHecho, fechaCarga }) => {
  
  // 2. Función para validar la semana
  const esEditable = () => {
    if (!fechaCarga) return false; 
    
    const fechaHecho = new Date(fechaCarga);
    const hoy = new Date();
    // 7 días en milisegundos
    const limiteMs = 7 * 24 * 60 * 60 * 1000;
    
    return (hoy - fechaHecho) < limiteMs;
  };

  const puedeEditar = esEditable();

  // 3. Estilos condicionales
  const styles = {
    // Si puede editar: Amarillo y clickeable
    primary: "group flex items-center justify-between w-full px-4 py-3 mb-2 text-sm font-semibold transition-all duration-200 rounded-xl border backdrop-blur-sm bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 hover:scale-[1.02] cursor-pointer",
    
    // Si NO puede editar: Gris y bloqueado
    disabled: "group flex items-center justify-between w-full px-4 py-3 mb-2 text-sm font-semibold transition-all duration-200 rounded-xl border backdrop-blur-sm bg-gray-200/50 dark:bg-gray-800/50 text-gray-400 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-70",
    
    // ... resto de estilos (action, neutral) ...
    action: "group flex items-center justify-between w-full px-4 py-3 mb-2 text-sm font-semibold transition-all duration-200 rounded-xl border backdrop-blur-sm bg-blue-600 hover:bg-blue-500 text-white border-transparent shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]",
    neutral: "group flex items-center justify-between w-full px-4 py-3 mb-2 text-sm font-semibold transition-all duration-200 rounded-xl border backdrop-blur-sm bg-white/5 hover:bg-white/10 text-gray-600 dark:text-gray-400 border-transparent hover:border-white/20",
  };

  return (
    <div className="w-full">
      <div className="space-y-2">
        
        {/* 4. Renderizado Condicional */}
        {puedeEditar ? (
          <Link to={`/hechos/editar/${idHecho}`} className={styles.primary}>
            <span>Editar Hecho</span>
            <span className="opacity-50 group-hover:translate-x-1 transition-transform">✎</span>
          </Link>
        ) : (
          <div className={styles.disabled} title="El periodo de edición de 1 semana ha finalizado">
            <span>Edición finalizada</span>
            <span className="text-xs border border-gray-400 rounded px-1">Expirado</span>
          </div>
        )}

        {/* ... Resto de botones ... */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300/30 dark:via-white/20 to-transparent my-4" />

        <Link to="/hechos/nuevo" className={styles.action}>
            <span>+ Reportar Nuevo</span>
            <span className="text-lg leading-none">+</span>
        </Link>
        
        <Link to="/misHechos" className={styles.neutral}>
            <span>Ver todos mis hechos</span>
            <span className="opacity-50">→</span>
        </Link>

      </div>
    </div>
  );
};

export default PanelAcciones;