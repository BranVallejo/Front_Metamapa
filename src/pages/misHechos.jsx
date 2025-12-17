import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

// Componentes
import FondoChill from "../Components/FondoDinamico/FondoChill";

// --- ICONOS ---
const IconPlus = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const IconMapPin = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconCalendar = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MisHechos = () => {
  const [misHechos, setMisHechos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarMisHechos();
  }, []);

  const cargarMisHechos = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      
      if (!userData || !userData.userId) {
        toast.error("No se encontró usuario logueado.");
        setLoading(false);
        return;
      }

      const url = `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica/hechos?usuarioId=${userData.userId}`;

      const response = await fetch(url, { method: "GET" });

      if (response.status === 204) {
        setMisHechos([]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setMisHechos(data);
      } else {
        console.warn("Formato inesperado del backend:", data);
        setMisHechos([]);
      }

    } catch (error) {
      console.error("Error al cargar:", error);
      toast.error("No se pudieron cargar tus hechos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative transition-colors duration-500 text-gray-800 dark:text-gray-100 font-sans">
      <FondoChill />
      <Toaster richColors position="top-right" />

      <div className="relative z-10 pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div className="space-y-2 w-full md:w-auto">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 drop-shadow-sm">
              Mis Hechos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium tracking-wide">
              HISTORIAL DE TUS REPORTES
            </p>
          </div>

          <Link
            to="/reportar"
            className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-blue-600 font-lg rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none ring-offset-2 focus:ring-2 ring-blue-500 w-full md:w-auto overflow-hidden"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
            <span className="relative flex items-center gap-2">
              <IconPlus /> Nuevo Reporte
            </span>
          </Link>
        </div>

        {/* CONTENIDO */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* KPI Resumen */}
            <div className="md:col-span-2 lg:col-span-3 mb-2">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-sm">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                  Total Reportados
                </span>
                <span className="px-3 py-0.5 bg-white dark:bg-gray-700 rounded-full font-mono font-bold text-blue-600 dark:text-blue-400">
                  {misHechos.length}
                </span>
              </div>
            </div>

            {/* LISTA DE HECHOS */}
            {misHechos.map((hecho) => (
              <Link
                key={hecho.id}
                to={`/hechos/${hecho.id}`} // <--- 🔥 AHORA ES UN LINK QUE LLEVA AL DETALLE
                className="group relative flex flex-col justify-between p-6 h-full min-h-[200px] bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500" />

                <div className="relative z-10 flex justify-between items-start mb-4">
                  <div className="bg-white/50 dark:bg-white/10 p-2 rounded-lg backdrop-blur-md">
                    <span className="text-xl">📍</span>
                  </div>
                  
                  {/* Fecha */}
                  <div className="flex items-center gap-1 px-3 py-1 bg-white/80 dark:bg-black/40 rounded-full backdrop-blur-sm border border-white/20 text-xs text-gray-500 dark:text-gray-400 font-mono">
                    <IconCalendar />
                    {hecho.fechaAcontecimiento ? new Date(hecho.fechaAcontecimiento).toLocaleDateString() : "-"}
                  </div>
                </div>

                <div className="relative z-10 mb-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {hecho.titulo || "Sin título"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide opacity-80 mb-2">
                    {hecho.categoria || "General"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {hecho.descripcion}
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between border-t border-gray-200/50 dark:border-white/5 pt-4 mt-auto">
                   <div className="flex items-center gap-1 text-xs text-gray-400">
                      <IconMapPin />
                      <span>{parseFloat(hecho.latitud).toFixed(3)}, {parseFloat(hecho.longitud).toFixed(3)}</span>
                   </div>
                   
                   {/* Si hay sugerencia, mostramos un aviso */}
                   {hecho.sugerencia_cambio && (
                     <span className="flex items-center gap-1 text-xs font-bold text-amber-500 animate-pulse">
                        ⚠️ Sugerencia Admin
                     </span>
                   )}
                </div>
              </Link>
            ))}

            {/* ESTADO VACÍO */}
            {misHechos.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white/30 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                    <div className="text-6xl mb-4 opacity-50 grayscale">📭</div>
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">
                        Aún no has reportado nada
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                        Tus contribuciones aparecerán aquí. ¡Anímate a reportar un hecho para ayudar a la comunidad!
                    </p>
                    <Link 
                        to="/reportar"
                        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-transform hover:scale-105"
                    >
                        Crear mi primer reporte
                    </Link>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisHechos;