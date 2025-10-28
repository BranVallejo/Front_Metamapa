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

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapaPrincipal = () => {
  // Estados
  const [marcadores, setMarcadores] = useState([]);
  const [colecciones, setColecciones] = useState([]);
  const [coleccionPendiente, setColeccionPendiente] = useState(null); // Colección seleccionada en el dropdown
  const [coleccionAplicada, setColeccionAplicada] = useState(null); // Colección realmente aplicada
  const [modoColeccionPendiente, setModoColeccionPendiente] =
    useState("curada"); // Modo pendiente
  const [modoColeccionAplicada, setModoColeccionAplicada] = useState("curada"); // Modo aplicado
  const [infoMapa, setInfoMapa] = useState("Cargando mapa...");
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(4);

  // Filtros - separamos filtros actuales de filtros pendientes
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

  // Configuración
  const zoomMinimoParaHechos = 13;
  const API_BASE_URL = "http://localhost:8500/gestordatos/publica";

  // Cargar colecciones al inicio
  useEffect(() => {
    cargarColecciones();
  }, []);

  // Cargar hechos solo cuando cambien los bounds, zoom o filtros APLICADOS
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
      console.log("Respuesta de API:", data);

      if (data && data.colecciones && Array.isArray(data.colecciones)) {
        setColecciones(data.colecciones);
      } else {
        setColecciones([]);
      }
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

      // Agregar bounds
      const { _southWest, _northEast } = bounds;
      params.append("sur", _southWest.lat);
      params.append("oeste", _southWest.lng);
      params.append("norte", _northEast.lat);
      params.append("este", _northEast.lng);

      // Agregar filtros APLICADOS (no los pendientes)
      Object.entries(filtrosAplicados).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      // Agregar colección APLICADA (no la pendiente)
      if (coleccionAplicada) {
        params.append("coleccionId", coleccionAplicada.handle);
        params.append("modo", modoColeccionAplicada);
      }

      const url = `${API_BASE_URL}/hechos?${params.toString()}`;
      console.log("Fetching hechos from:", url);

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const data = await response.json();
      console.log("Datos recibidos:", data);

      if (data && data.hechos && Array.isArray(data.hechos)) {
        setMarcadores(data.hechos);
        setInfoMapa(
          `Cargados ${
            data.hechos_encontrados || data.hechos.length
          } hechos en el área visible`
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

  const cambiarColeccionPendiente = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      const coleccion = colecciones.find((c) => c.handle === selectedValue);
      setColeccionPendiente(coleccion);
    } else {
      setColeccionPendiente(null);
    }
  };

  const cambiarModoColeccionPendiente = (modo) => {
    setModoColeccionPendiente(modo);
  };

  const aplicarFiltros = () => {
    // Formatear fechas antes de aplicar
    const filtrosConFechasFormateadas = { ...filtrosPendientes };

    const camposFecha = [
      "desdeAcontecimiento",
      "hastaAcontecimiento",
      "desdeCarga",
      "hastaCarga",
    ];

    console.log("Filtros pendientes antes de formatear:", filtrosPendientes);

    camposFecha.forEach((campo) => {
      if (
        filtrosConFechasFormateadas[campo] &&
        !filtrosConFechasFormateadas[campo].includes("T")
      ) {
        // Solo agregar T00:00:00 si no lo tiene ya
        filtrosConFechasFormateadas[
          campo
        ] = `${filtrosConFechasFormateadas[campo]}T00:00:00`;
        console.log(
          `Campo ${campo} formateado:`,
          filtrosConFechasFormateadas[campo]
        );
      }
    });

    console.log("Filtros después de formatear:", filtrosConFechasFormateadas);

    // Aplicar los filtros con fechas formateadas
    setFiltrosAplicados(filtrosConFechasFormateadas);
    setColeccionAplicada(coleccionPendiente);
    setModoColeccionAplicada(modoColeccionPendiente);

    setInfoMapa("Aplicando filtros...");

    if (bounds && zoom >= zoomMinimoParaHechos) {
      cargarHechosParaAreaVisible();
    } else {
      setInfoMapa("Filtros aplicados - acerca el mapa para ver resultados");
    }
  };

  const limpiarFiltros = () => {
    // Limpiar ambos sets de filtros y colecciones
    setFiltrosPendientes({
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

    setFiltrosAplicados({
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

    setColeccionPendiente(null);
    setColeccionAplicada(null);
    setModoColeccionPendiente("curada");
    setModoColeccionAplicada("curada");
    setMarcadores([]);
    setInfoMapa("Filtros limpiados");
  };

  const handleFiltroChange = (campo, valor) => {
    // Si es un campo de fecha, agregar T00:00:00
    let valorFormateado = valor;

    if (
      valor &&
      (campo.includes("desde") || campo.includes("hasta")) &&
      campo.includes("Acontecimiento")
    ) {
      valorFormateado = `${valor}T00:00:00`;
    }

    // Solo actualizar filtros pendientes, no los aplicados
    setFiltrosPendientes((prev) => ({
      ...prev,
      [campo]: valorFormateado,
    }));
  };

  // Componente para manejar eventos del mapa
  function MapEvents({ onBoundsChange, onZoomChange }) {
    const map = useMapEvents({
      moveend: () => {
        const newBounds = map.getBounds();
        const newZoom = map.getZoom();
        onBoundsChange(newBounds);
        onZoomChange(newZoom);
      },
      zoomend: () => {
        const newZoom = map.getZoom();
        onZoomChange(newZoom);
      },
    });
    return null;
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar de Filtros */}
        <div className="w-80 bg-white p-4 shadow-lg overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 mb-4">
            Filtros de Búsqueda
          </h3>

          {/* Filtro de Colección */}
          <div className="mb-6">
            <h4 className="text-blue-600 font-medium mb-2 border-b border-gray-200 pb-1">
              Colección
            </h4>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Seleccionar Colección:
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                onChange={cambiarColeccionPendiente}
                value={coleccionPendiente?.handle || ""}
              >
                <option value="">Todas las colecciones</option>
                {colecciones.map((coleccion) => (
                  <option key={coleccion.handle} value={coleccion.handle}>
                    {coleccion.titulo}
                  </option>
                ))}
              </select>

              {/* Modos de colección */}
              {coleccionPendiente && (
                <>
                  <div className="mt-3">
                    <label className="block text-sm text-gray-600 mb-1">
                      Modo de visualización:
                    </label>
                    <div className="flex gap-2">
                      <button
                        className={`flex-1 py-1 px-2 text-xs border border-green-500 rounded transition-colors ${
                          modoColeccionPendiente === "curada"
                            ? "bg-green-500 text-white"
                            : "bg-white text-green-500 hover:bg-green-500 hover:text-white"
                        }`}
                        onClick={() => cambiarModoColeccionPendiente("curada")}
                      >
                        Curada
                      </button>
                      <button
                        className={`flex-1 py-1 px-2 text-xs border border-green-500 rounded transition-colors ${
                          modoColeccionPendiente === "irrestricta"
                            ? "bg-green-500 text-white"
                            : "bg-white text-green-500 hover:bg-green-500 hover:text-white"
                        }`}
                        onClick={() =>
                          cambiarModoColeccionPendiente("irrestricta")
                        }
                      >
                        Irrestricta
                      </button>
                    </div>
                  </div>

                  {/* Información de colección PENDIENTE */}
                  <div className="mt-3 bg-blue-50 p-3 rounded border-l-4 border-green-500">
                    <h4 className="font-medium text-green-600 text-sm">
                      {coleccionPendiente.titulo}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {coleccionPendiente.descripcion || "Sin descripción"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Modo:</strong>{" "}
                      {modoColeccionPendiente === "curada"
                        ? "Curada"
                        : "Irrestricta"}
                    </p>
                  </div>
                </>
              )}

              {/* Información de colección APLICADA si es diferente de la pendiente */}
              {coleccionAplicada &&
                coleccionAplicada.handle !== coleccionPendiente?.handle && (
                  <div className="mt-3 bg-green-50 p-3 rounded border-l-4 border-blue-500">
                    <h4 className="font-medium text-blue-600 text-sm">
                      Colección activa: {coleccionAplicada.titulo}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Modo aplicado:</strong>{" "}
                      {modoColeccionAplicada === "curada"
                        ? "Curada"
                        : "Irrestricta"}
                    </p>
                  </div>
                )}
            </div>
          </div>

          {/* Resto de los filtros (se mantienen igual) */}
          {/* Búsqueda por Texto */}
          <div className="mb-6">
            <h4 className="text-blue-600 font-medium mb-2 border-b border-gray-200 pb-1">
              Búsqueda por Texto
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título:
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Buscar en título..."
                  value={filtrosPendientes.titulo}
                  onChange={(e) => handleFiltroChange("titulo", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción:
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Buscar en descripción..."
                  value={filtrosPendientes.descripcion}
                  onChange={(e) =>
                    handleFiltroChange("descripcion", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Filtros por Categoría */}
          <div className="mb-6">
            <h4 className="text-blue-600 font-medium mb-2 border-b border-gray-200 pb-1">
              Filtros por Categoría
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría:
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={filtrosPendientes.categoria}
                  onChange={(e) =>
                    handleFiltroChange("categoria", e.target.value)
                  }
                >
                  <option value="">Todas las categorías</option>
                  <option value="vientos fuertes">vientos fuertes</option>
                  <option value="inundaciones">inundaciones</option>
                  <option value="granizo">Granizo</option>
                  <option value="nevadas">Nevadas</option>
                  <option value="calor extremo">Calor extremo</option>
                  <option value="sequia">Sequía</option>
                  <option value="derrumbes">Derrumbes</option>
                  <option value="actividad volcnica">
                    Actividad volcánica
                  </option>
                  <option value="contaminación">Contaminación</option>
                  <option value="evento sanitario">Evento sanitario</option>
                  <option value="derrame">Derrame</option>
                  <option value="intoxicacion masiva">
                    Intoxicación masiva
                  </option>
                  <option value="sin categoria">Sin categoría</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿Tiene multimedia?
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={filtrosPendientes.contieneMultimedia}
                  onChange={(e) =>
                    handleFiltroChange("contieneMultimedia", e.target.value)
                  }
                >
                  <option value="">Todos</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origen:
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={filtrosPendientes.tipoFuente}
                  onChange={(e) =>
                    handleFiltroChange("tipoFuente", e.target.value)
                  }
                >
                  <option value="">Todos los orígenes</option>
                  <option value="DINAMICA">Por otros usuarios</option>
                  <option value="ESTATICA">De archivos</option>
                  <option value="PROXY">Otros mapas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filtros por Fecha */}
          <div className="mb-6">
            <h4 className="text-blue-600 font-medium mb-2 border-b border-gray-200 pb-1">
              Filtros por Fecha
            </h4>
            <div className="space-y-3">
              {[
                { label: "Acontecimiento Desde:", key: "desdeAcontecimiento" },
                { label: "Acontecimiento Hasta:", key: "hastaAcontecimiento" },
                { label: "Carga Desde:", key: "desdeCarga" },
                { label: "Carga Hasta:", key: "hastaCarga" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={
                      filtrosPendientes[key]
                        ? filtrosPendientes[key].split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const fecha = e.target.value; // Esto viene en formato YYYY-MM-DD
                      handleFiltroChange(key, fecha);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
              onClick={limpiarFiltros}
            >
              Limpiar
            </button>
            <button
              className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              onClick={aplicarFiltros}
            >
              Aplicar
            </button>
          </div>
        </div>

        {/* Mapa (se mantiene igual) */}
        <div className="flex-1 flex flex-col p-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Mapa de Argentina - Hechos
          </h1>

          <div className="flex-1 bg-white rounded-lg shadow-md p-4">
            <MapContainer
              center={[-38.4161, -63.6167]}
              zoom={4}
              style={{ height: "100%", width: "100%" }}
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
                onZoomChange={(newZoom) => {
                  setZoom(newZoom);
                  if (newZoom < zoomMinimoParaHechos) {
                    setMarcadores([]);
                    setInfoMapa(
                      `Zoom bajo (${newZoom.toFixed(
                        1
                      )}). Acerca a ${zoomMinimoParaHechos}+ para ver hechos.`
                    );
                  }
                }}
              />

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
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Panel de información */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-800 mb-1">Información</h3>
            <p className="text-sm text-gray-600">
              {infoMapa} | Zoom actual: {zoom.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaPrincipal;
