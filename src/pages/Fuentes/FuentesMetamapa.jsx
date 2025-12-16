import React, { useState, useEffect } from "react";
import { toast } from "sonner";

// --- ICONOS ---
const IconPlus = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const IconGlobe = () => (
  <svg
    className="w-8 h-8 text-blue-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
);

const IconLink = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
);

const IconActivity = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const FuentesMetamapa = () => {
  const [loading, setLoading] = useState(false);
  const [fuentes, setFuentes] = useState([]);

  // Modal y Formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombreFuente: "",
    baseUrl: "",
  });

  const API_URL = `${import.meta.env.VITE_URL_INICIAL_METAMAPA}/admin/fuentes`;

  const getToken = () => localStorage.getItem("token");

  // --- 1. CARGA INICIAL ---
  useEffect(() => {
    cargarFuentes();
  }, []);

  const cargarFuentes = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 204) {
        setFuentes([]);
      } else if (response.ok) {
        const data = await response.json();
        setFuentes(data);
      } else {
        toast.error("Error al obtener fuentes MetaMapa");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión con el Gateway");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validarURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!formData.nombreFuente.trim()) {
      toast.warning("Ingresa un nombre para la fuente");
      return;
    }

    if (!formData.baseUrl.trim()) {
      toast.warning("Ingresa la URL base de la instancia MetaMapa");
      return;
    }

    if (!validarURL(formData.baseUrl)) {
      toast.warning("La URL base no tiene un formato válido");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Conectando con la instancia MetaMapa...");

    // Preparamos el payload según el endpoint
    const payload = {
      nombreFuente: formData.nombreFuente.trim(),
      baseUrl: formData.baseUrl.trim(),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Fuente MetaMapa conectada exitosamente", {
          id: toastId,
        });
        setIsModalOpen(false);
        setFormData({
          nombreFuente: "",
          baseUrl: "",
        });
        cargarFuentes();
      } else if (response.status === 400) {
        const errorData = await response.json();
        toast.error(
          `Error de conexión: ${errorData.message || "URL inválida"}`,
          {
            id: toastId,
          }
        );
      } else if (response.status === 409) {
        toast.error("Ya existe una fuente con ese nombre o URL", {
          id: toastId,
        });
      } else {
        toast.error("Error al registrar la fuente", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de red al conectar", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "Sin sincronización";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString() + " " + fecha.toLocaleTimeString();
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Fuentes MetaMapa (Otras Instancias)
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <IconPlus />
          Conectar Instancia
        </button>
      </div>

      {/* Grid de Tarjetas */}
      {loading && fuentes.length === 0 ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando fuentes MetaMapa...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fuentes.map((fuente) => (
            <div
              key={fuente.id}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4 mb-3">
                <div
                  className={`p-3 rounded-xl ${
                    fuente.activa
                      ? "bg-blue-50 dark:bg-blue-900/30"
                      : "bg-gray-100"
                  }`}
                >
                  <IconGlobe />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                      {fuente.nombre}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        fuente.activa
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {fuente.activa ? "ACTIVA" : "INACTIVA"}
                    </span>
                  </div>

                  {/* Info adicional si existe */}
                  {fuente.descripcion && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {fuente.descripcion}
                    </p>
                  )}
                </div>
              </div>

              {/* URL Base */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 text-xs font-mono text-gray-600 dark:text-gray-300 overflow-hidden">
                <div className="flex items-center gap-2 mb-1 truncate">
                  <IconLink />
                  <span className="truncate" title={fuente.baseUrl}>
                    {fuente.baseUrl}
                  </span>
                </div>
              </div>

              {/* Estadísticas y fecha */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <IconActivity className="w-3 h-3" />
                  <span>
                    {fuente.hechosSincronizados || 0} hechos sincronizados
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {formatearFecha(fuente.ultimaSincronizacion)}
                </span>
              </div>
            </div>
          ))}

          {fuentes.length === 0 && !loading && (
            <div className="col-span-full text-center py-10 text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
              No hay fuentes MetaMapa conectadas.
            </div>
          )}
        </div>
      )}

      {/* --- MODAL DE CONEXIÓN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800 animate-scaleUp">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Conectar Instancia MetaMapa
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Conéctate a otra instancia de MetaMapa para compartir hechos
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Nombre Identificador
                </label>
                <input
                  type="text"
                  name="nombreFuente"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Ej: MetaMapa Provincia Buenos Aires"
                  value={formData.nombreFuente}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Este nombre identificará la fuente en tu sistema
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  URL Base de la Instancia
                </label>
                <input
                  type="text"
                  name="baseUrl"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-mono"
                  placeholder="https://otra-instancia-mapa.org/publica"
                  value={formData.baseUrl}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Debe ser una URL válida que termine en /publica (API pública)
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Conectando..." : "Conectar Instancia"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleUp {
          animation: scaleUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FuentesMetamapa;
