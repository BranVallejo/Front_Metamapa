import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <--- IMPORT NECESARIO
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  ZoomControl,
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

const ICONO_DEFAULT =
  "https://res.cloudinary.com/dikwt4s3v/image/upload/v1764597823/library/iwq8tmolua2ux5szrezt.png";

const obtenerIconoParaHecho = (hecho) => {
  const categoria = hecho?.categoria?.toLowerCase().trim();
  let iconUrl = ICONO_DEFAULT;

  if (categoria && ICONOS_POR_CATEGORIA[categoria]) {
    iconUrl = ICONOS_POR_CATEGORIA[categoria];
  }

  return new L.Icon({
    iconUrl: iconUrl,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
    shadowAnchor: [13, 41],
    className: "marker-icon-custom",
  });
};

const FiltroIcono = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

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
          `Zoom bajo (${newZoom.toFixed(1)}). Acerca a ${zoomMinimoParaHechos}+`
        );
      }
    },
  });
  return null;
}

const getFileType = (url) => {
  const extension = url.split(".").pop().toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];
  return imageExtensions.includes(extension)
    ? "image"
    : videoExtensions.includes(extension)
    ? "video"
    : "unknown";
};

const MapaPrincipal = () => {
  const navigate = useNavigate(); // Hook de navegación
  const [panelFiltrosAbierto, setPanelFiltrosAbierto] = useState(false);
  const [hechoSeleccionadoId, setHechoSeleccionadoId] = useState(null);
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
    estadoDeseado: "VISIBLE",
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    ...filtrosPendientes,
  });

  const [visorAbierto, setVisorAbierto] = useState(false);
  const [imagenActual, setImagenActual] = useState(0);
  const [archivosMultimediaActuales, setArchivosMultimediaActuales] = useState(
    []
  );

  const zoomMinimoParaHechos = 13;

  const BASE_URL = import.meta.env.VITE_URL_INICIAL_GESTOR;

  if (!BASE_URL) {
    throw new Error("VITE_URL_INICIAL_GESTOR no está definido (revisá .env y reiniciá Vite)");
  }

  const API_BASE_URL = `${BASE_URL}/publica`;
  const GRAPHQL_ENDPOINT = `${BASE_URL}/graphql`;

  // Función para hacer peticiones GraphQL - CONSULTA COMPLETA
  const fetchHechosGraphQL = async (variables) => {
    // 🔥 CAMBIO CLAVE: Pedimos 'id' y 'sugerencia_cambio'
    const query = `
      query ($filtro: HechoFiltroInput) {
        obtenerHechosFiltrados(filtro: $filtro) {
          id
          titulo
          descripcion
          categoria
          fechaAcontecimiento
          latitud
          longitud
          archivosMultimedia
          sugerencia_cambio
        }
      }
    `;

    console.log("🚀 Enviando query GraphQL:", query);
    console.log("📦 Variables enviadas:", variables);

    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { filtro: variables },
        }),
      });

      const text = await response.text();
      let result;
      try { result = JSON.parse(text); }
      catch { throw new Error(`Respuesta no JSON (${response.status}): ${text.slice(0,200)}`); }

      console.log("✅ Respuesta GraphQL completa:", result);

      if (result.errors) {
        console.error("❌ GraphQL errors:", result.errors);
        throw new Error(result.errors[0].message);
      }

      console.log("📊 Hechos recibidos:", result.data?.obtenerHechosFiltrados);
      return result.data?.obtenerHechosFiltrados || [];
    } catch (error) {
      console.error("❌ Error en GraphQL request:", error);
      throw error;
    }
  };

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

  const VisorMultimedia = () => {
    if (!visorAbierto || archivosMultimediaActuales.length === 0) return null;
    const archivoActual = archivosMultimediaActuales[imagenActual];
    const tipoArchivo = getFileType(archivoActual);

    return (
      <div className="fixed inset-0 bg-black/95 z-[99999] flex flex-col animate-fadeIn">
        <div className="flex items-center justify-between px-6 py-4 bg-transparent absolute top-0 w-full z-[100000]">
          <div className="text-white/80 text-sm font-medium backdrop-blur-md bg-black/30 px-3 py-1 rounded-full">
            {imagenActual + 1} / {archivosMultimediaActuales.length}
          </div>
          <button
            onClick={cerrarVisor}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all cursor-pointer pointer-events-auto"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        <div className="flex-1 flex items-center justify-center p-4 relative z-[99999]">
          {archivosMultimediaActuales.length > 1 && (
            <>
              <button
                onClick={imagenAnterior}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all hover:scale-110 z-[100000]"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={imagenSiguiente}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all hover:scale-110 z-[100000]"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-[85vh] flex items-center justify-center">
            {tipoArchivo === "image" ? (
              <img
                src={archivoActual}
                alt="Vista previa"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            ) : tipoArchivo === "video" ? (
              <video
                src={archivoActual}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
              />
            ) : (
              <div className="text-white text-center">Archivo no soportado</div>
            )}
          </div>
        </div>

        {archivosMultimediaActuales.length > 1 && (
          <div className="bg-black/50 backdrop-blur-md p-4 flex justify-center gap-2 overflow-x-auto z-[100000]">
            {archivosMultimediaActuales.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setImagenActual(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === imagenActual
                    ? "border-blue-500 scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {getFileType(src) === "image" ? (
                  <img
                    src={src}
                    className="w-full h-full object-cover"
                    alt="miniatura"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-xs text-white">Video</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    cargarColecciones();
  }, []);
  useEffect(() => {
    if (bounds && zoom >= zoomMinimoParaHechos) cargarHechosParaAreaVisible();
  }, [
    bounds,
    zoom,
    filtrosAplicados,
    coleccionAplicada,
    modoColeccionAplicada,
  ]);

  const cargarColecciones = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/colecciones`);
      const data = await res.json();
      setColecciones(data.colecciones || []);
    } catch (e) {
      console.error(e);
    }
  };

  const cargarHechosParaAreaVisible = async () => {
    if (!bounds) return;
    setInfoMapa("Cargando hechos...");

    const { _southWest, _northEast } = bounds;

    // Construir variables GraphQL desde los filtros aplicados
    const variables = {
      sur: _southWest.lat,
      oeste: _southWest.lng,
      norte: _northEast.lat,
      este: _northEast.lng,
      titulo: filtrosAplicados.titulo || undefined,
      descripcion: filtrosAplicados.descripcion || undefined,
      categoria: filtrosAplicados.categoria || undefined,
      contieneMultimedia: filtrosAplicados.contieneMultimedia
        ? filtrosAplicados.contieneMultimedia === "true"
        : undefined,
      desdeAcontecimiento: filtrosAplicados.desdeAcontecimiento
        ? `${filtrosAplicados.desdeAcontecimiento}T00:00:00`
        : undefined,
      hastaAcontecimiento: filtrosAplicados.hastaAcontecimiento
        ? `${filtrosAplicados.hastaAcontecimiento}T23:59:59`
        : undefined,
      desdeCarga: filtrosAplicados.desdeCarga
        ? `${filtrosAplicados.desdeCarga}T00:00:00`
        : undefined,
      hastaCarga: filtrosAplicados.hastaCarga
        ? `${filtrosAplicados.hastaCarga}T23:59:59`
        : undefined,
      estadoDeseado: filtrosAplicados.estadoDeseado || "VISIBLE",
    };

    // Añadir filtros de colección si existen
    if (coleccionAplicada) {
      variables.coleccionId = coleccionAplicada.handle;
      variables.modo = modoColeccionAplicada;
    }

    // Eliminar propiedades undefined para no enviarlas
    Object.keys(variables).forEach((key) => {
      if (variables[key] === undefined) {
        delete variables[key];
      }
    });

    try {
      const hechos = await fetchHechosGraphQL(variables);

      if (hechos && hechos.length > 0) {
        setMarcadores(hechos);
        setInfoMapa(`Cargados ${hechos.length} hechos`);
      } else {
        setMarcadores([]);
        setInfoMapa("No se encontraron hechos");
      }
    } catch (e) {
      console.error(e);
      setInfoMapa("Error cargando hechos");
    }
  };

  const handleFiltroChange = (c, v) =>
    setFiltrosPendientes((prev) => ({ ...prev, [c]: v }));
  const cambiarColeccionPendiente = (e) =>
    setColeccionPendiente(
      colecciones.find((c) => c.handle === e.target.value) || null
    );
  const aplicarFiltros = () => {
    setFiltrosAplicados(filtrosPendientes);
    setColeccionAplicada(coleccionPendiente);
    setModoColeccionAplicada(modoColeccionPendiente);
    setPanelFiltrosAbierto(false);
  };
  const limpiarFiltros = () => {
    const vacio = {
      titulo: "",
      descripcion: "",
      categoria: "",
      tipoFuente: "",
      contieneMultimedia: "",
      desdeAcontecimiento: "",
      hastaAcontecimiento: "",
      estadoDeseado: "",
    };
    setFiltrosPendientes(vacio);
    setFiltrosAplicados(vacio);
    setColeccionPendiente(null);
    setColeccionAplicada(null);
    setPanelFiltrosAbierto(false);
  };

  const reportarHecho = (hecho) => {
    const idFinal = hecho.id || hecho.hecho_id;

    if (!idFinal) {
      console.error("❌ Error: Este hecho no tiene ID cargado. Revisa la Query GraphQL.", hecho);
      return;
    }

    navigate(`/solicitarEliminacion/${idFinal}`);
  };

  return (
    <>
      <style>{`
        /* ESTILOS BASE (MODO CLARO) */
        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          padding: 0;
          overflow: hidden;
        }
        .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95);
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: 320px !important;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #666;
          font-size: 18px;
          padding: 8px;
          top: 4px;
          right: 4px;
          transition: all 0.2s;
          z-index: 10;
        }
        .leaflet-container a.leaflet-popup-close-button:hover {
          color: #000;
          background: rgba(0,0,0,0.05);
          border-radius: 50%;
        }

        /* --- MODO OSCURO (ACTIVADO POR CLASE .dark) --- */
        .dark .leaflet-popup-content-wrapper {
              background: rgba(31, 41, 55, 0.95) !important;
              border-color: rgba(255, 255, 255, 0.1);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }
        .dark .leaflet-popup-tip {
              background: rgba(31, 41, 55, 0.95) !important;
        }
        .dark .leaflet-container a.leaflet-popup-close-button {
              color: #ccc;
        }
        .dark .leaflet-container a.leaflet-popup-close-button:hover {
              color: #fff;
              background: rgba(255,255,255,0.1);
        }
      `}</style>

      <div className="h-screen w-full relative overflow-hidden bg-gray-900">
        <MapContainer
          center={[-38.4161, -63.6167]}
          zoom={4}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
          minZoom={4}
          maxZoom={18}
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents
            onBoundsChange={setBounds}
            onZoomChange={setZoom}
            zoomMinimoParaHechos={zoomMinimoParaHechos}
            setInfoMapa={setInfoMapa}
            setMarcadores={setMarcadores}
          />
          {marcadores.map((hecho, index) => {
            const hechoKey = index.toString();
            const uniqueId = hecho.id ? hecho.id.toString() : index.toString();

            return (
              <Marker
                key={hechoKey}
                position={[
                  parseFloat(hecho.latitud),
                  parseFloat(hecho.longitud),
                ]}
                icon={obtenerIconoParaHecho(hecho)}
                eventHandlers={{
                  click: () => {
                    setHechoSeleccionadoId(uniqueId);
                  },
                }}
              >
                {hechoSeleccionadoId === uniqueId && (
                  <Popup
                    autoClose={false}
                    closeOnClick={false}
                    closeButton={true}
                    eventHandlers={{
                      remove: () => setHechoSeleccionadoId(null),
                    }}
                  >
                    {/* ===== POPUP CARD COMPLETA ===== */}
                    <div className="flex flex-col transition-colors duration-300">
                      {/* Encabezado */}
                      <div className="px-5 pt-5 pb-2">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-200/50 dark:border-blue-800/50">
                          {hecho.categoria || "General"}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 leading-tight">
                          {hecho.titulo || "Hecho sin título"}
                        </h3>
                      </div>

                      {/* Cuerpo */}
                      <div className="px-5 pb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-2 line-clamp-4">
                          {hecho.descripcion || "Sin descripción disponible."}
                        </p>

                        {/* --- 🔥 MOSTRAR SUGERENCIA_CAMBIO DEL ADMIN --- */}
                        {hecho.sugerencia_cambio && (
                          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg">
                            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                              <span>⚠️</span> Sugerencia del Admin:
                            </p>
                            <p className="text-xs text-gray-700 dark:text-gray-200 italic">
                              "{hecho.sugerencia_cambio}"
                            </p>
                          </div>
                        )}

                        {hecho.fechaAcontecimiento && (
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-medium">
                            Ocurrido el:{" "}
                            {new Date(
                              hecho.fechaAcontecimiento
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {/* Footer - SOLO si hay archivos multimedia */}
                      {hecho.archivosMultimedia &&
                        hecho.archivosMultimedia.length > 0 && (
                          <div className="bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm border-t border-gray-100 dark:border-gray-600 p-3 flex gap-2">
                            <button
                              onClick={() =>
                                abrirVisor(hecho.archivosMultimedia)
                              }
                              className="flex-1 py-2 bg-gray-900 hover:bg-black dark:bg-gray-600 dark:hover:bg-gray-500 text-white text-xs font-bold rounded-lg shadow-md transition-all hover:scale-[1.02] active:scale-95"
                            >
                              Ver Fotos ({hecho.archivosMultimedia.length})
                            </button>

                            <button
                              onClick={() => reportarHecho(hecho)}
                              className="flex-1 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white shadow-md text-xs font-bold rounded-lg transition-all hover:scale-[1.02] active:scale-95"
                            >
                              Reportar
                            </button>
                          </div>
                        )}

                      {/* Footer - SI NO hay archivos multimedia */}
                      {(!hecho.archivosMultimedia ||
                        hecho.archivosMultimedia.length === 0) && (
                        <div className="bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm border-t border-gray-100 dark:border-gray-600 p-3">
                          <button
                            onClick={() => reportarHecho(hecho)}
                            className="w-full py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white shadow-md text-xs font-bold rounded-lg transition-all hover:scale-[1.02] active:scale-95"
                          >
                            Reportar
                          </button>
                        </div>
                      )}
                    </div>
                    {/* ===== FIN POPUP CARD ===== */}
                  </Popup>
                )}
              </Marker>
            );
          })}
        </MapContainer>

        {/* --- BOTÓN DE FILTROS FLOTANTE --- */}
        <div className="absolute top-32 left-4 z-[1000] md:top-24">
          <button
            onClick={() => setPanelFiltrosAbierto(true)}
            className="group flex items-center p-2 md:pl-4 md:pr-6 md:py-3.5 
                        bg-white/90 dark:bg-gray-800/90 
                        backdrop-blur-md rounded-full shadow-lg 
                        border border-white/40 dark:border-gray-600 
                        transition-all hover:scale-105 gap-0 md:gap-3"
          >
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-gray-200 dark:group-hover:bg-gray-600 relative transition-colors">
              <FiltroIcono />
              {(filtrosAplicados.categoria || coleccionAplicada) && (
                <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
              )}
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="font-bold text-gray-900 dark:text-white text-sm">
                Filtros
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {coleccionAplicada ? "Colección activa" : "Personalizar"}
              </span>
            </div>
          </button>
        </div>

        <FiltrosPanel
          isOpen={panelFiltrosAbierto}
          onClose={() => setPanelFiltrosAbierto(false)}
          colecciones={colecciones}
          filtros={filtrosPendientes}
          coleccionPendiente={coleccionPendiente}
          modoColeccionPendiente={modoColeccionPendiente}
          coleccionAplicada={coleccionAplicada}
          onFiltroChange={handleFiltroChange}
          onColeccionChange={cambiarColeccionPendiente}
          onModoChange={(modo) => setModoColeccionPendiente(modo)}
          onLimpiar={limpiarFiltros}
          onAplicar={aplicarFiltros}
        />

        <VisorMultimedia />

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[999]">
          <div className="px-5 py-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full text-gray-800 dark:text-white text-xs font-bold shadow-xl border border-white/50 dark:border-gray-600 flex items-center gap-3">
            <span>{infoMapa}</span>
            <span className="w-px h-3 bg-gray-300 dark:bg-gray-600"></span>
            <span className="text-gray-500 dark:text-gray-400">
              Zoom: {zoom.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapaPrincipal;