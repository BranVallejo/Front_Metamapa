import React, { useState, useEffect, useRef } from "react";
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
const IconUpdate = () => (
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
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);
const IconFile = () => (
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
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);
const IconUpload = () => (
  <svg
    className="w-10 h-10 text-gray-400 mb-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const FuentesEstaticas = () => {
  const [loading, setLoading] = useState(false);
  const [fuentes, setFuentes] = useState([]);

  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); // false = Crear, true = Actualizar

  // Estado del Formulario
  const [nombreFuente, setNombreFuente] = useState("");
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [fuenteAEditarId, setFuenteAEditarId] = useState(null);

  // Referencia para el input file oculto
  const fileInputRef = useRef(null);

  const API_URL = `${import.meta.env.VITE_URL_INICIAL_ESTATICA}/admin/fuentes`;

  const getToken = () => localStorage.getItem("token");

  // --- 1. CARGA INICIAL (LISTAR) ---
  useEffect(() => {
    cargarFuentes();
  }, []);

  const cargarFuentes = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (response.status === 204) {
        setFuentes([]);
      } else if (response.ok) {
        const data = await response.json();
        setFuentes(data);
      } else {
        toast.error("Error al obtener la lista de fuentes");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión con el Gateway");
    } finally {
      setLoading(false);
    }
  };

  // --- MANEJADORES DE MODAL ---
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setNombreFuente("");
    setArchivoSeleccionado(null);
    setFuenteAEditarId(null);
    setIsModalOpen(true);
  };

  const abrirModalActualizar = (fuente) => {
    setModoEdicion(true);
    setNombreFuente(fuente.nombreFuente);
    setArchivoSeleccionado(null);
    setFuenteAEditarId(fuente.id);
    setIsModalOpen(true);
  };

  // --- MANEJO DE ARCHIVOS ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validarYSetearArchivo(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validarYSetearArchivo(file);
  };

  const validarYSetearArchivo = (file) => {
    if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
      setArchivoSeleccionado(file);
    } else if (file) {
      toast.error("Solo se permiten archivos .csv");
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // --- SUBMIT (CREAR O ACTUALIZAR) ---
  const handleSubmit = async () => {
    if (!archivoSeleccionado) {
      toast.warning("Por favor selecciona un archivo CSV");
      return;
    }

    if (!modoEdicion && !nombreFuente.trim()) {
      toast.warning("Por favor ingresa un nombre para la fuente");
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivoSeleccionado);

    let url = "";
    let method = "";

    if (modoEdicion) {
      // PUT a través del gateway
      url = `${API_URL}/${fuenteAEditarId}/csv`;
      method = "PUT";
    } else {
      // POST a través del gateway
      url = `${API_URL}/csv`;
      method = "POST";
      formData.append("nombreFuente", nombreFuente);
    }

    const toastId = toast.loading(
      modoEdicion ? "Actualizando fuente..." : "Creando fuente..."
    );

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${getToken()}`,
          // Nota: fetch maneja el Content-Type multipart automáticamente
        },
        body: formData,
      });

      if (response.ok) {
        toast.success(
          modoEdicion
            ? "Fuente actualizada con éxito"
            : "Fuente creada con éxito",
          { id: toastId }
        );
        setIsModalOpen(false);
        cargarFuentes();
      } else {
        const errorData = await response.json().catch(() => ({}));
        // Si el Gateway falla en pasar el POST, podría devolver 405 Method Not Allowed o 500
        toast.error(
          `Error: ${
            errorData.message ||
            "No se pudo procesar la solicitud (Revise Gateway)"
          }`,
          { id: toastId }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión al subir el archivo", { id: toastId });
    }
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "Pendiente de procesamiento";
    return (
      new Date(fechaISO).toLocaleDateString() +
      " " +
      new Date(fechaISO).toLocaleTimeString()
    );
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* Barra de Acciones */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Fuentes Estáticas (CSV)
        </h2>
        <button
          onClick={abrirModalCrear}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <IconPlus />
          Subir CSV
        </button>
      </div>

      {/* Lista de Tarjetas */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando fuentes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fuentes.map((fuente) => (
            <div
              key={fuente.id}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
            >
              <div
                className={`p-3 rounded-xl ${
                  fuente.activa
                    ? "bg-green-50 dark:bg-green-900/30 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <IconFile />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5 truncate">
                  {fuente.nombreFuente}
                </h3>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400 truncate"
                  title={fuente.nombreArchivoOriginal}
                >
                  Archivo: {fuente.nombreArchivoOriginal}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      fuente.pendienteProcesar
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {fuente.pendienteProcesar ? "PROCESANDO" : "LISTO"}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {formatearFecha(fuente.fechaUltimoProcesamiento)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => abrirModalActualizar(fuente)}
                className="p-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-400 rounded-xl transition-colors tooltip-trigger"
                title="Actualizar archivo CSV"
              >
                <IconUpdate />
              </button>
            </div>
          ))}

          {fuentes.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
              No hay fuentes estáticas cargadas.
            </div>
          )}
        </div>
      )}

      {/* --- MODAL (Crear / Actualizar) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800 animate-scaleUp">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {modoEdicion ? "Actualizar Fuente" : "Nueva Fuente Estática"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {modoEdicion
                  ? `Estás reemplazando el archivo para "${nombreFuente}"`
                  : "Sube un archivo .csv para procesar nuevos hechos"}
              </p>
            </div>

            <div className="space-y-6">
              {!modoEdicion && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Nombre de la Fuente
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    placeholder="Ej: Reportes Viales 2024"
                    value={nombreFuente}
                    onChange={(e) => setNombreFuente(e.target.value)}
                  />
                </div>
              )}

              {modoEdicion && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-bold text-gray-500 uppercase">
                    Fuente Seleccionada
                  </span>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {nombreFuente}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    ID: {fuenteAEditarId}
                  </p>
                </div>
              )}

              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group
                  ${
                    archivoSeleccionado
                      ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                  }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />

                {archivoSeleccionado ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-6 h-6 text-green-600 dark:text-green-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="font-bold text-green-700 dark:text-green-400 break-all">
                      {archivoSeleccionado.name}
                    </p>
                    <p className="text-xs text-green-600/70 mt-1">
                      Click para cambiar
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <IconUpload />
                    <p className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                      Arrastra tu CSV aquí o haz click
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Máximo 10MB</p>
                  </div>
                )}
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
                className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95
                  ${
                    archivoSeleccionado
                      ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 hover:scale-[1.02]"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                onClick={handleSubmit}
                disabled={!archivoSeleccionado}
              >
                {modoEdicion ? "Actualizar Datos" : "Registrar Fuente"}
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

export default FuentesEstaticas;
