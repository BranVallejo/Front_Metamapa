import React, { useState, useEffect } from "react";
import { toast } from "sonner";

// --- ICONOS ---
const IconCheck = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>;
const IconX = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconAlert = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const IconRefresh = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;

const SolicitudesEliminacion = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(null); // ID de la solicitud que se está procesando

  const API_BASE_URL = `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica`;

  // --- CARGAR SOLICITUDES (GET) ---
  const cargarSolicitudes = async () => {
    try {
      setCargando(true);
      
      // Endpoint exacto que me pasaste: /solicitudes/pendientes
      const response = await fetch(`${API_BASE_URL}/solicitudes/pendientes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Agregamos el token por seguridad si el backend lo pide
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Solicitudes cargadas:", data);
      setSolicitudes(data);
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
      toast.error("Error al cargar las solicitudes", {
        description: "Verifica la conexión con el servidor.",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  // --- PROCESAR SOLICITUD (POST) ---
  const procesarSolicitud = async (solicitudId, accion) => {
    // accion puede ser: "aceptar" o "rechazar"
    const toastId = toast.loading(`Procesando solicitud...`);
    setProcesando(solicitudId);

    try {
      // Endpoint exacto que me pasaste: /solicitudes/{accion}?id={id}
      const endpoint = `${API_BASE_URL}/solicitudes/${accion}?id=${solicitudId}`;
      
      console.log(`📤 Enviando solicitud a: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
      }

      const resultado = await response.json();
      console.log(`✅ Solicitud ${accion}da:`, resultado);

      // Feedback visual
      const mensajeAccion = accion === "aceptar" ? "aceptada" : "rechazada";
      toast.success(`Solicitud ${mensajeAccion} correctamente`, { id: toastId });

      // Recargar la lista
      await cargarSolicitudes();

    } catch (error) {
      console.error(`❌ Error al ${accion} solicitud:`, error);
      toast.error(`Error al ${accion} la solicitud`, {
        id: toastId,
        description: error.message,
      });
    } finally {
      setProcesando(null);
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* --- HEADER SECCIÓN --- */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-lg p-6 mb-8 border border-white/40 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-white">
            Solicitudes de Eliminación
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            Usuarios reportaron estos hechos para ser eliminados del mapa.
          </p>
        </div>
        <button
          onClick={cargarSolicitudes}
          disabled={cargando}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 flex items-center gap-2 text-sm disabled:opacity-50"
        >
          <IconRefresh /> Actualizar
        </button>
      </div>

      {/* --- LISTADO --- */}
      {cargando ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Cargando solicitudes...</p>
        </div>
      ) : (
        <>
          {/* Contador */}
          <div className="mb-6 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold text-sm">
              {solicitudes.length}
            </span>
            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wide">
              Pendientes de revisión
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {solicitudes.length === 0 ? (
              <div className="p-16 text-center bg-white/40 dark:bg-black/20 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                <div className="text-4xl mb-4 grayscale opacity-50">🎉</div>
                <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">
                  ¡Todo limpio!
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  No hay solicitudes de eliminación pendientes por ahora.
                </p>
              </div>
            ) : (
              solicitudes.map((solicitud) => (
                <div
                  key={solicitud.id}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 dark:border-white/5 p-6 hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Icono / Estado */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
                        <IconAlert />
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-xs font-mono text-gray-500">
                          ID Solicitud: {solicitud.id}
                        </span>
                        <span className="px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-xs font-mono text-gray-500">
                          ID Hecho: {solicitud.idHechoAsociado || solicitud.idhecho}
                        </span>
                        <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-bold uppercase">
                          {solicitud.estado}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                        Motivo del Reporte:
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 italic mb-4 bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                        "{solicitud.justificacion}"
                      </p>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex flex-col gap-3 min-w-[180px]">
                      <button
                        onClick={() => procesarSolicitud(solicitud.id, "aceptar")}
                        disabled={procesando === solicitud.id}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar el hecho del mapa"
                      >
                        {procesando === solicitud.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <>
                            <IconCheck /> Aceptar (Borrar)
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => procesarSolicitud(solicitud.id, "rechazar")}
                        disabled={procesando === solicitud.id}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Descartar el reporte"
                      >
                        <IconX /> Rechazar (Ignorar)
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SolicitudesEliminacion;