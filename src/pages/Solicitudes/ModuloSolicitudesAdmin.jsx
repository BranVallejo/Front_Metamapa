import React, { useState } from "react";
import FondoChill from "../../Components/FondoDinamico/FondoChill"; // Ajusta la ruta si es necesario
import { Toaster } from "sonner";

// Importamos los sub-componentes
import SolicitudesEliminacion from "./SolicitudesEliminacion";
import SolicitudesAprobacion from "./SolicitudesAprobacion";

const ModuloSolicitudesAdmin = () => {
  const [activeTab, setActiveTab] = useState("publicacion"); // 'publicacion' | 'eliminacion'

  const tabs = [
    { id: "publicacion", label: "Validación de Hechos" }, // Nuevo
    { id: "eliminacion", label: "Reportes de Eliminación" }, // El viejo
  ];

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-300">
      <Toaster richColors position="top-right" />
      <FondoChill />

      {/* Contenedor Principal */}
      <div className="relative z-10 flex flex-col items-center pt-24 px-4 pb-10 min-h-screen">
        
        {/* Encabezado */}
        <div className="w-full max-w-5xl mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 drop-shadow-sm mb-2">
            Centro de Moderación
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gestiona la calidad y seguridad del contenido del mapa
          </p>
        </div>

        {/* Selector de Pestañas (Segmented Control) */}
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md p-1.5 rounded-full inline-flex mb-8 shadow-lg border border-white/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md scale-105"
                    : "text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700/30"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Área de Contenido */}
        <div className="w-full max-w-6xl animate-fadeIn">
          {activeTab === "publicacion" && <SolicitudesAprobacion />}
          {activeTab === "eliminacion" && <SolicitudesEliminacion />}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ModuloSolicitudesAdmin;