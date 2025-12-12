import React from "react";
import { Link } from "react-router-dom";

const PanelAcciones = ({ idHecho }) => {
  // Estilos base para los botones del HUD
  const btnBase = "group flex items-center justify-between w-full px-4 py-3 mb-2 text-sm font-semibold transition-all duration-200 rounded-xl border backdrop-blur-sm";
  
  // Variantes de color "Glass"
  const styles = {
    primary: `${btnBase} bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 hover:scale-[1.02]`,
    secondary: `${btnBase} bg-gray-500/5 hover:bg-gray-500/10 text-gray-600 dark:text-gray-300 border-gray-500/20 hover:scale-[1.02]`,
    action: `${btnBase} bg-blue-600 hover:bg-blue-500 text-white border-transparent shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]`,
    neutral: `${btnBase} bg-white/5 hover:bg-white/10 text-gray-600 dark:text-gray-400 border-transparent hover:border-white/20`,
  };

  return (
    <div className="w-full">
      <div className="space-y-2">
        <Link to={`/hechos/editar/${idHecho}`} className={styles.primary}>
          <span>Editar Hecho</span>
          <span className="opacity-50 group-hover:translate-x-1 transition-transform">✎</span>
        </Link>

        <button className={styles.secondary}>
          <span>Ocultar Hecho</span>
          <span className="opacity-50 group-hover:opacity-100">👁‍🗨</span>
        </button>

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