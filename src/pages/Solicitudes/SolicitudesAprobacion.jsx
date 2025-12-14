import React, { useState, useEffect } from "react";
import { toast } from "sonner";

// --- ICONOS ---
const IconCheck = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>;
const IconX = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconMapPin = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconUser = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const IconRefresh = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;

const SolicitudesAprobacion = () => {
  const [loading, setLoading] = useState(false);
  const [hechos, setHechos] = useState([]);
  const [procesando, setProcesando] = useState(null);

  // URL Base
  const API_URL = "http://localhost:8080/gestordatos/publica/hechos";

  // --- CARGAR HECHOS EN REVISIÓN ---
  useEffect(() => {
    cargarHechosPendientes();
  }, []);

  const cargarHechosPendientes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}?estadoDeseado=EN_REVISION`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron cargar los hechos.`);
      }

      const data = await response.json();
      console.log("Respuesta API:", data);
      
      // 👇 CORRECCIÓN AQUÍ:
      // El backend devuelve { hechos: [...], estado: "ok" }
      // Así que accedemos a data.hechos
      if (data.hechos && Array.isArray(data.hechos)) {
        setHechos(data.hechos);
      } else {
        setHechos([]);
      }

    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar hechos pendientes");
    } finally {
      setLoading(false);
    }
  };

  // --- ACCIONES (Aprobar/Rechazar) ---
  const gestionarHecho = async (idHecho, accion) => {
    // accion: "APROBAR" (Publicar) | "RECHAZAR" (Eliminar/Bajar)
    
    // 🛑 TODO: NECESITO EL ENDPOINT PARA CAMBIAR EL ESTADO
    toast.info(`Funcionalidad pendiente: ${accion} hecho ${idHecho}. (Falta endpoint)`);
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* Header Sección */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-lg p-6 mb-8 border border-white/40 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-white">
            Validación de Hechos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Revisa los hechos subidos por usuarios antes de que sean públicos.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full text-sm font-bold text-blue-700 dark:text-blue-300">
            {hechos.length} Pendientes
            </div>
            <button
            onClick={cargarHechosPendientes}
            disabled={loading}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50"
            title="Actualizar lista"
            >
            <IconRefresh />
            </button>
        </div>
      </div>

      {/* Grid de Tarjetas */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hechos.map((hecho) => (
            <div
              key={hecho.id}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Contenido */}
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-block px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-xs font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wide border border-blue-100 dark:border-blue-900/30">
                    {hecho.categoria || "Sin categoría"}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {hecho.fechaAcontecimiento ? new Date(hecho.fechaAcontecimiento).toLocaleDateString() : "Fecha desc."}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                  {hecho.titulo || "Hecho sin título"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                  {hecho.descripcion || "Sin descripción disponible."}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6 border-t border-gray-200/50 dark:border-gray-700/50 pt-3">
                  <div className="flex items-center gap-1" title="Autor">
                    <IconUser /> 
                    <span className="font-medium truncate max-w-[100px]">
                        {hecho.nombre_contribuyente ? `${hecho.nombre_contribuyente} ${hecho.apellido_contribuyente || ''}` : "Anónimo"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1" title="Ubicación">
                    <IconMapPin /> 
                    <span className="truncate">
                        {/* Parseamos a float por si vienen como string */}
                        {parseFloat(hecho.latitud).toFixed(4)}, {parseFloat(hecho.longitud).toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => gestionarHecho(hecho.id, "RECHAZAR")}
                  disabled={procesando === hecho.id}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-sm transition-colors disabled:opacity-50"
                >
                  <IconX /> Rechazar
                </button>
                <button
                  onClick={() => gestionarHecho(hecho.id, "APROBAR")}
                  disabled={procesando === hecho.id}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-lg shadow-green-500/20 transition-all transform active:scale-95 disabled:opacity-50"
                >
                  <IconCheck /> Publicar
                </button>
              </div>
            </div>
          ))}

          {hechos.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white/40 dark:bg-black/20 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-4xl mb-3 grayscale opacity-50">✅</div>
              <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300">
                Todo al día
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No hay hechos pendientes de revisión.
              </p>
            </div>
          )}
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SolicitudesAprobacion;