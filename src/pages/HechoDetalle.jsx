import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

// Fondo y Componentes
import FondoChill from '../Components/FondoDinamico/FondoChill';
import HechoHeader from '../Components/HechoDetalle/HechoHeader';
import PanelDatosPrincipales from '../Components/HechoDetalle/PanelDatosPrincipales';
import PanelUbicacion from '../Components/HechoDetalle/PanelUbicacion';
import PanelDescripcion from '../Components/HechoDetalle/PanelDescripcion';
import PanelMultimedia from '../Components/HechoDetalle/PanelMultimedia';
import PanelInfoReporte from '../Components/HechoDetalle/PanelInfoReporte';
import PanelAcciones from '../Components/HechoDetalle/PanelAcciones';
import PanelInformacion from '../Components/HechoDetalle/PanelInformacion';

const HechoDetalle = () => {
  const { id } = useParams();
  
  const [hecho, setHecho] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(
      `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica/hechos?idBuscado=${id}`,
      { method: "GET" }
    )
    .then(res => {
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (data?.hechos?.length > 0) {
        setHecho(data.hechos[0]);
      } else {
        throw new Error("Hecho no encontrado");
      }
    })
    .catch(err => {
      console.error(err);
      setError(err.message);
      toast.error("Error al cargar", { description: err.message });
    })
    .finally(() => setLoading(false));
  }, [id]);

  // Helper para evitar error de toFixed en coordenadas nulas
  const formatCoord = (val) => {
    const num = Number(val);
    return !isNaN(num) ? num.toFixed(4) : "N/A";
  };
  const safeLat = Number(hecho?.latitud) || 0;
  const safeLng = Number(hecho?.longitud) || 0;

  // --- Renderizado de Carga ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <FondoChill />
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/50"></div>
        </div>
      </div>
    );
  }

  // --- Renderizado de Error ---
  if (error || !hecho) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <FondoChill />
        <div className="relative z-10 p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No encontrado</h1>
          <Link to="/misHechos" className="text-blue-400 hover:underline">Volver al listado</Link>
        </div>
      </div>
    );
  }

  // --- RENDERIZADO PRINCIPAL (Clean Glass) ---
  return (
    <div className="min-h-screen relative text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300">
      
      <FondoChill />
      <Toaster richColors position="top-right" />

      {/* 🔥 CSS INJECTION: LA CLAVE DE LA UNIFORMIDAD
         Esto fuerza a todos tus componentes hijos a perder sus bordes y fondos individuales
         para que se integren 100% en nuestras nuevas tarjetas de cristal.
      */}
      <style>{`
        /* Reseteamos los contenedores hijos */
        .glass-content > div, 
        .glass-content > div > div {
            background-color: transparent !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
        }
        
        /* Unificamos tipografía de etiquetas en los hijos */
        .glass-content h3, 
        .glass-content label, 
        .glass-content .text-sm.font-medium {
            color: inherit !important;
            opacity: 0.7;
            text-transform: uppercase;
            font-size: 0.7rem !important;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
        }

        /* Textos principales más legibles */
        .glass-content p, 
        .glass-content span, 
        .glass-content input, 
        .glass-content select {
            color: inherit !important;
            font-size: 0.95rem;
        }
      `}</style>

      <div className="relative z-10 pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* HEADER DE NAVEGACIÓN */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div className="space-y-2">
             <Link to="/misHechos" className="inline-flex items-center text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors uppercase">
                &larr; Volver al listado
             </Link>
             {/* Título y Categoría (Renderizados limpios) */}
             <div className="glass-content">
                <HechoHeader titulo={hecho.titulo} categoria={hecho.categoria} />
             </div>
          </div>
          
          <div className="flex gap-2">
             <span className="px-3 py-1 bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/20 rounded-full text-xs font-mono">
                ID: {hecho.id}
             </span>
          </div>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* --- COLUMNA IZQUIERDA (Info) --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* TARJETA 1: DESCRIPCIÓN (La más importante) */}
            <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl p-8 shadow-sm">
               <h2 className="text-lg font-bold mb-4 opacity-90">Descripción del Evento</h2>
               <div className="glass-content text-lg leading-relaxed opacity-90">
                  <PanelDescripcion descripcion={hecho.descripcion} />
               </div>
            </div>

            {/* TARJETA 2: DATOS TÉCNICOS (Grid interno) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/50 dark:bg-gray-800/40 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-2xl p-6">
                   <div className="glass-content">
                      <PanelDatosPrincipales hecho={hecho} />
                   </div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/40 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-2xl p-6">
                   <div className="glass-content">
                      <PanelInfoReporte nombre={hecho.nombre_contribuyente} apellido={hecho.apellido_contribuyente} />
                   </div>
                </div>
            </div>

            {/* TARJETA 3: MULTIMEDIA */}
            <div className="bg-white/50 dark:bg-gray-800/40 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-2xl p-6 min-h-[200px]">
               <h2 className="text-sm font-bold opacity-70 uppercase tracking-wider mb-4">Evidencia Adjunta</h2>
               <div className="glass-content">
                  <PanelMultimedia archivos={hecho.archivosMultimedia} />
               </div>
            </div>

          </div>

          {/* --- COLUMNA DERECHA (Acciones Sticky) --- */}
          <div className="lg:col-span-4">
             <div className="sticky top-28 space-y-6">
                
                {/* TARJETA 4: ACCIONES (Limpia, sin colores raros) */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/50 dark:border-gray-600/50 rounded-2xl p-6 shadow-xl">
                   <h2 className="text-sm font-bold opacity-70 uppercase tracking-wider mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                      Acciones
                   </h2>
                   {/* El CSS inyectado limpiará los estilos de los botones hijos */}
                   <div className="glass-content space-y-3">
                      <PanelAcciones idHecho={hecho.id} />
                   </div>
                </div>

                {/* TARJETA 5: MAPA */}
                <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/30 dark:border-gray-700/30 rounded-2xl p-1 shadow-lg">
                   <div className="relative h-64 w-full rounded-xl overflow-hidden">
                      <div className="glass-content h-full w-full">
                         <PanelUbicacion latitud={safeLat} longitud={safeLng} />
                      </div>
                   </div>
                   <div className="py-3 text-center">
                      <p className="text-xs font-mono opacity-60">
                         {formatCoord(hecho.latitud)}, {formatCoord(hecho.longitud)}
                      </p>
                   </div>
                </div>

                {/* TARJETA 6: META INFO */}
                <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl p-4">
                   <div className="glass-content text-xs opacity-70">
                      <PanelInformacion hecho={hecho} />
                   </div>
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HechoDetalle;