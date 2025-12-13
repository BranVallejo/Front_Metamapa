import React, { useState } from "react";
import FondoChill from "../Components/FondoDinamico/FondoChill.jsx";
import { Toaster } from "sonner";

// Importamos los sub-componentes (los crearemos a continuación)
import FuentesEstaticas from "./Fuentes/FuentesEstaticas.jsx";
import FuentesDemo from "./Fuentes/FuentesDemo.jsx";
import FuentesMetamapa from "./Fuentes/FuentesMetamapa.jsx";

const Fuentes = () => {
  const [activeTab, setActiveTab] = useState("estaticas");

  // Configuración de las pestañas
  const tabs = [
    { id: "estaticas", label: "Fuentes Estáticas" },
    { id: "demo", label: "Fuentes Demo" },
    { id: "metamapa", label: "Fuentes Metamapa" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-300">
      <Toaster richColors position="top-right" />
      <FondoChill />

      {/* Contenedor Principal Glassmorphism */}
      <div className="relative z-10 flex flex-col items-center pt-24 px-4 pb-10 min-h-screen">
        
        {/* Encabezado */}
        <div className="w-full max-w-5xl mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-100 drop-shadow-sm mb-2">
            Gestión de Fuentes
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Administra los orígenes de datos de tu mapa
          </p>
        </div>

        {/* Selector de Pestañas (Segmented Control estilo iOS/Airbnb) */}
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

        {/* Área de Contenido (Renderizado Condicional) */}
        <div className="w-full max-w-6xl animate-fadeIn">
          {activeTab === "estaticas" && <FuentesEstaticas />}
          {activeTab === "demo" && <FuentesDemo />}
          {activeTab === "metamapa" && <FuentesMetamapa />}
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

export default Fuentes;