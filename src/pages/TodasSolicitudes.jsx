import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
// 1. Importamos el fondo
import FondoChill from "../Components/FondoDinamico/FondoChill";

const ModuloSolicitudesAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(null);

  const API_BASE_URL = "http://localhost:8500/gestordatos/publica";

  // Cargar solicitudes pendientes
  const cargarSolicitudes = async () => {
    try {
      setCargando(true);
      const response = await fetch(`${API_BASE_URL}/solicitudes/pendientes`);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Solicitudes cargadas:", data);
      setSolicitudes(data);
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
      toast.error("Error al cargar las solicitudes", {
        description: "Verifica la conexión con el servidor."
      });
    } finally {
      setCargando(false);
    }
  };

  // Cargar solicitudes al inicio
  useEffect(() => {
    cargarSolicitudes();
  }, []);

  // Procesar solicitud (aceptar o rechazar)
  const procesarSolicitud = async (solicitudId, accion) => {
    const toastId = toast.loading(`Procesando solicitud...`);
    
    try {
      setProcesando(solicitudId);

      const endpoint = `${API_BASE_URL}/solicitudes/${accion}?id=${solicitudId}`;

      console.log(`📤 Enviando solicitud a: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📥 Status de respuesta:", response.status);
      console.log("📥 OK:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("❌ Error response:", errorText);
        throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
      }

      const resultado = await response.json();
      console.log(`✅ Solicitud ${accion}da:`, resultado);

      // Recargar la lista de solicitudes
      await cargarSolicitudes();

      const mensajeAccion = accion === "aceptar" ? "aceptada" : "rechazada";
      toast.success(`Solicitud ${mensajeAccion} correctamente`, {
        id: toastId,
        duration: 3000
      });

    } catch (error) {
      console.error(`❌ Error al ${accion} solicitud:`, error);
      toast.error(`Error al ${accion} la solicitud`, {
        id: toastId,
        description: error.message,
        duration: 5000
      });
    } finally {
      setProcesando(null);
    }
  };

  return (
    // Contenedor principal con posición relativa para el fondo
    <div className="min-h-screen relative overflow-hidden transition-colors duration-300 font-sans text-gray-800 dark:text-gray-100">
      
      {/* 2. Fondo Chill Animado */}
      <FondoChill />
      
      {/* Toaster */}
      <Toaster richColors position="top-right" />

      {/* Contenido (z-10 para estar sobre el fondo) */}
      <div className="relative z-10 pt-28 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
        
        {/* Header con efecto Glass */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/40 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 drop-shadow-sm">
              Gestión de Solicitudes
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 font-medium">
              Revisa y gestiona las solicitudes de reporte pendientes
            </p>
          </div>
          <button
            onClick={() => {
                cargarSolicitudes();
                toast.info("Actualizando lista...");
            }}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Actualizar
          </button>
        </div>

        {/* Estado de carga */}
        {cargando ? (
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl shadow-lg p-12 text-center border border-white/20 dark:border-white/5">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Cargando solicitudes...</p>
          </div>
        ) : (
          <>
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 border-t border-r border-b border-white/40 dark:border-white/10">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Por Revisar</h3>
                <p className="text-4xl font-black text-gray-800 dark:text-white">
                  {solicitudes.length}
                </p>
              </div>
            </div>

            {/* Lista de Solicitudes */}
            <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 dark:border-white/10">
              <div className="p-6 border-b border-gray-200/50 dark:border-white/10">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-wide opacity-90">
                  Solicitudes Pendientes
                </h2>
              </div>

              {solicitudes.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="text-gray-300 dark:text-gray-600 text-6xl mb-4 grayscale opacity-50">📝</div>
                  <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">
                    No hay solicitudes pendientes
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Todas las solicitudes han sido procesadas. ¡Buen trabajo!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200/50 dark:divide-white/10">
                  {solicitudes.map((solicitud) => (
                    <div
                      key={solicitud.id}
                      className="p-6 hover:bg-white/40 dark:hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/50 uppercase tracking-wide">
                              {solicitud.estado}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">
                              ID: {solicitud.id}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">
                              Hecho: {solicitud.idHechoAsociado}
                            </span>
                          </div>

                          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed font-medium">
                            "{solicitud.justificacion}"
                          </p>

                          <div className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 mt-3 uppercase tracking-wider">
                            <svg
                              className="w-4 h-4 mr-1.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Recibida recientemente
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                        <button
                          onClick={() => procesarSolicitud(solicitud.id, "aceptar")}
                          disabled={procesando === solicitud.id}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold hover:-translate-y-0.5"
                        >
                          {procesando === solicitud.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Procesando...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Aceptar Solicitud
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => procesarSolicitud(solicitud.id, "rechazar")}
                          disabled={procesando === solicitud.id}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold hover:-translate-y-0.5"
                        >
                          {procesando === solicitud.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Procesando...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Rechazar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModuloSolicitudesAdmin;