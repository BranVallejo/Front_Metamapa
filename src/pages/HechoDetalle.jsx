import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockHechos } from '../data/mockHechos'; // Importamos los mismos datos

const HechoDetalle = () => {
  const { id } = useParams(); // Obtiene el 'id' de la URL (ej: /hechos/1)
  const navigate = useNavigate();

  // Busca el hecho en nuestros datos. En el futuro, harías un fetch por ID.
  const hecho = mockHechos.find((h) => h.id === parseInt(id));

  // Estado para el carrusel de imágenes
  const [imagenActual, setImagenActual] = useState(0);

  // Funciones para el carrusel
  const irImagenSiguiente = () => {
    setImagenActual((prev) => (prev === hecho.imagenes.length - 1 ? 0 : prev + 1));
  };
  const irImagenAnterior = () => {
    setImagenActual((prev) => (prev === 0 ? hecho.imagenes.length - 1 : prev - 1));
  };
  
  // Si no se encuentra el hecho (ej: ID inválido)
  if (!hecho) {
    return (
      <div className="text-center p-10 dark:text-white">
        <h1 className="text-3xl font-bold">Hecho no encontrado</h1>
        <Link to="/misHechos" className="text-blue-600 hover:underline">
          Volver a la lista
        </Link>
      </div>
    );
  }

  // Función para formatear fechas (puedes mejorarla)
  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleString('es-AR');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        
        {/* --- Encabezado con Título y Botones --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{hecho.titulo}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">{hecho.categoria}</p>
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600">
              Editar Hecho
            </button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600">
              Ocultar Hecho
            </button>
            <Link
              to="/misHechos"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg shadow hover:bg-gray-300"
            >
              Volver a la Lista
            </Link>
          </div>
        </div>

        {/* --- Contenido Principal (2 columnas) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda (Información) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Datos Principales */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Datos Principales</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="text-sm">
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Título</dt>
                  <dd className="text-gray-900 dark:text-white">{hecho.titulo}</dd>
                </div>
                <div className="text-sm">
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Categoría</dt>
                  <dd className="text-gray-900 dark:text-white">{hecho.categoria}</dd>
                </div>
                <div className="text-sm">
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Fecha del Acontecimiento</dt>
                  <dd className="text-gray-900 dark:text-white">{formatearFecha(hecho.fechaAcontecimiento)}</dd>
                </div>
                <div className="text-sm">
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Estado</dt>
                  <dd className="text-gray-900 dark:text-white">{hecho.estado}</dd>
                </div>
              </dl>
            </div>

            {/* Ubicación */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Ubicación</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="text-sm">
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Latitud</dt>
                  <dd className="text-gray-900 dark:text-white">{hecho.latitud}</dd>
                </div>
                <div className="text-sm">
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Longitud</dt>
                  <dd className="text-gray-900 dark:text-white">{hecho.longitud}</dd>
                </div>
              </dl>
            </div>
            
            {/* Descripción */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Descripción</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{hecho.descripcion}</p>
            </div>

            {/* Multimedia Adjunta (Carrusel) */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Multimedia Adjunta</h3>
              {hecho.imagenes.length > 0 ? (
                <div className="relative w-full">
                  <img 
                    src={hecho.imagenes[imagenActual]} 
                    alt={`Imagen ${imagenActual + 1} del hecho`}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {hecho.imagenes.length > 1 && (
                    <>
                      <button 
                        onClick={irImagenAnterior} 
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
                      >
                        &#10094; {/* Flecha izquierda */}
                      </button>
                      <button 
                        onClick={irImagenSiguiente} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
                      >
                        &#10095; {/* Flecha derecha */}
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-2 py-1 rounded">
                    {imagenActual + 1} / {hecho.imagenes.length}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No hay imágenes adjuntas.</p>
              )}
            </div>

            {/* Información de Reporte */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Información de Reporte</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="text-sm">
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Reportado Por</dt>
                  <dd className="text-gray-900 dark:text-white">{hecho.reportadoPor}</dd>
                </div>
                <div className="text-sm">
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Fecha de Creación</dt>
                  <dd className="text-gray-900 dark:text-white">{formatearFecha(hecho.fechaCreacion)}</dd>
                </div>
                <div className="text-sm">
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Última Modificación</dt>
                  <dd className="text-gray-900 dark:text-white">{formatearFecha(hecho.ultimaModificacion)}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Columna Derecha (Acciones e Info) */}
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
                  to="/misHechos"
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
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Fecha de Creación</dt>
                  <dd className="text-gray-900 dark:text-white">{formatearFecha(hecho.fechaCreacion)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Última Modificación</dt>
                  <dd className="text-gray-900 dark:text-white">{formatearFecha(hecho.ultimaModificacion)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Reportado por</dt>
                  <dd className="text-gray-900 dark:text-white">{hecho.reportadoPor}</dd>
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