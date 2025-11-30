import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import MapaSelectorCoordenadas from "../Components/MapaSelectorCoordenadas";

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

// Función auxiliar para determinar el tipo de archivo
const getFileType = (url) => {
  const extension = url.split(".").pop().toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];

  if (imageExtensions.includes(extension)) {
    return "image";
  } else if (videoExtensions.includes(extension)) {
    return "video";
  } else {
    return "unknown";
  }
};

const EditarHecho = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [error, setError] = useState(null);

  // Nuevos estados para el visor modal
  const [visorAbierto, setVisorAbierto] = useState(false);
  const [archivoActual, setArchivoActual] = useState(null);
  const [tipoArchivoActual, setTipoArchivoActual] = useState(null);

  // Función para abrir el visor
  const abrirVisor = (archivo, tipo) => {
    setArchivoActual(archivo);
    setTipoArchivoActual(tipo);
    setVisorAbierto(true);
  };

  // Función para cerrar el visor
  const cerrarVisor = () => {
    setVisorAbierto(false);
    setArchivoActual(null);
    setTipoArchivoActual(null);
  };

  // Componente del visor modal
  // Componente del visor modal - VERSIÓN CON Z-INDEX MÁS ALTO
  const VisorMultimedia = () => {
    if (!visorAbierto || !archivoActual) return null;

    return (
      <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        {/* Botón cerrar */}
        <button
          onClick={cerrarVisor}
          className="absolute top-4 cursor-pointer right-4 text-white text-2xl z-[10000] bg-gray-800/80 hover:bg-gray-700/80 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 border border-gray-600"
        >
          ×
        </button>

        {/* Contenido multimedia */}
        <div className="max-w-4xl max-h-full w-full relative z-[9998]">
          {tipoArchivoActual === "image" ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={archivoActual}
                alt="Imagen ampliada"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          ) : tipoArchivoActual === "video" ? (
            <div className="flex items-center justify-center h-full">
              <video
                controls
                autoPlay
                className="max-w-full max-h-full rounded-lg shadow-2xl bg-black"
              >
                <source src={archivoActual} type="video/mp4" />
                Tu navegador no soporta el elemento video.
              </video>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl p-8 text-center max-w-md mx-auto border border-gray-600">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h4 className="text-lg font-semibold text-white mb-2">
                Archivo no visualizable
              </h4>
              <p className="text-gray-400 mb-4">
                Este tipo de archivo no puede mostrarse en el visor.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetch(
      `${
        import.meta.env.VITE_URL_INICIAL_GESTOR
      }/publica/hechos?idBuscado=${id}`,
      { method: "GET" }
    )
      .then((response) => {
        if (!response.ok)
          throw new Error(`Error del servidor: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (data && data.hechos && data.hechos.length > 0) {
          const hecho = data.hechos[0];
          const fechaFormateada = hecho.fechaAcontecimiento
            ? hecho.fechaAcontecimiento.slice(0, 16)
            : "";
          const categoriaDelHecho = hecho.categoria;
          const categoriaEsValida =
            categoriasPermitidas.includes(categoriaDelHecho);

          setFormData({
            titulo: hecho.titulo,
            descripcion: hecho.descripcion,
            categoria: categoriaEsValida ? categoriaDelHecho : "Otro",
            latitud: hecho.latitud,
            longitud: hecho.longitud,
            fechaAcontecimiento: fechaFormateada,
            etiqueta: hecho.etiqueta || "",
          });

          // Cargar archivos multimedia existentes
          if (
            hecho.archivosMultimedia &&
            Array.isArray(hecho.archivosMultimedia)
          ) {
            setArchivosExistentes(hecho.archivosMultimedia);
          }

          setLoading(false);
        } else {
          throw new Error(`No se encontró ningún hecho con el ID: ${id}`);
        }
      })
      .catch((err) => {
        console.error("Error al cargar datos para editar:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  // Manejar nuevos archivos
  const handleNuevosArchivos = (e) => {
    const archivosSeleccionados = Array.from(e.target.files);
    setNuevosArchivos((prev) => [...prev, ...archivosSeleccionados]);
  };

  // Eliminar archivo existente
  const eliminarArchivoExistente = (index) => {
    const archivoAEliminar = archivosExistentes[index];
    setArchivosAEliminar((prev) => [...prev, archivoAEliminar]);
    setArchivosExistentes((prev) => prev.filter((_, i) => i !== index));
  };

  // Eliminar nuevo archivo
  const eliminarNuevoArchivo = (index) => {
    setNuevosArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cambios = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      ubicacion: {
        // ← Enviar como objeto
        latitud: parseFloat(formData.latitud),
        longitud: parseFloat(formData.longitud),
      },
      fechaAcontecimiento: new Date(formData.fechaAcontecimiento)
        .toISOString()
        .slice(0, 19),
      etiqueta: formData.etiqueta,
      archivosAEliminar: archivosAEliminar,
    };

    const url = `${
      import.meta.env.VITE_URL_INICIAL_GESTOR
    }/publica/hechos/${id}`;

    try {
      let response;
      if (nuevosArchivos.length > 0) {
        const formDataToSend = new FormData();
        formDataToSend.append("data", JSON.stringify(cambios));

        nuevosArchivos.forEach((archivo) => {
          formDataToSend.append("nuevosArchivos", archivo);
        });

        response = await fetch(url, {
          method: "PUT",
          body: formDataToSend,
        });
      } else {
        response = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cambios),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.mensaje || `Error del servidor: ${response.status}`
        );
      }

      const data = await response.json();
      alert(data.mensaje || "¡Hecho actualizado con éxito!");
      navigate(`/hechos/${id}`);
    } catch (error) {
      console.error("Error al editar el hecho:", error);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center dark:text-white">
        Cargando datos para editar...
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-8 text-center dark:text-white text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl w-full max-w-4xl">
        {/* Visor Modal */}
        <VisorMultimedia />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Editar Hecho
          </h1>
          <Link
            to={`/hechos/${id}`}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            &larr; Volver al Detalle
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos del formulario */}
          <div>
            <label
              htmlFor="titulo"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="categoria"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecciona una categoría...</option>
              {categoriasPermitidas.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Ubicación <span className="text-red-500">*</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              (Haz clic en el mapa para seleccionar la ubicación)
            </span>
          </h3>

          {/* Mapa */}
          <div className="mb-4">
            <MapaSelectorCoordenadas
              latitud={parseFloat(formData.latitud)}
              longitud={parseFloat(formData.longitud)}
              onCoordenadasChange={handleMapClick}
            />
          </div>

          {/* Campos de coordenadas en una sola fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="latitud"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Latitud
              </label>
              <input
                type="number"
                id="latitud"
                name="latitud"
                value={formData.latitud}
                onChange={handleChange}
                step="any"
                required
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none"
                placeholder="Selecciona en el mapa..."
              />
            </div>
            <div>
              <label
                htmlFor="longitud"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Longitud
              </label>
              <input
                type="number"
                id="longitud"
                name="longitud"
                value={formData.longitud}
                onChange={handleChange}
                step="any"
                required
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none"
                placeholder="Selecciona en el mapa..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fechaAcontecimiento"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Fecha y Hora del Acontecimiento{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="fechaAcontecimiento"
                name="fechaAcontecimiento"
                value={formData.fechaAcontecimiento}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="etiqueta"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Etiqueta
              </label>
              <input
                type="text"
                id="etiqueta"
                name="etiqueta"
                value={formData.etiqueta}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* SECCIÓN DE MULTIMEDIA EXISTENTE - MODIFICADA PARA SER CLICKEABLE */}
          {archivosExistentes.length > 0 && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Multimedia Existente ({archivosExistentes.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {archivosExistentes.map((archivo, index) => {
                  const tipo = getFileType(archivo);
                  return (
                    <div
                      key={index}
                      className="relative group border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
                    >
                      {/* Contenido clickeable */}
                      <div
                        className="cursor-pointer"
                        onClick={() => abrirVisor(archivo, tipo)}
                      >
                        {tipo === "image" ? (
                          <img
                            src={archivo}
                            alt={`Archivo ${index + 1}`}
                            className="w-full h-24 object-cover"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E";
                            }}
                          />
                        ) : tipo === "video" ? (
                          <div className="w-full h-24 bg-gray-800 relative">
                            <video
                              className="w-full h-full object-cover"
                              preload="metadata"
                              onLoadedData={(e) => {
                                e.target.currentTime = 0.1;
                              }}
                            >
                              <source src={archivo} type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 text-sm">
                              Archivo
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Botón eliminar */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          eliminarArchivoExistente(index);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10"
                      >
                        ×
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate flex justify-between items-center">
                        <span>
                          {tipo === "image"
                            ? "IMG"
                            : tipo === "video"
                            ? "VID"
                            : "FILE"}
                        </span>
                        {tipo === "video" && (
                          <span className="text-xs opacity-75">▶</span>
                        )}
                      </div>

                      {/* Overlay hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center pointer-events-none">
                        <span className="text-white text-xs opacity-0 group-hover:opacity-100 bg-black/70 px-2 py-1 rounded">
                          {tipo === "image"
                            ? "Ver imagen"
                            : tipo === "video"
                            ? "Reproducir video"
                            : "Abrir archivo"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECCIÓN PARA AGREGAR NUEVOS ARCHIVOS */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Agregar Nueva Multimedia
            </h3>

            <div className="mb-3">
              <label className="px-4 py-2 bg-blue-600 text-white border border-blue-600 rounded-md shadow-sm cursor-pointer hover:bg-blue-700 inline-block transition-colors">
                Elegir archivos
                <input
                  type="file"
                  multiple
                  onChange={handleNuevosArchivos}
                  className="hidden"
                  accept="image/*,video/*"
                />
              </label>
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                {nuevosArchivos.length} nuevo(s) archivo(s) seleccionado(s)
              </span>
            </div>

            {/* Lista de nuevos archivos seleccionados */}
            {nuevosArchivos.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nuevos archivos a agregar:
                </h4>
                <div className="space-y-2">
                  {nuevosArchivos.map((archivo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white dark:bg-gray-600 p-2 rounded border border-gray-200 dark:border-gray-500"
                    >
                      <div className="flex items-center">
                        {archivo.type.startsWith("image/") ? (
                          <svg
                            className="w-5 h-5 text-green-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-blue-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                          {archivo.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          ({(archivo.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => eliminarNuevoArchivo(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Link
              to={`/hechos/${id}`}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarHecho;
