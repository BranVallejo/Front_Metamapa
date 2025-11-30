// src/Components/HechoDetalle/PanelMultimedia.jsx
import React, { useState } from "react";

// Función auxiliar para determinar el tipo de archivo
const getFileType = (url) => {
  const extension = url.split(".").pop().toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];

  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (videoExtensions.includes(extension)) {
    return "video";
  } else {
    return "unknown";
  }
};

const PanelMultimedia = ({ archivos }) => {
  const [imagenActual, setImagenActual] = useState(0);

  const irImagenSiguiente = () => {
    setImagenActual((prev) => (prev === archivos.length - 1 ? 0 : prev + 1));
  };

  const irImagenAnterior = () => {
    setImagenActual((prev) => (prev === 0 ? archivos.length - 1 : prev - 1));
  };

  // Filtrar solo archivos de imagen y video
  const archivosMultimedia =
    archivos?.filter((archivo) => {
      const tipo = getFileType(archivo);
      return tipo === "image" || tipo === "video";
    }) || [];

  const archivoActual = archivosMultimedia[imagenActual];
  const tipoArchivo = archivoActual ? getFileType(archivoActual) : null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Multimedia Adjunta ({archivosMultimedia.length})
      </h3>

      {archivosMultimedia.length > 0 ? (
        <div className="relative w-full">
          {/* Contenedor principal con padding y límites fijos */}
          <div className="w-full h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden p-4">
            {tipoArchivo === "image" ? (
              <img
                src={archivoActual}
                alt={`Imagen ${imagenActual + 1} del hecho`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E";
                }}
              />
            ) : tipoArchivo === "video" ? (
              <video
                controls
                className="max-w-full max-h-full"
                preload="metadata"
              >
                <source src={archivoActual} type="video/mp4" />
                Tu navegador no soporta el elemento video.
              </video>
            ) : (
              <div className="text-center p-4">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">
                  Tipo de archivo no soportado
                </p>
              </div>
            )}
          </div>

          {/* Controles de navegación */}
          {archivosMultimedia.length > 1 && (
            <>
              <button
                onClick={irImagenAnterior}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10"
              >
                &#10094;
              </button>
              <button
                onClick={irImagenSiguiente}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10"
              >
                &#10095;
              </button>

              {/* Contador - arriba a la derecha */}
              <div className="absolute top-4 right-4 bg-black/80 text-white text-sm px-3 py-1 rounded-full z-10">
                {imagenActual + 1} / {archivosMultimedia.length}
              </div>

              {/* Indicador de tipo de archivo - arriba a la izquierda */}
              <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
                {tipoArchivo === "image"
                  ? "IMAGEN"
                  : tipoArchivo === "video"
                  ? "VIDEO"
                  : "ARCHIVO"}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">
            No hay multimedia adjunta.
          </p>
        </div>
      )}

      {/* Miniaturas si hay más de un archivo */}
      {archivosMultimedia.length > 1 && (
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {archivosMultimedia.map((archivo, idx) => {
              const tipo = getFileType(archivo);
              return (
                <button
                  key={idx}
                  onClick={() => setImagenActual(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all ${
                    idx === imagenActual
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {tipo === "image" ? (
                    <img
                      src={archivo}
                      alt={`Miniatura ${idx + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : tipo === "video" ? (
                    <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelMultimedia;
