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
import FiltrosPanel from "../Components/FiltrosPanel"; // Importamos el panel

// --- Fix para los iconos de Leaflet (Tu código) ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// --- Ícono SVG para el botón flotante de filtros ---
const FiltroIcono = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

// --- Componente para manejar eventos del mapa (Tu código, modificado) ---
function MapEvents({ onBoundsChange, onZoomChange, zoomMinimoParaHechos, setInfoMapa, setMarcadores }) {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
      onZoomChange(map.getZoom());
    },
    zoomend: () => {
      const newZoom = map.getZoom();
      onZoomChange(newZoom);
      // Lógica que estaba en tu <MapContainer> original, movida aquí
      if (newZoom < zoomMinimoParaHechos) {
        setMarcadores([]);
        setInfoMapa(`Zoom bajo (${newZoom.toFixed(1)}). Acerca a ${zoomMinimoParaHechos}+ para ver hechos.`);
      }
    },
  });
  return null;
}

const MapaPrincipal = () => {
  // --- ESTADOS ---
  const [panelFiltrosAbierto, setPanelFiltrosAbierto] = useState(false);
  const [marcadores, setMarcadores] = useState([]);
  const [colecciones, setColecciones] = useState([]);
  const [coleccionPendiente, setColeccionPendiente] = useState(null);
  const [coleccionAplicada, setColeccionAplicada] = useState(null);
  const [modoColeccionPendiente, setModoColeccionPendiente] = useState("curada");
  const [modoColeccionAplicada, setModoColeccionAplicada] = useState("curada");
  const [infoMapa, setInfoMapa] = useState("Mové el mapa para cargar hechos.");
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(4);
  const [filtrosPendientes, setFiltrosPendientes] = useState({
    titulo: "", descripcion: "", categoria: "", tipoFuente: "", contieneMultimedia: "",
    desdeAcontecimiento: "", hastaAcontecimiento: "", desdeCarga: "", hastaCarga: "",
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState({ ...filtrosPendientes });

  // --- CONFIGURACIÓN ---
  const zoomMinimoParaHechos = 13;
  const API_BASE_URL = `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica`;

  // --- LÓGICA DE DATOS (Tus funciones) ---
  useEffect(() => {
    cargarColecciones();
  }, []);

  useEffect(() => {
    if (bounds && zoom >= zoomMinimoParaHechos) {
      cargarHechosParaAreaVisible();
    }
  }, [bounds, zoom, filtrosAplicados, coleccionAplicada, modoColeccionAplicada]);

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
        setInfoMapa(`Cargados ${data.hechos_encontrados || data.hechos.length} hechos`);
      } else {
        setMarcadores([]);
        setInfoMapa("No se encontraron hechos");
      }
    } catch (error) {
      console.error("Error cargando hechos:", error);
      setInfoMapa("Error cargando hechos");
    }
  };

  // --- LÓGICA DE FILTROS (Tus funciones) ---
  const handleFiltroChange = (campo, valor) => {
    setFiltrosPendientes((prev) => ({ ...prev, [campo]: valor }));
  };

  const cambiarColeccionPendiente = (event) => {
    const selectedValue = event.target.value;
    const coleccion = colecciones.find((c) => c.handle === selectedValue) || null;
    setColeccionPendiente(coleccion);
  };

  const cambiarModoColeccionPendiente = (modo) => {
    setModoColeccionPendiente(modo);
  };

  const aplicarFiltros = () => {
    const filtrosConFechasFormateadas = { ...filtrosPendientes };
    const camposFecha = ["desdeAcontecimiento", "hastaAcontecimiento", "desdeCarga", "hastaCarga"];
    camposFecha.forEach((campo) => {
      if (filtrosConFechasFormateadas[campo] && !filtrosConFechasFormateadas[campo].includes("T")) {
        filtrosConFechasFormateadas[campo] = `${filtrosConFechasFormateadas[campo]}T00:00:00`;
      }
    });
    setFiltrosAplicados(filtrosConFechasFormateadas);
    setColeccionAplicada(coleccionPendiente);
    setModoColeccionAplicada(modoColeccionPendiente);
    setPanelFiltrosAbierto(false); // <-- Cierra el panel
  };

  const limpiarFiltros = () => {
    const filtrosVacios = {
      titulo: "", descripcion: "", categoria: "", tipoFuente: "", contieneMultimedia: "",
      desdeAcontecimiento: "", hastaAcontecimiento: "", desdeCarga: "", hastaCarga: "",
    };
    setFiltrosPendientes(filtrosVacios);
    setFiltrosAplicados(filtrosVacios);
    setColeccionPendiente(null);
    setColeccionAplicada(null);
    setModoColeccionPendiente("curada");
    setModoColeccionAplicada("curada");
    setMarcadores([]);
    setInfoMapa("Filtros limpiados");
    setPanelFiltrosAbierto(false); // <-- Cierra el panel
  };

  // --- TU FUNCIÓN REPORTAR HECHO (INTEGRADA) ---
  const reportarHecho = (hecho) => {
    const hechoId = hecho.id || hecho._id || hecho.codigo || "desconocido";
    // Redirigir a la página de denuncia
    window.location.href = `solicitarEliminacion/${hechoId}`;
  };

  // --- RENDERIZADO (NUEVO LAYOUT) ---
  return (
    // Contenedor relativo que ocupa toda la altura (menos el header)
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
          className="absolute inset-0 bg-black/50 z-[1001] md:hidden" // Oculto en pantallas medianas y grandes
        ></div>
      )}

      {/* El Panel de Filtros (ahora un componente) */}
      <FiltrosPanel
        isOpen={panelFiltrosAbierto}
        onClose={() => setPanelFiltrosAbierto(false)}
        // Pasamos todos los estados y funciones que necesita
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

      {/* El Mapa (ocupa todo el espacio) */}
      <MapContainer
        center={[-38.4161, -63.6167]}
        zoom={4}
        style={{ height: "100%", width: "100%", zIndex: 0 }} // zIndex 0 para que quede de fondo
        minZoom={4}
        maxZoom={15.5}
        maxBounds={[[-55.0, -73.0], [-21.0, -53.0]]}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents
          onBoundsChange={setBounds}
          onZoomChange={setZoom}
          zoomMinimoParaHechos={zoomMinimoParaHechos}
          setInfoMapa={setInfoMapa}
          setMarcadores={setMarcadores}
        />

        {/* --- TU LÓGICA DE POPUP (INTEGRADA) --- */}
        {marcadores.map((hecho, index) => (
          <Marker
            key={index}
            position={[
              parseFloat(hecho.latitud),
              parseFloat(hecho.longitud),
            ]}
          >
            <Popup>
              <div className="min-w-64 max-w-sm">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {hecho.titulo || "Sin título"}
                </h4>
                <p className="text-sm mb-1">
                  <strong>Categoría:</strong>{" "}
                  {hecho.categoria || hecho.etiqueta || "No especificada"}
                </p>
                <p className="text-sm mb-2">
                  {hecho.descripcion || "Sin descripción"}
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Fecha:</strong>{" "}
                  {hecho.fechaAcontecimiento
                    ? new Date(
                      hecho.fechaAcontecimiento
                    ).toLocaleDateString()
                    : "No especificada"}
                </p>
                {hecho.etiqueta && (
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Etiqueta:</strong> {hecho.etiqueta}
                  </p>
                )}
                <button
                  onClick={() => reportarHecho(hecho)}
                  className="w-full mt-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Reportar este hecho
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* La info como una barra flotante en la parte inferior */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md text-xs text-gray-700 dark:text-gray-200">
        {infoMapa} | Zoom: {zoom.toFixed(1)}
      </div>
    </div>
  );
};

export default MapaPrincipal;