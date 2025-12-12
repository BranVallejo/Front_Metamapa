import React, { useState } from "react";

const getFileType = (url) => {
  const extension = url.split(".").pop().toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];
  if (imageExtensions.includes(extension)) return "image";
  if (videoExtensions.includes(extension)) return "video";
  return "unknown";
};

const PanelMultimedia = ({ archivos }) => {
  const [imagenActual, setImagenActual] = useState(0);

  const archivosMultimedia = archivos?.filter((archivo) => {
      const tipo = getFileType(archivo);
      return tipo === "image" || tipo === "video";
    }) || [];

  if (archivosMultimedia.length === 0) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300/20 rounded-2xl text-gray-400 bg-white/5 backdrop-blur-sm">
        <span className="text-3xl mb-2 opacity-50">📷</span>
        <span className="text-xs font-bold uppercase tracking-wider opacity-50">Sin evidencia visual</span>
      </div>
    );
  }

  const irImagenSiguiente = () => setImagenActual((prev) => (prev === archivosMultimedia.length - 1 ? 0 : prev + 1));
  const irImagenAnterior = () => setImagenActual((prev) => (prev === 0 ? archivosMultimedia.length - 1 : prev - 1));

  const archivoActual = archivosMultimedia[imagenActual];
  const tipoArchivo = archivoActual ? getFileType(archivoActual) : null;

  return (
    <div className="w-full">
      {/* Visor Principal */}
      <div className="relative w-full h-96 bg-black/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl group border border-white/10">
        <div className="w-full h-full flex items-center justify-center">
          {tipoArchivo === "image" ? (
            <img
              src={archivoActual}
              alt="Evidencia"
              className="max-w-full max-h-full object-contain"
            />
          ) : tipoArchivo === "video" ? (
            <video controls className="max-w-full max-h-full">
              <source src={archivoActual} type="video/mp4" />
            </video>
          ) : null}
        </div>

        {archivosMultimedia.length > 1 && (
          <>
            <button
              onClick={irImagenAnterior}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/10"
            >
              ←
            </button>
            <button
              onClick={irImagenSiguiente}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/10"
            >
              →
            </button>
            <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-mono text-white/90 border border-white/10">
              {imagenActual + 1} / {archivosMultimedia.length}
            </div>
          </>
        )}
      </div>

      {/* Tira de Miniaturas */}
      {archivosMultimedia.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {archivosMultimedia.map((archivo, idx) => {
            const tipo = getFileType(archivo);
            return (
              <button
                key={idx}
                onClick={() => setImagenActual(idx)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  idx === imagenActual
                    ? "border-blue-500 shadow-lg shadow-blue-500/20 scale-105"
                    : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                }`}
              >
                {tipo === "image" ? (
                  <img src={archivo} alt="thumb" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-xs">VID</div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PanelMultimedia;