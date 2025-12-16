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
const IconServer = () => (
  <svg
    className="w-8 h-8 text-indigo-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
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
const IconLock = () => (
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
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const FuentesDemo = () => {
  const [loading, setLoading] = useState(false);
  const [fuentes, setFuentes] = useState([]);

  // Modal y Formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombreFuente: "",
    url: "",
    pathApi: "",
    email: "",
    password: "",
    requiereAuth: false, // Control local para mostrar/ocultar campos de auth
  });

  const API_URL = `${import.meta.env.VITE_URL_INICIAL_DEMO}/admin/fuentes`;

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
        toast.error("Error al obtener fuentes demo");
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!formData.nombreFuente || !formData.url || !formData.pathApi) {
      toast.warning("Completa los campos obligatorios (Nombre, URL, Path)");
      return;
    }

    if (formData.requiereAuth && (!formData.email || !formData.password)) {
      toast.warning("Si requiere autenticación, completa Email y Password");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Registrando y validando conexión...");

    // Preparamos el payload según FuenteDemoRequest
    const payload = {
      nombreFuente: formData.nombreFuente,
      url: formData.url,
      pathApi: formData.pathApi,
      // Solo mandamos credenciales si el usuario marcó que requiere auth
      email: formData.requiereAuth ? formData.email : null,
      password: formData.requiereAuth ? formData.password : null,
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
        toast.success("Fuente Demo conectada y registrada", { id: toastId });
        setIsModalOpen(false);
        setFormData({
          nombreFuente: "",
          url: "",
          pathApi: "",
          email: "",
          password: "",
          requiereAuth: false,
        }); // Reset
        cargarFuentes();
      } else if (response.status === 401) {
        // El controller devuelve 401 si falla la conexión externa
        toast.error(
          "Error de autenticación con la fuente externa. Verificá las credenciales.",
          { id: toastId }
        );
      } else {
        toast.error("Error al registrar la fuente", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de red", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Fuentes Demo (API Externa)
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <IconPlus />
          Conectar API
        </button>
      </div>

      {/* Grid de Tarjetas */}
      {loading && fuentes.length === 0 ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Verificando conexiones...</p>
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
                      ? "bg-indigo-50 dark:bg-indigo-900/30"
                      : "bg-gray-100"
                  }`}
                >
                  <IconServer />
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

                  {/* Info Detectada (si existe en el DTO) */}
                  {(fuente.nombreDetectado || fuente.etiquetaDetectada) && (
                    <div className="mt-1 flex gap-2 text-xs text-indigo-600 dark:text-indigo-400">
                      {fuente.nombreDetectado && (
                        <span>Detectado: {fuente.nombreDetectado}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* URL y Path */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 text-xs font-mono text-gray-600 dark:text-gray-300 overflow-hidden">
                <div className="flex items-center gap-2 mb-1 truncate">
                  <IconLink />
                  <span className="truncate" title={fuente.urlBase}>
                    {fuente.urlBase}
                  </span>
                </div>
                <div
                  className="pl-6 text-gray-500 truncate"
                  title={fuente.pathApi}
                >
                  Path: {fuente.pathApi}
                </div>
              </div>
            </div>
          ))}

          {fuentes.length === 0 && !loading && (
            <div className="col-span-full text-center py-10 text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
              No hay fuentes demo conectadas.
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
                Conectar Nueva API
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Ingresa los datos de conexión de la Fuente Demo
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
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="Ej: Servidor Demo Latam"
                  value={formData.nombreFuente}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    URL Base
                  </label>
                  <input
                    type="text"
                    name="url"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                    placeholder="http://api.externa.com"
                    value={formData.url}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Path API
                  </label>
                  <input
                    type="text"
                    name="pathApi"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                    placeholder="/v1/data"
                    value={formData.pathApi}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Toggle Auth */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="requiereAuth"
                  name="requiereAuth"
                  checked={formData.requiereAuth}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                />
                <label
                  htmlFor="requiereAuth"
                  className="text-sm text-gray-700 dark:text-gray-300 font-medium select-none cursor-pointer"
                >
                  Requiere Autenticación (Email/Pass)
                </label>
              </div>

              {/* Campos condicionales de Auth */}
              {formData.requiereAuth && (
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 text-xs font-bold uppercase mb-1">
                    <IconLock /> Credenciales
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                      placeholder="Email de conexión"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
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
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Validando..." : "Registrar Fuente"}
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

export default FuentesDemo;
