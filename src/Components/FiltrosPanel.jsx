import React from "react";

// Ícono SVG para el botón de cerrar
const CerrarIcono = () => (
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const FiltrosPanel = ({
  isOpen,
  onClose,
  // Estados y props recibidos
  colecciones,
  filtros,
  coleccionPendiente,
  modoColeccionPendiente,
  coleccionAplicada,
  modoColeccionAplicada,
  onFiltroChange,
  onColeccionChange,
  onModoChange,
  onLimpiar,
  onAplicar,
}) => {
  return (
    // Contenedor principal del panel
    <div
      className={`absolute top-0 left-0 h-full z-[1002] w-80 bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto 
                  transition-transform duration-300 ease-in-out
                  ${isOpen ? "translate-x-0" : "-translate-x-full"}`} // Animación
    >
      {/* Encabezado del Panel (con botón de cerrar) */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Filtros de Búsqueda
        </h3>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Cerrar filtros"
        >
          <CerrarIcono />
        </button>
      </div>

      {/* Contenido de los filtros (tu JSX original) */}
      <div className="p-4">
        {/* Filtro de Colección */}
        <div className="mb-6">
          <h4 className="text-blue-600 font-medium mb-2 border-b border-gray-200 pb-1">
            Colección
          </h4>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Seleccionar Colección:
            </label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              onChange={onColeccionChange}
              value={coleccionPendiente?.handle || ""}
            >
              <option value="">Todas las colecciones</option>
              {colecciones.map((coleccion) => (
                <option key={coleccion.handle} value={coleccion.handle}>
                  {coleccion.titulo}
                </option>
              ))}
            </select>

            {coleccionPendiente && (
              <>
                <div className="mt-3">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Modo de visualización:
                  </label>
                  <div className="flex gap-2">
                    <button
                      className={`flex-1 py-1 px-2 text-xs border border-green-500 rounded transition-colors ${
                        modoColeccionPendiente === "curada"
                          ? "bg-green-500 text-white"
                          : "bg-white dark:bg-transparent text-green-500 hover:bg-green-500 hover:text-white"
                      }`}
                      onClick={() => onModoChange("curada")}
                    >
                      Curada
                    </button>
                    <button
                      className={`flex-1 py-1 px-2 text-xs border border-green-500 rounded transition-colors ${
                        modoColeccionPendiente === "irrestricta"
                          ? "bg-green-500 text-white"
                          : "bg-white dark:bg-transparent text-green-500 hover:bg-green-500 hover:text-white"
                      }`}
                      onClick={() => onModoChange("irrestricta")}
                    >
                      Irrestricta
                    </button>
                  </div>
                </div>
                <div className="mt-3 bg-blue-50 dark:bg-gray-700 p-3 rounded border-l-4 border-green-500">
                  <h4 className="font-medium text-green-600 dark:text-green-400 text-sm">
                    {coleccionPendiente.titulo}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {coleccionPendiente.descripcion || "Sin descripción"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <strong>Modo:</strong>{" "}
                    {modoColeccionPendiente === "curada"
                      ? "Curada"
                      : "Irrestricta"}
                  </p>
                </div>
              </>
            )}
            {coleccionAplicada &&
              coleccionAplicada.handle !== coleccionPendiente?.handle && (
                <div className="mt-3 bg-green-50 dark:bg-gray-700 p-3 rounded border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-600 dark:text-blue-400 text-sm">
                    Colección activa: {coleccionAplicada.titulo}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <strong>Modo aplicado:</strong>{" "}
                    {modoColeccionAplicada === "curada"
                      ? "Curada"
                      : "Irrestricta"}
                  </p>
                </div>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Título:
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Buscar en título..."
                value={filtros.titulo}
                onChange={(e) => onFiltroChange("titulo", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción:
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Buscar en descripción..."
                value={filtros.descripcion}
                onChange={(e) => onFiltroChange("descripcion", e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoría:
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={filtros.categoria}
                onChange={(e) => onFiltroChange("categoria", e.target.value)}
              >
                <option value="">Todas las categorías</option>
                <option value="vientos fuertes">vientos fuertes</option>
                <option value="inundaciones">inundaciones</option>
                <option value="granizo">Granizo</option>
                <option value="nevadas">Nevadas</option>
                <option value="calor extremo">Calor extremo</option>
                <option value="sequia">Sequía</option>
                <option value="derrumbes">Derrumbes</option>
                <option value="actividad volcanica">Actividad volcánica</option>
                <option value="contaminación">Contaminación</option>
                <option value="evento sanitario">Evento sanitario</option>
                <option value="derrame">Derrame</option>
                <option value="intoxicacion masiva">Intoxicación masiva</option>
                <option value="sin categoria">Sin categoría</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ¿Tiene multimedia?
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={filtros.contieneMultimedia}
                onChange={(e) =>
                  onFiltroChange("contieneMultimedia", e.target.value)
                }
              >
                <option value="">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Origen:
              </label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={filtros.tipoFuente}
                onChange={(e) => onFiltroChange("tipoFuente", e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {label}
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filtros[key] ? filtros[key].split("T")[0] : ""}
                  onChange={(e) => onFiltroChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3">
          <button
            className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
            onClick={onLimpiar}
          >
            Limpiar
          </button>
          <button
            className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
            onClick={onAplicar}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltrosPanel;
