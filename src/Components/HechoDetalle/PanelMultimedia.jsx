// src/Components/HechoDetalle/PanelMultimedia.jsx
import React, { useState } from 'react';

const PanelMultimedia = ({ archivos }) => {
  const [imagenActual, setImagenActual] = useState(0);

  const irImagenSiguiente = () => {
    setImagenActual((prev) => (prev === archivos.length - 1 ? 0 : prev + 1));
  };

  const irImagenAnterior = () => {
    setImagenActual((prev) => (prev === 0 ? archivos.length - 1 : prev - 1));
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Multimedia Adjunta</h3>
      {archivos && archivos.length > 0 ? (
        <div className="relative w-full">
          <img 
            src={archivos[imagenActual]} 
            alt={`Imagen ${imagenActual + 1} del hecho`}
            className="w-full h-96 object-cover rounded-lg"
          />
          {archivos.length > 1 && (
            <>
              <button 
                onClick={irImagenAnterior} 
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
              >
                &#10094;
              </button>
              <button 
                onClick={irImagenSiguiente} 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
              >
                &#10095;
              </button>
            </>
          )}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-2 py-1 rounded">
            {imagenActual + 1} / {archivos.length}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No hay imágenes adjuntas.</p>
      )}
    </div>
  );
};

export default PanelMultimedia;