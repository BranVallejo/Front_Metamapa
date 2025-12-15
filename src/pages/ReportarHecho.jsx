import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

// Componentes
import MapaSelectorCoordenadas from "../Components/MapaSelectorCoordenadas";
import FondoChill from "../Components/FondoDinamico/FondoChill";

const ReportarHecho = () => {
  const navigate = useNavigate();

  // --- LÓGICA (Sin cambios, solo funciona) ---
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const maxDate = now.toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "vientos fuertes",
    latitud: "",
    longitud: "",
    fechaAcontecimiento: "",
    etiqueta: "",
  });

  const [archivos, setArchivos] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fechaAcontecimiento" && value > maxDate) {
      toast.error("No puedes seleccionar una fecha en el futuro");
      return;
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleMapClick = (lat, lng) => {
    setFormData((prevData) => ({
      ...prevData,
      latitud: lat.toFixed(6),
      longitud: lng.toFixed(6),
    }));
  };

  const handleFileChange = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    setArchivos((prev) => [...prev, ...nuevosArchivos]);
    toast.info(`${nuevosArchivos.length} archivo(s) agregado(s)`);
  };

  const eliminarArchivo = (index) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
    toast.info("Archivo eliminado");
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      categoria: "vientos fuertes",
      latitud: "",
      longitud: "",
      fechaAcontecimiento: "",
      etiqueta: "",
    });
    setArchivos([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.latitud || !formData.longitud) {
      toast.error("Por favor, selecciona una ubicación en el mapa.");
      return;
    }

    setEnviando(true);
    const toastId = toast.loading("Enviando reporte...");
    const userData = JSON.parse(localStorage.getItem("user"));
    const contribuyenteID = userData?.userId ?? -1;

    const dto = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      latitud: parseFloat(formData.latitud),
      longitud: parseFloat(formData.longitud),
      fechaAcontecimiento: new Date(formData.fechaAcontecimiento)
        .toISOString()
        .slice(0, 19),
      etiqueta: formData.etiqueta,
      contribuyenteID: contribuyenteID,
    };

    console.log("📤 DTO enviado:");
    console.log(dto);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(dto));
      archivos.forEach((archivo) => {
        formDataToSend.append("file", archivo);
      });

      const response = await fetch(
        `${import.meta.env.VITE_URL_INICIAL_DINAMICA}/hecho`,
        { method: "POST", body: formDataToSend }
      );

      if (response.ok) {
        toast.success("¡Hecho reportado con éxito!", {
          id: toastId,
          duration: 3000,
        });
        resetForm();
        setTimeout(() => navigate("/"), 1500);
      } else {
        const errorText = await response.text();
        toast.error(`Error: ${errorText}`, { id: toastId });
      }
    } catch (error) {
      toast.error("Error de conexión.", { id: toastId });
    } finally {
      setEnviando(false);
    }
  };

  // Estilos reutilizables para inputs "Glass"
  const inputClass =
    "w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 backdrop-blur-sm";
  const labelClass =
    "block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 opacity-80";

  return (
    <div className="min-h-screen relative transition-colors duration-500 font-sans text-gray-800 dark:text-gray-100">
      <FondoChill />
      <Toaster richColors position="top-right" />

      <div className="relative z-10 pt-28 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 drop-shadow-sm">
              Nuevo Reporte
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-medium mt-2 max-w-md">
              Ayuda a la comunidad reportando incidentes climáticos o
              ambientales.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-xl bg-white/40 dark:bg-black/40 border border-white/20 dark:border-white/10 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/5 transition-all text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md"
          >
            &larr; Cancelar
          </button>
        </div>

        {/* TARJETA PRINCIPAL (GLASS FACHERO) */}
        <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-2xl border border-white/40 dark:border-white/5 rounded-3xl shadow-2xl p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* SECCIÓN 1: DATOS BÁSICOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>
                  Título del Hecho <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Inundación en Av. Corrientes"
                  required
                  className={`${inputClass} text-lg font-semibold`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Descripción Detallada <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe qué sucedió, daños visibles, situación actual..."
                  required
                  rows="3"
                  className={`${inputClass} resize-none`}
                ></textarea>
              </div>

              <div>
                <label className={labelClass}>
                  Categoría <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="vientos fuertes">Vientos fuertes</option>
                    <option value="inundaciones">Inundaciones</option>
                    <option value="granizo">Granizo</option>
                    <option value="nevadas">Nevadas</option>
                    <option value="calor extremo">Calor extremo</option>
                    <option value="sequía">Sequía</option>
                    <option value="derrumbes">Derrumbes</option>
                    <option value="actividad volcánica">
                      Actividad volcánica
                    </option>
                    <option value="incendios">Incendios</option>
                    <option value="contaminación">Contaminación</option>
                    <option value="evento sanitario">Evento sanitario</option>
                    <option value="derrame">Derrame</option>
                    <option value="intoxicación masiva">
                      Intoxicación masiva
                    </option>
                    <option value="Otro">Otro</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Etiqueta (Opcional)</label>
                <input
                  type="text"
                  name="etiqueta"
                  value={formData.etiqueta}
                  onChange={handleChange}
                  placeholder="Ej: URGENTE, TRÁFICO..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Fecha y Hora <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="fechaAcontecimiento"
                  value={formData.fechaAcontecimiento}
                  onChange={handleChange}
                  required
                  max={maxDate}
                  className={`${inputClass} cursor-text`}
                />
              </div>
            </div>

            {/* SECCIÓN 2: UBICACIÓN (MAPA GRANDE) */}
            <div className="pt-4 border-t border-gray-200/50 dark:border-white/5">
              <div className="flex justify-between items-end mb-3">
                <label className={labelClass + " mb-0"}>
                  Ubicación Exacta <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-blue-500 font-medium animate-pulse">
                  📍 Toca en el mapa para marcar
                </span>
              </div>

              <div className="w-full h-[450px] rounded-2xl overflow-hidden border-2 border-white/50 dark:border-white/10 shadow-inner relative z-0 group">
                <MapaSelectorCoordenadas
                  latitud={parseFloat(formData.latitud)}
                  longitud={parseFloat(formData.longitud)}
                  onCoordenadasChange={handleMapClick}
                />
                {/* Overlay sutil de instrucciones */}
                {!formData.latitud && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none group-hover:bg-transparent transition-colors">
                    <span className="bg-white/80 dark:bg-black/60 backdrop-blur text-xs px-3 py-1 rounded-full shadow-lg">
                      Haz clic para posicionar el pin
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-3 opacity-60 text-xs font-mono">
                <div className="bg-gray-100 dark:bg-white/5 px-2 py-1 rounded border border-gray-200 dark:border-white/10">
                  LAT: {formData.latitud || "-"}
                </div>
                <div className="bg-gray-100 dark:bg-white/5 px-2 py-1 rounded border border-gray-200 dark:border-white/10">
                  LNG: {formData.longitud || "-"}
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: MULTIMEDIA */}
            <div className="pt-4 border-t border-gray-200/50 dark:border-white/5">
              <label className={labelClass}>
                Evidencia Multimedia (Opcional)
              </label>

              <div className="flex flex-col md:flex-row gap-4 items-start">
                <label className="flex-shrink-0 cursor-pointer group relative overflow-hidden rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors p-6 flex flex-col items-center justify-center text-center w-full md:w-40 h-32">
                  <svg
                    className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    ></path>
                  </svg>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    Subir Archivos
                  </span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,video/*"
                  />
                </label>

                {/* Lista de archivos moderna */}
                <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {archivos.length > 0 ? (
                    archivos.map((archivo, index) => (
                      <div
                        key={index}
                        className="relative group bg-gray-100 dark:bg-white/5 rounded-xl p-2 pr-8 border border-gray-200 dark:border-white/10 flex items-center overflow-hidden"
                      >
                        <div className="w-8 h-8 rounded bg-gray-200 dark:bg-white/10 flex items-center justify-center mr-3 text-lg flex-shrink-0">
                          {archivo.type.startsWith("video") ? "🎥" : "🖼️"}
                        </div>
                        <span className="text-xs truncate font-medium">
                          {archivo.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => eliminarArchivo(index)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full h-32 flex items-center justify-center text-gray-400 text-sm italic border border-transparent rounded-xl">
                      No has seleccionado archivos aún.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BOTÓN DE ENVÍO */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={enviando}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 ${
                  enviando
                    ? "bg-gray-400 cursor-wait"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                }`}
              >
                {enviando ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando Reporte...
                  </>
                ) : (
                  <>
                    <span>🚀</span> Publicar Hecho
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportarHecho;
