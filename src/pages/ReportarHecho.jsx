import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapaSelectorCoordenadas from "../Components/MapaSelectorCoordenadas";
import { Toaster, toast } from "sonner";
import FondoChill from "../Components/FondoDinamico/FondoChill";

const ReportarHecho = () => {
  const navigate = useNavigate();

  // --- CALCULAR FECHA MÁXIMA (AHORA) ---
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const maxDate = now.toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "vientos fuertes", // Valor por defecto para que el select no empiece vacío
    latitud: "",
    longitud: "",
    fechaAcontecimiento: "",
    etiqueta: "",
  });

  const [archivos, setArchivos] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // VALIDACIÓN FECHA
    if (name === "fechaAcontecimiento" && value > maxDate) {
        toast.error("No puedes seleccionar una fecha en el futuro");
        // No actualizamos el estado si la fecha es inválida
        return; 
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

    const toastId = toast.loading("Enviando reporte, por favor espere...");
    const userData = JSON.parse(localStorage.getItem("user"));

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
      contribuyenteID: userData.userId,
    };

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(dto));
      archivos.forEach((archivo) => {
        formDataToSend.append("file", archivo);
      });

      const response = await fetch(
        `${import.meta.env.VITE_URL_INICIAL_DINAMICA}/hecho`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        toast.success("¡Hecho reportado con éxito!", {
            id: toastId,
            duration: 3000,
        });
        
        resetForm();

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        toast.error(`Error al reportar: ${errorText}`, {
            id: toastId,
            duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error de red:", error);
      toast.error("Error de conexión. Verifica el servidor.", {
          id: toastId,
          duration: 5000,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    // 👇👇👇 CAMBIO CLAVE 1: ARREGLO DEL SCROLL 👇👇👇
    // Se eliminó 'overflow-hidden' y 'flex items-center justify-center'.
    // Ahora es un flujo normal que permite el scroll nativo de la página.
    // Se ajustó el padding superior (pt-28) e inferior (pb-12) para dar aire.
    <div className="min-h-screen relative transition-colors duration-300 p-4 pt-28 pb-12 md:pt-24 flex justify-center">
      
      <FondoChill />
      <Toaster richColors position="top-right" />

      {/* CARD PRINCIPAL */}
      <div className="relative z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-white/20 dark:border-gray-700 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Reportar Nuevo Hecho
          </h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 shadow-md text-sm md:text-base"
          >
            &larr; Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ej: Colisión en Av. Corrientes"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe lo que sucedió con el mayor detalle posible."
              required
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            ></textarea>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="vientos fuertes">Vientos fuertes</option>
              <option value="inundaciones">Inundaciones</option>
              <option value="granizo">Granizo</option>
              <option value="nevadas">Nevadas</option>
              <option value="calor extremo">Calor extremo</option>
              <option value="sequía">Sequía</option>
              <option value="derrumbes">Derrumbes</option>
              <option value="actividad volcánica">Actividad volcánica</option>
              <option value="incendios">Incendios</option>
              <option value="contaminacion">Contaminacion</option>
              <option value="evento sanitario">Evento sanitario</option>
              <option value="derrame">Derrame</option>
              <option value="intoxicación masiva">Intoxicación masiva</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* FECHA Y ETIQUETA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha y Hora <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="fechaAcontecimiento"
                value={formData.fechaAcontecimiento}
                onChange={handleChange}
                required
                max={maxDate} 
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Etiqueta
              </label>
              <input
                type="text"
                name="etiqueta"
                value={formData.etiqueta}
                onChange={handleChange}
                placeholder="Ej: URGENTE"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* --- MAPA GRANDE --- */}
          <div className="pt-2">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Ubicación <span className="text-red-500">*</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs ml-2 font-normal">
                (Toca en el mapa para seleccionar)
              </span>
            </label>
            
            <div 
              className="w-full rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 shadow-inner relative z-0"
              style={{ height: "450px" }} // Ajusté un poco la altura
            >
                <MapaSelectorCoordenadas
                  latitud={parseFloat(formData.latitud)}
                  longitud={parseFloat(formData.longitud)}
                  onCoordenadasChange={handleMapClick}
                />
            </div>
            
            {/* 👇👇👇 CAMBIO CLAVE 2: ATRIBUCIÓN DISCRETA 👇👇👇 */}
            <p className="text-xs text-gray-400 dark:text-gray-500 text-right mt-1 mr-1">
              © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline">OpenStreetMap</a> contributors
            </p>
            {/* 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆 */}

          </div>

          {/* Inputs Lat/Long (Solo lectura) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-xs mb-1">Latitud</label>
              <input type="number" value={formData.latitud} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 focus:outline-none text-sm" placeholder="-" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-xs mb-1">Longitud</label>
              <input type="number" value={formData.longitud} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 focus:outline-none text-sm" placeholder="-" />
            </div>
          </div>

          {/* Archivos Multimedia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Archivos Multimedia (Opcional)
            </label>
            <div className="mb-3">
              <label className="w-full md:w-auto px-4 py-3 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600 inline-block transition-colors text-center">
                Elegir archivos
                <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
              </label>
              <span className="block mt-2 md:inline md:ml-3 text-gray-600 dark:text-gray-400 text-sm">
                {archivos.length} seleccionados
              </span>
            </div>

            {/* Lista de archivos (sin cambios) */}
            {archivos.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50">
                <div className="space-y-2">
                  {archivos.map((archivo, index) => (
                    <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-600 p-2 rounded border border-gray-200 dark:border-gray-500">
                      <div className="flex items-center overflow-hidden">
                        <span className="text-sm text-gray-700 dark:text-gray-200 truncate max-w-[200px]">{archivo.name}</span>
                      </div>
                      <button type="button" onClick={() => eliminarArchivo(index)} className="text-red-500 hover:text-red-700 p-1 ml-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full md:w-auto"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className={`px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg transition-all w-full md:w-auto ${
                enviando ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700 hover:scale-105"
              }`}
            >
              {enviando ? "Enviando..." : "Reportar Hecho"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportarHecho;