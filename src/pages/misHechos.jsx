// src/pages/MisHechos.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HechoRow from '../Components/HechoRow'; // <-- 1. IMPORTAMOS EL NUEVO COMPONENTE

const MisHechos = () => {
  const [misHechos, setMisHechos] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.userId) {
      console.error("No se encontró ID de usuario en localStorage");
      return;
    }

    // 👇 CORREGIDO: Usando tu variable de entorno correcta
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

          // ¡AGREGÁ ESTA LÍNEA PARA DEPURAR!
          console.log("Objeto 'hecho' recibido del backend:", data.hechos[0]);

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
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">

      {/* --- Título y Botón Nuevo --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Mis Hechos
        </h1>
        <Link
          to="/hechos/nuevo"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
        >
          + Reportar Nuevo Hecho
        </Link>
      </div>

      {/* --- Panel de Resumen --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Mis Hechos</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {misHechos.length}
          </p>
        </div>
      </div>

      {/* --- Tabla de Hechos --- */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            {/* Encabezado de la tabla */}
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>

            {/* --- CUERPO DE LA TABLA (MODIFICADO) --- */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {misHechos.map((hecho) => (
                <HechoRow key={hecho.id} hecho={hecho} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MisHechos;