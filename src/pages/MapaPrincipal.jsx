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
  const [coleccionActual, setColeccionActual] = useState(null);
  const [modoColeccionActual, setModoColeccionActual] = useState("curada");
  const [infoMapa, setInfoMapa] = useState("Cargando mapa...");
  //const [cargando, setCargando] = useState(false);

  // Filtros
  const [filtros, setFiltros] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    origen: "",
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

  const cargarColecciones = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/colecciones`);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();
      setColecciones(data);
    } catch (error) {
      console.error("Error cargando colecciones:", error);
    }
  };

  const cambiarColeccion = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      const coleccion = colecciones.find((c) => c.handle === selectedValue);
      setColeccionActual(coleccion);
    } else {
      setColeccionActual(null);
    }
  };

  const cambiarModoColeccion = (modo) => {
    setModoColeccionActual(modo);
  };

  const aplicarFiltros = () => {
    // Aquí iría la lógica para recargar los hechos con los filtros
    setInfoMapa("Aplicando filtros...");
    // cargarHechosParaAreaVisible();
  };

  const limpiarFiltros = () => {
    setFiltros({
      titulo: "",
      descripcion: "",
      categoria: "",
      origen: "",
      contieneMultimedia: "",
      desdeAcontecimiento: "",
      hastaAcontecimiento: "",
      desdeCarga: "",
      hastaCarga: "",
    });
    setColeccionActual(null);
    setModoColeccionActual("curada");
    setMarcadores([]);
    setInfoMapa("Filtros limpiados");
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  // Componente para manejar eventos del mapa
  function MapEvents() {
    const map = useMapEvents({
      moveend: () => {
        const zoom = map.getZoom();
        if (zoom >= zoomMinimoParaHechos) {
          // cargarHechosParaAreaVisible();
        } else {
          setMarcadores([]);
          setInfoMapa(
            `Zoom bajo (${zoom.toFixed(
              1
            )}). Acerca a ${zoomMinimoParaHechos}+ para ver hechos.`
          );
        }
      },
      zoomend: () => {
        const zoom = map.getZoom();
        if (zoom < zoomMinimoParaHechos) {
          setMarcadores([]);
          setInfoMapa(
            `Zoom bajo (${zoom.toFixed(
              1
            )}). Acerca a ${zoomMinimoParaHechos}+ para ver hechos.`
          );
        }
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
                onChange={cambiarColeccion}
                value={coleccionActual?.handle || ""}
              >
                <option value="">Todas las colecciones</option>
                {colecciones.map((coleccion) => (
                  <option key={coleccion.handle} value={coleccion.handle}>
                    {coleccion.nombre}
                  </option>
                ))}
              </select>

              {/* Modos de colección */}
              {coleccionActual && (
                <>
                  <div className="mt-3">
                    <label className="block text-sm text-gray-600 mb-1">
                      Modo de visualización:
                    </label>
                    <div className="flex gap-2">
                      <button
                        className={`flex-1 py-1 px-2 text-xs border border-green-500 rounded transition-colors ${
                          modoColeccionActual === "curada"
                            ? "bg-green-500 text-white"
                            : "bg-white text-green-500 hover:bg-green-500 hover:text-white"
                        }`}
                        onClick={() => cambiarModoColeccion("curada")}
                      >
                        Curada
                      </button>
                      <button
                        className={`flex-1 py-1 px-2 text-xs border border-green-500 rounded transition-colors ${
                          modoColeccionActual === "irrestricta"
                            ? "bg-green-500 text-white"
                            : "bg-white text-green-500 hover:bg-green-500 hover:text-white"
                        }`}
                        onClick={() => cambiarModoColeccion("irrestricta")}
                      >
                        Irrestricta
                      </button>
                    </div>
                  </div>

                  {/* Información de colección activa */}
                  <div className="mt-3 bg-blue-50 p-3 rounded border-l-4 border-green-500">
                    <h4 className="font-medium text-green-600 text-sm">
                      {coleccionActual.nombre}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {coleccionActual.descripcion || "Sin descripción"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Modo:</strong>{" "}
                      {modoColeccionActual === "curada"
                        ? "Curada"
                        : "Irrestricta"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

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
                  value={filtros.titulo}
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
                  value={filtros.descripcion}
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
                  value={filtros.categoria}
                  onChange={(e) =>
                    handleFiltroChange("categoria", e.target.value)
                  }
                >
                  <option value="">Todas las categorías</option>
                  <option value="Incendio">Incendio</option>
                  <option value="Manifestacion">Manifestación</option>
                  <option value="Accidente">Accidente</option>
                  <option value="Evento Cultural">Evento Cultural</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Construccion">Construcción</option>
                  <option value="Inundacion">Inundación</option>
                  <option value="Granizo">Granizo</option>
                  <option value="Nevadas">Nevadas</option>
                  <option value="Calor extremo">Calor extremo</option>
                  <option value="Sequia">Sequía</option>
                  <option value="Derrumbes">Derrumbes</option>
                  <option value="Actividad volcnica">
                    Actividad volcánica
                  </option>
                  <option value="Contaminación">Contaminación</option>
                  <option value="Evento sanitario">Evento sanitario</option>
                  <option value="Derrame">Derrame</option>
                  <option value="Intoxicacion masiva">
                    Intoxicación masiva
                  </option>
                  <option value="Sin categoria">Sin categoría</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿Tiene multimedia?
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={filtros.contieneMultimedia}
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
                  value={filtros.origen}
                  onChange={(e) => handleFiltroChange("origen", e.target.value)}
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
                    value={filtros[key]}
                    onChange={(e) => handleFiltroChange(key, e.target.value)}
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

        {/* Mapa */}
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
              <MapEvents />

              {marcadores.map((hecho, index) => (
                <Marker key={index} position={[hecho.latitud, hecho.longitud]}>
                  <Popup>
                    <div className="min-w-64 max-w-sm">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {hecho.titulo || "Sin título"}
                      </h4>
                      <p className="text-sm mb-1">
                        <strong>Categoría:</strong>{" "}
                        {hecho.categoria || "No especificada"}
                      </p>
                      <p className="text-sm mb-2">
                        {hecho.descripcion || "Sin descripción"}
                      </p>
                      <p className="text-xs text-gray-600">
                        <strong>Fecha:</strong>{" "}
                        {hecho.fechaAcontecimiento || "No especificada"}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Panel de información */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-800 mb-1">Información</h3>
            <p className="text-sm text-gray-600">{infoMapa}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaPrincipal;
