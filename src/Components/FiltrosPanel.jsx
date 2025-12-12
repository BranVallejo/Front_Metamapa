import React, { useState } from "react";

// --- COMPONENTES AUXILIARES (DEFINIDOS AFUERA PARA EVITAR PÉRDIDA DE FOCO) ---

const IconSearch = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const IconCalendar = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconLayers = ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const IconCloseBig = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconCheck = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;

// Título de Sección
const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{children}</h3>
);

// Input Grande
const BigInput = ({ ...props }) => (
  <div className="relative group">
    <input
      {...props}
      className="w-full bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-base font-medium text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:bg-white dark:focus:bg-gray-900 transition-all outline-none"
    />
  </div>
);

const CATEGORIAS = [
  "vientos fuertes", "inundaciones", "granizo", "nevadas", "calor extremo",
  "sequia", "derrumbes", "actividad volcanica", "contaminación",
  "evento sanitario", "derrame", "intoxicacion masiva"
];

const FiltrosPanel = ({
  isOpen,
  onClose,
  colecciones,
  filtros,
  coleccionPendiente,
  modoColeccionPendiente,
  onFiltroChange,
  onColeccionChange,
  onModoChange,
  onLimpiar,
  onAplicar,
}) => {
  const [activeTab, setActiveTab] = useState("explore");

  if (!isOpen) return null;

  // Clases del Modal
  const modalClasses = `
    fixed inset-0 z-[2000] flex items-end md:items-center justify-center p-4 md:p-6
    transition-all duration-300 ease-out
    ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
  `;

  // 👇 AQUÍ AJUSTAMOS LA ALTURA FIJA (h-[85vh] en mobile, h-[650px] en desktop)
  const containerClasses = `
    w-full max-w-2xl h-[85vh] md:h-[650px] flex flex-col
    bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl
    rounded-[2rem] shadow-2xl ring-1 ring-black/5 dark:ring-white/10 border border-white/40 dark:border-gray-700/30
    transform transition-all duration-300 ease-out
    ${isOpen ? "translate-y-0 scale-100" : "translate-y-10 scale-95"}
  `;

  const TabButton = ({ id, icon: Icon, label }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`relative flex-1 flex items-center justify-center gap-2.5 py-4 text-sm font-bold transition-all
          ${isActive 
            ? "text-gray-900 dark:text-white" 
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`} />
        <span>{label}</span>
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-900 dark:bg-white rounded-t-full"></span>
        )}
      </button>
    );
  };

  return (
    <div className={modalClasses}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className={containerClasses}>
        
        {/* --- HEADER --- */}
        <div className="relative flex items-center justify-center p-5 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute left-5 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <IconCloseBig />
          </button>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filtros</h2>
        </div>

        {/* --- TABS --- */}
        <div className="flex px-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 flex-shrink-0">
          <TabButton id="explore" icon={IconSearch} label="Explorar" />
          <TabButton id="time" icon={IconCalendar} label="Fechas" />
          <TabButton id="layers" icon={IconLayers} label="Capas" />
        </div>

        {/* --- CONTENT (Scrollable y Ocupa el espacio restante fijo) --- */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar ie-hide-scroll">
          
          {/* PESTAÑA: EXPLORAR */}
          {activeTab === "explore" && (
            <div className="space-y-8 animate-fadeIn">
              <section>
                <SectionTitle>Búsqueda por texto</SectionTitle>
                <div className="space-y-4">
                  <BigInput
                    type="text"
                    placeholder="Palabras clave en el título..."
                    value={filtros.titulo}
                    onChange={(e) => onFiltroChange("titulo", e.target.value)}
                  />
                   <BigInput
                    type="text"
                    placeholder="Buscar en la descripción..."
                    value={filtros.descripcion}
                    onChange={(e) => onFiltroChange("descripcion", e.target.value)}
                  />
                </div>
              </section>

              <hr className="border-gray-200/50 dark:border-gray-700/50" />

              <section>
                <SectionTitle>Categorías del evento</SectionTitle>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => onFiltroChange("categoria", "")}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${
                      !filtros.categoria 
                      ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900 shadow-md" 
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Todas
                  </button>
                  {CATEGORIAS.map(cat => {
                    const isActive = filtros.categoria === cat;
                    return (
                    <button
                      key={cat}
                      onClick={() => onFiltroChange("categoria", isActive ? "" : cat)}
                      className={`group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border-2 capitalize ${
                        isActive
                        ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900 shadow-md" 
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {isActive && <IconCheck />}
                      {cat}
                    </button>
                  )})}
                </div>
              </section>
              
              <hr className="border-gray-200/50 dark:border-gray-700/50" />

              <section className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Multimedia</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mostrar solo hechos con fotos o videos</p>
                </div>
                 <button
                    onClick={() => onFiltroChange("contieneMultimedia", filtros.contieneMultimedia === "true" ? "" : "true")}
                    className={`relative w-16 h-9 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
                      filtros.contieneMultimedia === "true" ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white dark:bg-gray-900 w-7 h-7 rounded-full shadow-sm transition-transform duration-300 flex items-center justify-center ${
                        filtros.contieneMultimedia === "true" ? "translate-x-7" : "translate-x-0"
                      }`}
                    >
                         {filtros.contieneMultimedia === "true" && <IconCheck className="text-gray-900 dark:text-white w-4 h-4" />}
                    </span>
                  </button>
              </section>
            </div>
          )}

          {/* PESTAÑA: FECHAS */}
          {activeTab === "time" && (
            <div className="space-y-8 animate-fadeIn">
              <section>
                 <SectionTitle>¿Cuándo ocurrió?</SectionTitle>
                 <div className="p-6 bg-gray-50/80 dark:bg-gray-800/50 rounded-[1.5rem] border border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-2">Desde</label>
                      <BigInput
                        type="date"
                        value={filtros.desdeAcontecimiento ? filtros.desdeAcontecimiento.split("T")[0] : ""}
                        onChange={(e) => onFiltroChange("desdeAcontecimiento", e.target.value)}
                        className="!py-3 !px-4 !text-sm !rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-2">Hasta</label>
                       <BigInput
                        type="date"
                        value={filtros.hastaAcontecimiento ? filtros.hastaAcontecimiento.split("T")[0] : ""}
                        onChange={(e) => onFiltroChange("hastaAcontecimiento", e.target.value)}
                         className="!py-3 !px-4 !text-sm !rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </section>
              
              <hr className="border-gray-200/50 dark:border-gray-700/50" />

               <section>
                 <SectionTitle>¿Cuándo se cargó al sistema?</SectionTitle>
                 <div className="p-6 bg-gray-50/80 dark:bg-gray-800/50 rounded-[1.5rem] border border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-2">Desde</label>
                      <BigInput
                        type="date"
                        value={filtros.desdeCarga ? filtros.desdeCarga.split("T")[0] : ""}
                        onChange={(e) => onFiltroChange("desdeCarga", e.target.value)}
                         className="!py-3 !px-4 !text-sm !rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-2">Hasta</label>
                      <BigInput
                        type="date"
                        value={filtros.hastaCarga ? filtros.hastaCarga.split("T")[0] : ""}
                        onChange={(e) => onFiltroChange("hastaCarga", e.target.value)}
                         className="!py-3 !px-4 !text-sm !rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* PESTAÑA: CAPAS */}
          {activeTab === "layers" && (
            <div className="space-y-8 animate-fadeIn">
              <section>
                <SectionTitle>Selecciona una Colección</SectionTitle>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-base font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all outline-none cursor-pointer"
                    onChange={onColeccionChange}
                    value={coleccionPendiente?.handle || ""}
                  >
                    <option value="" className="text-gray-500">Exploración libre (Sin colección)</option>
                    {colecciones.map((coleccion) => (
                      <option key={coleccion.handle} value={coleccion.handle} className="font-medium">
                        📍 {coleccion.titulo}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </section>

              {coleccionPendiente && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[1.5rem] border border-gray-200 dark:border-gray-700 animate-slideUp shadow-sm">
                  <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{coleccionPendiente.titulo}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{coleccionPendiente.descripcion || "Sin descripción disponible para esta colección."}</p>
                  
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block ml-1">Modo de visualización</label>
                    <div className="bg-gray-200/50 dark:bg-gray-900/50 p-1.5 rounded-xl flex shadow-inner">
                      <button
                        onClick={() => onModoChange("curada")}
                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
                          modoColeccionPendiente === "curada"
                          ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md scale-[1.02]"
                          : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        Curada
                      </button>
                      <button
                        onClick={() => onModoChange("irrestricta")}
                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
                          modoColeccionPendiente === "irrestricta"
                          ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md scale-[1.02]"
                          : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        Irrestricta
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* --- FOOTER (Fijo al fondo) --- */}
        <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md flex items-center justify-between gap-4 flex-shrink-0">
          <button
            onClick={onLimpiar}
            className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors underline-offset-4 hover:underline px-4"
          >
            Borrar todo
          </button>
          <button
            onClick={onAplicar}
            className="flex-1 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-base font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95"
          >
            Mostrar resultados
          </button>
        </div>

      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
        .ie-hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default FiltrosPanel;