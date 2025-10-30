// src/pages/HechoDetalle.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

// (Función de formateo de fecha...)
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return "No especificada";
  return new Date(fechaISO).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

const HechoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hecho, setHecho] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagenActual, setImagenActual] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(
      `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica/hechos?idBuscado=${id}`,
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
          setHecho(data.hechos[0]);
        } else {
          throw new Error(`No se encontró ningún hecho con el ID: ${id}`);
        }
      })
      .catch(err => {
        console.error("Error al cargar detalle del hecho:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [id]);


  // (Funciones del carrusel, de carga y de error...)
  const irImagenSiguiente = () => {
    if (!hecho || !hecho.archivosMultimedia) return;
    setImagenActual((prev) => (prev === hecho.archivosMultimedia.length - 1 ? 0 : prev + 1));
  };
  const irImagenAnterior = () => {
    if (!hecho || !hecho.archivosMultimedia) return;
    setImagenActual((prev) => (prev === 0 ? hecho.archivosMultimedia.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center dark:text-white text-2xl">
        Cargando detalle del hecho...
      </div>
    );
  }

  if (error || !hecho) {
    return (
      <div className="container mx-auto p-8 text-center dark:text-white">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          {error ? 'Error al cargar' : 'Hecho no encontrado'}
        </h1>
        <p className="text-lg mb-6">{error}</p>
        <Link to="/misHechos" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
          Volver a la lista
        </Link>
      </div>
    );
  }

  // --- RENDERIZADO (CON CAMBIOS) ---
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8">
      <div className="container mx-auto">

        {/* --- Encabezado (SIMPLIFICADO) --- */}
        {/* Eliminamos el grupo de botones duplicados de aquí */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{hecho.titulo}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">{hecho.categoria}</p>
          </div>
          {/* El div que contenía los botones "Editar", "Ocultar", "Volver" se eliminó */}
        </div>

        {/* --- Contenido Principal (2 columnas) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Columna Izquierda (Información) - (Sin cambios) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Datos Principales */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Datos Principales</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {/* ... (tus datos) ... */}
                <div className="text-sm">
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Título</dt>
                  <dd className="text-gray-900 dark:text-white">{hecho.titulo}</dd>
                </div>
                {/* ... etc ... */}
              </dl>
            </div>

            {/* Ubicación */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Ubicación</h3>
              {/* ... (tus datos) ... */}
            </div>

            {/* Descripción */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Descripción</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{hecho.descripcion}</p>
            </div>

            {/* Multimedia Adjunta (Carrusel) */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Multimedia Adjunta</h3>
              {/* ... (lógica del carrusel) ... */}
            </div>

            {/* Información de Reporte */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Información de Reporte</h3>
              {/* ... (tus datos) ... */}
            </div>
          </div>

          {/* Columna Derecha (Acciones e Info) - (Sin cambios) */}
          {/* Esta columna AHORA ES LA ÚNICA FUENTE DE ACCIONES */}
          <div className="lg:col-span-1 space-y-6">

            {/* Panel de Acciones */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Acciones</h3>
              <div className="flex flex-col space-y-2">
                <button className="w-full text-left px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  Editar Hecho
                </button>
                <button className="w-full text-left px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                  Ocultar Hecho
                </button>
                <Link
                  to="/misHechos" // Esta es la acción de "Volver"
                  className="block w-full text-left px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300"
                >
                  Ver Todos Mis Hechos
                </Link>
                <Link
                  to="/hechos/nuevo"
                  className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Reportar Nuevo Hecho
                </Link>
              </div>
            </div>
            
            {/* Panel de Información Adicional */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Información</h3>
              <dl className="text-sm space-y-2">
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Fecha Acontecimiento</dt>
                  <dd className="text-gray-900 dark:text-white">{formatearFecha(hecho.fechaAcontecimiento)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Reportado por</dt>
                  <dd className="text-gray-900 dark:text-white">
                    {hecho.nombre_contribuyente} {hecho.apellido_contribuyente}
                  </dd>
                </div>
              </dl>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HechoDetalle;