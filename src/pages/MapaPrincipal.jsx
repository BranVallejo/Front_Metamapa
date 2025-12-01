import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import FiltrosPanel from "../Components/FiltrosPanel";

// --- Fix para los iconos de Leaflet ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// --- Mapa de categorías a iconos ---
const ICONOS_POR_CATEGORIA = {
  "vientos fuertes":
    "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764598155/library/kmiqb9omymu9wslfiuuw.png",
  inundaciones:
    "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764597838/library/dgnvihgxja3w0vjirh6v.png",
  granizo:
    "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764597837/library/fbzojfvzjpbnz9jewyz2.png",
  nevadas:
    "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764597835/library/qajssptx9uwmx3vdba7l.png",
  "calor extremo":
    "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764552388/library/ctfnm4pdbvfiov8h7baf.png",
  sequía:
    "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764597834/library/kql3w2aqpunstdh9do3o.png",
  derrumbes:
    "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764597832/library/zxnlezu40tb1dmhp2iej.png",
  "actividad volcánica":
    "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764597831/library/tdtvggiidquyfbmyxmns.png",
  contaminación:
    "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764597829/library/ydueinicqx5ao4ht6hrq.png",
  "evento sanitario":
    "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764597828/library/ajc9hct7ojhtb0fmjbup.png",
  derrame:
    "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764597825/library/oywe8bygnbkefpgipx8p.png",
  "intoxicación masiva":
    "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764597826/library/wlkf9hsnot4cmru4ghuc.png",
  incendios:
    "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764552388/library/ctfnm4pdbvfiov8h7baf.png",
};

// --- Ícono por defecto (cuando no hay match) ---
const ICONO_DEFAULT =
  "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764597823/library/iwq8tmolua2ux5szrezt.png";

// --- Función SIMPLE para obtener el ícono según categoría ---
const obtenerIconoParaHecho = (hecho) => {
  const categoria = hecho?.categoria?.toLowerCase().trim();

  // Determinar qué URL usar
  let iconUrl = ICONO_DEFAULT; // Por defecto si no hay match

  if (categoria && ICONOS_POR_CATEGORIA[categoria]) {
    iconUrl = ICONOS_POR_CATEGORIA[categoria];
  }

  return new L.Icon({
    iconUrl: iconUrl,
    iconSize: [50, 50],
    iconAnchor: [21, 45],
    popupAnchor: [0, -38],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
    shadowAnchor: [13, 41],
    className: "marker-icon-custom",
  });
};

// --- Ícono SVG para el botón flotante de filtros ---
const FiltroIcono = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

// --- Componente para manejar eventos del mapa ---
function MapEvents({
  onBoundsChange,
  onZoomChange,
  zoomMinimoParaHechos,
  setInfoMapa,
  setMarcadores,
}) {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
      onZoomChange(map.getZoom());
    },
    zoomend: () => {
      const newZoom = map.getZoom();
      onZoomChange(newZoom);
      if (newZoom < zoomMinimoParaHechos) {
        setMarcadores([]);
        setInfoMapa(
          `Zoom bajo (${newZoom.toFixed(
            1
          )}). Acerca a ${zoomMinimoParaHechos}+ para ver hechos.`
        );
      }
    },
  });
  return null;
}

// --- Función auxiliar para determinar el tipo de archivo ---
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

const MapaPrincipal = () => {
  // --- ESTADOS ---
  const [panelFiltrosAbierto, setPanelFiltrosAbierto] = useState(false);
  const [marcadores, setMarcadores] = useState([]);
  const [colecciones, setColecciones] = useState([]);
  const [coleccionPendiente, setColeccionPendiente] = useState(null);
  const [coleccionAplicada, setColeccionAplicada] = useState(null);
  const [modoColeccionPendiente, setModoColeccionPendiente] =
    useState("curada");
  const [modoColeccionAplicada, setModoColeccionAplicada] = useState("curada");
  const [infoMapa, setInfoMapa] = useState("Mové el mapa para cargar hechos.");
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(4);
  const [filtrosPendientes, setFiltrosPendientes] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    tipoFuente: "",
    contieneMultimedia: "",
    desdeAcontecimiento: "",
    hastaAcontecimiento: "",
    desdeCarga: "",
    hastaCarga: "",
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    ...filtrosPendientes,
  });

  // --- ESTADOS NUEVOS PARA EL VISOR DE IMÁGENES ---
  const [visorAbierto, setVisorAbierto] = useState(false);
  const [imagenActual, setImagenActual] = useState(0);
  const [archivosMultimediaActuales, setArchivosMultimediaActuales] = useState(
    []
  );

  // --- CONFIGURACIÓN ---
  const zoomMinimoParaHechos = 13;
  const API_BASE_URL = `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica`;

  // --- FUNCIONES PARA EL VISOR ---
  const abrirVisor = (archivos, indiceInicial = 0) => {
    setArchivosMultimediaActuales(archivos);
    setImagenActual(indiceInicial);
    setVisorAbierto(true);
  };

  const cerrarVisor = () => {
    setVisorAbierto(false);
    setArchivosMultimediaActuales([]);
    setImagenActual(0);
  };

  const imagenAnterior = () => {
    setImagenActual((prev) =>
      prev === 0 ? archivosMultimediaActuales.length - 1 : prev - 1
    );
  };

  const imagenSiguiente = () => {
    setImagenActual((prev) =>
      prev === archivosMultimediaActuales.length - 1 ? 0 : prev + 1
    );
  };

  // --- COMPONENTE VISOR DE IMÁGENES MEJORADO ---
  const VisorMultimedia = () => {
    if (!visorAbierto || archivosMultimediaActuales.length === 0) return null;

    const archivoActual = archivosMultimediaActuales[imagenActual];
    const tipoArchivo = getFileType(archivoActual);

    return (
      <div className="fixed inset-0 bg-gray-900 z-[2000] flex flex-col">
        {/* Header oscuro */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="font-semibold text-white">Multimedia</h3>
              <p className="text-sm text-gray-300">
                {tipoArchivo === "image"
                  ? "Imagen"
                  : tipoArchivo === "video"
                  ? "Video"
                  : "Archivo"}{" "}
                {imagenActual + 1} de {archivosMultimediaActuales.length}
              </p>
            </div>
          </div>

          {/* Botón cerrar a la derecha */}
          <button
            onClick={cerrarVisor}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-gray-300"
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

        {/* Área de contenido principal */}
        <div className="flex-1 relative bg-gray-900 flex items-center justify-center p-4">
          {/* Botón anterior */}
          {archivosMultimediaActuales.length > 1 && (
            <button
              onClick={imagenAnterior}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-gray-600 transition-all duration-200 hover:scale-105"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Contenido multimedia */}
          <div className="max-w-5xl max-h-[80vh] mx-auto w-full">
            {tipoArchivo === "image" ? (
              <div className="flex items-center justify-center h-full w-full">
                <div className="relative max-w-full max-h-full overflow-auto">
                  <img
                    src={archivoActual}
                    alt={`Imagen ${imagenActual + 1}`}
                    className="max-w-none max-h-none object-scale-down"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "70vh",
                      width: "auto",
                      height: "auto",
                    }}
                  />
                </div>
              </div>
            ) : tipoArchivo === "video" ? (
              <div className="flex items-center justify-center h-full w-full">
                <div className="relative max-w-full max-h-full">
                  <video
                    controls
                    autoPlay
                    className="max-w-full max-h-full"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "70vh",
                    }}
                  >
                    <source src={archivoActual} type="video/mp4" />
                    Tu navegador no soporta el elemento video.
                  </video>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-8 text-center max-w-md border border-gray-700">
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

          {/* Botón siguiente */}
          {archivosMultimediaActuales.length > 1 && (
            <button
              onClick={imagenSiguiente}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-gray-600 transition-all duration-200 hover:scale-105"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Miniaturas inferiores */}
        {archivosMultimediaActuales.length > 1 && (
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex justify-center gap-2 overflow-x-auto pb-2">
              {archivosMultimediaActuales.map((archivo, idx) => {
                const tipo = getFileType(archivo);
                return (
                  <button
                    key={idx}
                    onClick={() => setImagenActual(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-all duration-200 ${
                      idx === imagenActual
                        ? "border-blue-500 ring-2 ring-blue-500/30"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    {tipo === "image" ? (
                      <img
                        src={archivo}
                        alt={`Miniatura ${idx + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : tipo === "video" ? (
                      <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
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
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- LÓGICA DE DATOS ---
  useEffect(() => {
    cargarColecciones();
  }, []);

  useEffect(() => {
    if (bounds && zoom >= zoomMinimoParaHechos) {
      cargarHechosParaAreaVisible();
    }
  }, [
    bounds,
    zoom,
    filtrosAplicados,
    coleccionAplicada,
    modoColeccionAplicada,
  ]);

  const cargarColecciones = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/colecciones`);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setColecciones(data.colecciones || []);
    } catch (error) {
      console.error("Error cargando colecciones:", error);
      setColecciones([]);
    }
  };

  const cargarHechosParaAreaVisible = async () => {
    if (!bounds) return;
    try {
      setInfoMapa("Cargando hechos...");
      const params = new URLSearchParams();
      const { _southWest, _northEast } = bounds;
      params.append("sur", _southWest.lat);
      params.append("oeste", _southWest.lng);
      params.append("norte", _northEast.lat);
      params.append("este", _northEast.lng);

      Object.entries(filtrosAplicados).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      if (coleccionAplicada) {
        params.append("coleccionId", coleccionAplicada.handle);
        params.append("modo", modoColeccionAplicada);
      }

      const url = `${API_BASE_URL}/hechos?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();

      if (data && data.hechos && Array.isArray(data.hechos)) {
        setMarcadores(data.hechos);
        setInfoMapa(
          `Cargados ${data.hechos_encontrados || data.hechos.length} hechos`
        );
      } else {
        setMarcadores([]);
        setInfoMapa("No se encontraron hechos");
      }
    } catch (error) {
      console.error("Error cargando hechos:", error);
      setInfoMapa("Error cargando hechos");
    }
  };

  // --- LÓGICA DE FILTROS ---
  const handleFiltroChange = (campo, valor) => {
    setFiltrosPendientes((prev) => ({ ...prev, [campo]: valor }));
  };

  const cambiarColeccionPendiente = (event) => {
    const selectedValue = event.target.value;
    const coleccion =
      colecciones.find((c) => c.handle === selectedValue) || null;
    setColeccionPendiente(coleccion);
  };

  const cambiarModoColeccionPendiente = (modo) => {
    setModoColeccionPendiente(modo);
  };

  const aplicarFiltros = () => {
    const filtrosConFechasFormateadas = { ...filtrosPendientes };
    const camposFecha = [
      "desdeAcontecimiento",
      "hastaAcontecimiento",
      "desdeCarga",
      "hastaCarga",
    ];
    camposFecha.forEach((campo) => {
      if (
        filtrosConFechasFormateadas[campo] &&
        !filtrosConFechasFormateadas[campo].includes("T")
      ) {
        filtrosConFechasFormateadas[
          campo
        ] = `${filtrosConFechasFormateadas[campo]}T00:00:00`;
      }
    });
    setFiltrosAplicados(filtrosConFechasFormateadas);
    setColeccionAplicada(coleccionPendiente);
    setModoColeccionAplicada(modoColeccionPendiente);
    setPanelFiltrosAbierto(false);
  };

  const limpiarFiltros = () => {
    const filtrosVacios = {
      titulo: "",
      descripcion: "",
      categoria: "",
      tipoFuente: "",
      contieneMultimedia: "",
      desdeAcontecimiento: "",
      hastaAcontecimiento: "",
      desdeCarga: "",
      hastaCarga: "",
    };
    setFiltrosPendientes(filtrosVacios);
    setFiltrosAplicados(filtrosVacios);
    setColeccionPendiente(null);
    setColeccionAplicada(null);
    setModoColeccionPendiente("curada");
    setModoColeccionAplicada("curada");
    setMarcadores([]);
    setInfoMapa("Filtros limpiados");
    setPanelFiltrosAbierto(false);
  };

  // --- FUNCIÓN REPORTAR HECHO ---
  const reportarHecho = (hecho) => {
    const hechoId = hecho.id || hecho._id || hecho.codigo || "desconocido";
    window.location.href = `solicitarEliminacion/${hechoId}`;
  };

  return (
    <>
      {/* CSS para arreglar el cursor */}
      <style jsx>{`
        .leaflet-container {
          cursor: default !important;
        }

        .leaflet-container .leaflet-interactive {
          cursor: pointer !important;
        }

        .marker-icon-custom {
          cursor: pointer !important;
        }
      `}</style>

      <div className="h-[calc(100vh-4rem)] w-full relative overflow-hidden dark:bg-gray-900">
        {/* Botón Flotante para ABRIR filtros */}
        <button
          onClick={() => setPanelFiltrosAbierto(true)}
          className="absolute top-4 right-4 z-[1000] p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Abrir filtros"
        >
          <FiltroIcono />
        </button>

        {/* El Overlay (fondo oscuro) para cerrar en móvil */}
        {panelFiltrosAbierto && (
          <div
            onClick={() => setPanelFiltrosAbierto(false)}
            className="absolute inset-0 bg-black/50 z-[1001] md:hidden"
          ></div>
        )}

        {/* El Panel de Filtros */}
        <FiltrosPanel
          isOpen={panelFiltrosAbierto}
          onClose={() => setPanelFiltrosAbierto(false)}
          colecciones={colecciones}
          filtros={filtrosPendientes}
          coleccionPendiente={coleccionPendiente}
          modoColeccionPendiente={modoColeccionPendiente}
          coleccionAplicada={coleccionAplicada}
          modoColeccionAplicada={modoColeccionAplicada}
          onFiltroChange={handleFiltroChange}
          onColeccionChange={cambiarColeccionPendiente}
          onModoChange={cambiarModoColeccionPendiente}
          onLimpiar={limpiarFiltros}
          onAplicar={aplicarFiltros}
        />

        {/* El Mapa */}
        <MapContainer
          center={[-38.4161, -63.6167]}
          zoom={4}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          minZoom={4}
          maxZoom={15.5}
          maxBounds={[
            [-55.0, -73.0],
            [-21.0, -53.0],
          ]}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapEvents
            onBoundsChange={setBounds}
            onZoomChange={setZoom}
            zoomMinimoParaHechos={zoomMinimoParaHechos}
            setInfoMapa={setInfoMapa}
            setMarcadores={setMarcadores}
          />

          {/* Popups con multimedia mejorada */}
          {marcadores.map((hecho, index) => (
            <Marker
              key={index}
              position={[parseFloat(hecho.latitud), parseFloat(hecho.longitud)]}
              icon={obtenerIconoParaHecho(hecho)} // ← Ícono basado en categoría
            >
              <Popup>
                <div className="min-w-64 max-w-sm">
                  {/* Título centrado y más grande */}
                  <h4 className="font-bold text-lg text-gray-800 text-center mb-2">
                    {hecho.titulo || "Sin título"}
                  </h4>

                  {/* Descripción */}
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Descripción:</strong>{" "}
                    {hecho.descripcion || "Sin descripción"}
                  </p>

                  {hecho.categoria && (
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Categoría:</strong> {hecho.categoria}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Fecha:</strong>{" "}
                    {hecho.fechaAcontecimiento
                      ? new Date(hecho.fechaAcontecimiento).toLocaleDateString()
                      : "No especificada"}
                  </p>

                  {/* Sección de Multimedia Simplificada */}
                  {hecho.archivosMultimedia &&
                    hecho.archivosMultimedia.length > 0 && (
                      <div className="mb-3">
                        <button
                          onClick={() =>
                            abrirVisor(hecho.archivosMultimedia, 0)
                          }
                          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
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
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Ver Multimedia ({hecho.archivosMultimedia.length})
                        </button>
                      </div>
                    )}

                  {/* Botón de reportar más pegado */}
                  <button
                    onClick={() => reportarHecho(hecho)}
                    className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium"
                  >
                    Reportar este hecho
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Visor de Multimedia */}
        <VisorMultimedia />

        {/* La info como una barra flotante en la parte inferior */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md text-xs text-gray-700 dark:text-gray-200">
          {infoMapa} | Zoom: {zoom.toFixed(1)}
        </div>
      </div>
    </>
  );
};

export default MapaPrincipal;
