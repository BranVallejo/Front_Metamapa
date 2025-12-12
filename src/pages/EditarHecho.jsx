import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";

// Componentes y Fondo
import MapaSelectorCoordenadas from "../Components/MapaSelectorCoordenadas";
import FondoChill from "../Components/FondoDinamico/FondoChill";

const categoriasPermitidas = [
  "vientos fuertes",
  "inundaciones",
  "granizo",
  "nevadas",
  "calor extremo",
  "sequia",
  "derrumbes",
  "actividad volcánica",
  "contaminación",
  "evento sanitario",
  "derrame",
  "intoxicacion masiva",
  "Otro",
];

const getFileType = (url) => {
  if (!url) return "unknown";
  const extension = url.split(".").pop().toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];

  if (imageExtensions.includes(extension)) return "image";
  if (videoExtensions.includes(extension)) return "video";
  return "unknown";
};

const EditarHecho = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    latitud: "",
    longitud: "",
    fechaAcontecimiento: "",
    etiqueta: "",
  });

  const [archivosExistentes, setArchivosExistentes] = useState([]);
  const [archivosAEliminar, setArchivosAEliminar] = useState([]);
  const [nuevosArchivos, setNuevosArchivos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Visor Modal
  const [visorAbierto, setVisorAbierto] = useState(false);
  const [archivoActual, setArchivoActual] = useState(null);
  const [tipoArchivoActual, setTipoArchivoActual] = useState(null);

  // --- Estilos Reutilizables (Glass System) ---
  const inputClass = "w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 backdrop-blur-sm";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 opacity-80";

  // --- Funciones del Visor ---
  const abrirVisor = (archivo, tipo) => {
    setArchivoActual(archivo);
    setTipoArchivoActual(tipo);
    setVisorAbierto(true);
  };

  const cerrarVisor = () => {
    setVisorAbierto(false);
    setArchivoActual(null);
    setTipoArchivoActual(null);
  };

  const VisorMultimedia = () => {
    if (!visorAbierto || !archivoActual) return null;
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
        <button
          onClick={cerrarVisor}
          className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center text-2xl transition-all border border-white/20"
        >
          ×
        </button>
        <div className="max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
          {tipoArchivoActual === "image" ? (
            <img src={archivoActual} alt="Zoom" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
          ) : tipoArchivoActual === "video" ? (
            <video controls autoPlay className="max-w-full max-h-full rounded-lg shadow-2xl">
              <source src={archivoActual} type="video/mp4" />
            </video>
          ) : (
            <p className="text-white">Archivo no visualizable</p>
          )}
        </div>
      </div>
    );
  };

  // --- Carga Inicial ---
  useEffect(() => {
    fetch(`${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica/hechos?idBuscado=${id}`, { method: "GET" })
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data?.hechos?.length > 0) {
          const hecho = data.hechos[0];
          const fechaFormateada = hecho.fechaAcontecimiento ? hecho.fechaAcontecimiento.slice(0, 16) : "";
          
          setFormData({
            titulo: hecho.titulo,
            descripcion: hecho.descripcion,
            categoria: categoriasPermitidas.includes(hecho.categoria) ? hecho.categoria : "Otro",
            latitud: hecho.latitud,
            longitud: hecho.longitud,
            fechaAcontecimiento: fechaFormateada,
            etiqueta: hecho.etiqueta || "",
          });

          if (Array.isArray(hecho.archivosMultimedia)) {
            setArchivosExistentes(hecho.archivosMultimedia);
          }
          setLoading(false);
        } else {
          throw new Error("Hecho no encontrado");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message);
        setLoading(false);
      });
  }, [id]);

  // --- Handlers ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleMapClick = (lat, lng) => {
    setFormData((prev) => ({ ...prev, latitud: lat.toFixed(6), longitud: lng.toFixed(6) }));
  };

  const handleNuevosArchivos = (e) => {
    const seleccionados = Array.from(e.target.files);
    setNuevosArchivos((prev) => [...prev, ...seleccionados]);
    toast.info(`${seleccionados.length} archivo(s) agregado(s)`);
  };

  const eliminarArchivoExistente = (index) => {
    const archivo = archivosExistentes[index];
    setArchivosAEliminar((prev) => [...prev, archivo]);
    setArchivosExistentes((prev) => prev.filter((_, i) => i !== index));
    toast.info("Archivo marcado para eliminar");
  };

  const eliminarNuevoArchivo = (index) => {
    setNuevosArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Guardando cambios...");

    const cambios = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      ubicacion: { latitud: parseFloat(formData.latitud), longitud: parseFloat(formData.longitud) },
      fechaAcontecimiento: new Date(formData.fechaAcontecimiento).toISOString().slice(0, 19),
      etiqueta: formData.etiqueta,
      archivosAEliminar: archivosAEliminar,
    };

    const url = `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica/hechos/${id}`;

    try {
      let response;
      if (nuevosArchivos.length > 0) {
        const formDataToSend = new FormData();
        formDataToSend.append("data", JSON.stringify(cambios));
        nuevosArchivos.forEach((file) => formDataToSend.append("nuevosArchivos", file));
        response = await fetch(url, { method: "PUT", body: formDataToSend });
      } else {
        response = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cambios),
        });
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.mensaje || `Error ${response.status}`);
      }

      const data = await response.json();
      toast.success(data.mensaje || "Hecho actualizado", { id: toastId });
      setTimeout(() => navigate(`/hechos/${id}`), 1500);

    } catch (err) {
      console.error(err);
      toast.error(err.message, { id: toastId });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div></div>;

  return (
    <div className="min-h-screen relative transition-colors duration-500 font-sans text-gray-800 dark:text-gray-100 flex justify-center p-4 pt-28 pb-20">
      
      <FondoChill />
      <Toaster richColors position="top-right" />
      <VisorMultimedia />

      {/* Contenedor Principal (Glass) */}
      <div className="relative z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-white/20 dark:border-gray-700 p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-4xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-gray-200/50 dark:border-white/5 pb-6">
          <div>
            <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest mb-1 block">Modo Edición</span>
            <h1 className="text-3xl font-black text-gray-800 dark:text-white">
              Editar Hecho
            </h1>
          </div>
          <button
            onClick={() => navigate(`/hechos/${id}`)}
            className="px-6 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 font-bold transition-all text-sm"
          >
            Cancelar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Datos Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Título</label>
              <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required className={`${inputClass} text-lg font-bold`} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Descripción</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required rows="4" className={`${inputClass} resize-none`} />
            </div>

            <div>
              <label className={labelClass}>Categoría</label>
              <div className="relative">
                <select name="categoria" value={formData.categoria} onChange={handleChange} required className={`${inputClass} appearance-none`}>
                  {categoriasPermitidas.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div>
                <label className={labelClass}>Fecha y Hora</label>
                <input type="datetime-local" name="fechaAcontecimiento" value={formData.fechaAcontecimiento} onChange={handleChange} required className={inputClass} />
            </div>
            
            <div className="md:col-span-2">
                <label className={labelClass}>Etiqueta (Opcional)</label>
                <input type="text" name="etiqueta" value={formData.etiqueta} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Mapa */}
          <div className="pt-4 border-t border-gray-200/50 dark:border-white/5">
            <label className={labelClass}>Ubicación (Modificar en el mapa)</label>
            <div className="w-full h-[450px] rounded-2xl overflow-hidden border-2 border-white/50 dark:border-white/10 shadow-inner relative z-0">
              <MapaSelectorCoordenadas
                latitud={parseFloat(formData.latitud)}
                longitud={parseFloat(formData.longitud)}
                onCoordenadasChange={handleMapClick}
              />
            </div>
            <p className="text-right text-xs text-gray-400 mt-1 font-mono opacity-70">
                LAT: {formData.latitud} | LNG: {formData.longitud}
            </p>
          </div>

          {/* Multimedia Existente */}
          {archivosExistentes.length > 0 && (
            <div className="pt-4 border-t border-gray-200/50 dark:border-white/5">
              <label className={labelClass}>Multimedia Actual</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {archivosExistentes.map((archivo, index) => {
                  const tipo = getFileType(archivo);
                  return (
                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm">
                      <div onClick={() => abrirVisor(archivo, tipo)} className="w-full h-full cursor-zoom-in bg-gray-100 dark:bg-black/40">
                        {tipo === "image" ? (
                          <img src={archivo} alt="Media" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">▶</div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => eliminarArchivoExistente(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
                        title="Eliminar este archivo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Agregar Nueva Multimedia */}
          <div className="pt-4 border-t border-gray-200/50 dark:border-white/5">
            <label className={labelClass}>Agregar Nuevos Archivos</label>
            <div className="flex flex-col md:flex-row gap-4">
                <label className="flex-shrink-0 cursor-pointer group relative overflow-hidden rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border-2 border-dashed border-yellow-400 dark:border-yellow-600/50 hover:border-yellow-500 transition-colors p-6 flex flex-col items-center justify-center text-center w-full md:w-48 h-32">
                    <span className="text-2xl mb-1">📂</span>
                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase">Subir</span>
                    <input type="file" multiple onChange={handleNuevosArchivos} className="hidden" accept="image/*,video/*" />
                </label>

                {nuevosArchivos.length > 0 && (
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {nuevosArchivos.map((archivo, index) => (
                            <div key={index} className="relative bg-gray-100 dark:bg-white/5 rounded-lg p-2 flex items-center border border-gray-200 dark:border-white/10">
                                <span className="text-xs truncate flex-1 font-medium">{archivo.name}</span>
                                <button type="button" onClick={() => eliminarNuevoArchivo(index)} className="text-red-500 hover:text-red-700 p-1">✕</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-8 flex justify-end gap-4 border-t border-gray-200/50 dark:border-white/5">
            <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Guardar Cambios
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditarHecho;