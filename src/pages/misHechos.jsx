// src/pages/MisHechos.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HechoRow from '../Components/HechoRow';
import FondoChill from '../Components/FondoDinamico/FondoChill';

const MisHechos = () => {
  const [misHechos, setMisHechos] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.userId) {
      console.error("No se encontró ID de usuario en localStorage");
      return;
    }

    fetch(
      `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica/hechos?idContribuyente=${userData.userId}`,
      { method: "GET" }
    )
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && data.hechos && data.hechos.length > 0) {
          setMisHechos(data.hechos);
        } else {
          setMisHechos([]);
        }
      })
      .catch(error => {
        console.error("Error al cargar hechos:", error);
        setMisHechos([]);
      });

  }, []);

  return (
    <>
      <FondoChill />

      {/* Contenedor Principal */}
      <div className="min-h-screen relative z-10">
        
        <div className="container mx-auto p-4 md:p-8">

          {/* --- BLOQUE HEADER (TÍTULO Y BOTÓN) --- */}
          {/* Usamos 'relative' para controlar capas */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 relative">
            
            {/* TÍTULO: 
                Le agregamos 'pointer-events-none' para que NO intercepte clics.
                El usuario podrá hacer clic "a través" del texto si algo se solapa. 
            */}
            <div className="relative z-0 pointer-events-none">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 drop-shadow-md">
                Mis Hechos
              </h1>
            </div>

            {/* BOTÓN: 
                1. 'z-30' para estar MUY por encima.
                2. 'pointer-events-auto' para reactivar los clics (necesario porque está al lado de elementos none).
                3. 'mt-2' extra en móvil para asegurar separación física.
            */}
            <div className="w-full sm:w-auto relative z-30 mt-2 sm:mt-0">
              <Link
                to="/hechos/nuevo"
                className="pointer-events-auto block w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 text-center font-medium active:scale-95 transform hover:scale-105 select-none"
              >
                + Reportar Nuevo Hecho
              </Link>
            </div>
          </div>

          {/* --- Panel de Resumen --- */}
          {/* z-10 para que esté en su capa normal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
            <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30 border-l-4 border-l-blue-500">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Total de Mis Hechos</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {misHechos.length}
              </p>
            </div>
          </div>

          {/* --- Tabla de Hechos --- */}
          {misHechos.length > 0 ? (
            <div className="relative z-10 bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700/30">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead className="bg-gray-100/50 dark:bg-gray-700/50 backdrop-blur-sm">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50 dark:divide-gray-600/50">
                    {misHechos.map((hecho) => (
                      <HechoRow key={hecho.id} hecho={hecho} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="relative z-10 text-center py-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/30">
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">Aún no has reportado ningún hecho.</p>
              <Link
                 to="/hechos/nuevo"
                 className="text-blue-600 dark:text-blue-400 hover:text-blue-500 font-bold underline decoration-2 underline-offset-4"
              >
                 ¡Comienza reportando el primero!
              </Link>
            </div>
          )}
          
          {/* Spacer inferior */}
          <div className="h-24 md:h-0"></div>
        </div>
      </div>
    </>
  );
};

export default MisHechos;