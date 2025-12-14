import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";

// Auth
import { estaLogueado } from "../utils/auth"; // ajustá el path si hace falta

// Fondo
import FondoChill from "../Components/FondoDinamico/FondoChill";

const MisHechos = () => {
  const [misHechos, setMisHechos] = useState([]);
  const [loading, setLoading] = useState(false);

  const logueado = estaLogueado();

  useEffect(() => {
    // 🚫 Si NO está logueado: no fetch, no error, no loading
    if (!logueado) {
      setMisHechos([]);
      setLoading(false);
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.userId) {
      console.error("No se encontró ID de usuario en localStorage");
      return;
    }

    setLoading(true);

    fetch(
      `${
        import.meta.env.VITE_URL_INICIAL_GESTOR
      }/publica/hechos?idContribuyente=${userData.userId}`,
      { method: "GET" }
    )
      .then((response) => {
        if (!response.ok) throw new Error(`Error ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (data?.hechos) {
          setMisHechos(data.hechos);
        }
      })
      .catch((error) => {
        console.error("Error al cargar:", error);
        toast.error("No se pudieron cargar tus hechos");
      })
      .finally(() => setLoading(false));
  }, [logueado]);

  // Helper para el color del estado
  const getStatusColor = (estado) => {
    const status = estado?.toLowerCase() || "";
    if (status.includes("visible") || status.includes("aprobado"))
      return "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]";
    if (status.includes("pendiente") || status.includes("revision"))
      return "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]";
    return "bg-gray-400";
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
              GESTIÓN Y SEGUIMIENTO DE REPORTES
            </p>
          </div>

          {/* ✅ SIEMPRE visible: usuario anónimo o logueado */}
          <Link
            to="/hechos/nuevo"
            className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-blue-600 font-lg rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none ring-offset-2 focus:ring-2 ring-blue-500 w-full md:w-auto overflow-hidden"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
            <span className="relative flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo Reporte
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
            {/* 🔒 KPI SOLO SI ESTÁ LOGUEADO */}
            {logueado && (
              <div className="md:col-span-2 lg:col-span-3 mb-4">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-sm">
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                    Total Reportados
                  </span>
                  <span className="px-3 py-0.5 bg-white dark:bg-gray-700 rounded-full font-mono font-bold text-blue-600 dark:text-blue-400">
                    {misHechos.length}
                  </span>
                </div>
              </div>
            )}

            {/* TARJETAS (solo habrá si hubo fetch) */}
            {misHechos.map((hecho) => (
              <Link
                key={hecho.id}
                to={`/hechos/${hecho.id}`}
                className="group relative flex flex-col justify-between p-6 h-full min-h-[200px] bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500" />

                <div className="relative z-10 flex justify-between items-start mb-4">
                  <div className="bg-white/50 dark:bg-white/10 p-2 rounded-lg backdrop-blur-md">
                    <span className="text-2xl">📍</span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-black/40 rounded-full backdrop-blur-sm border border-white/20">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(
                        hecho.estado
                      )}`}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                      {hecho.estado || "Enviado"}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 mb-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
                    {hecho.titulo || "Sin título"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide opacity-80">
                    {hecho.categoria || "General"}
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between border-t border-gray-200/50 dark:border-white/5 pt-4 mt-auto">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    Ver detalle →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisHechos;
