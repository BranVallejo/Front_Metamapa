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
      const cargarDetalle = async () => {
         setLoading(true);
         try {
            // Asumimos que el backend filtra por 'idBuscado' o 'id'
            const url = `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica/hechos?idBuscado=${id}`;
            const res = await fetch(url, { method: "GET" });

            // Manejo de 204 (No encontrado / Sin contenido)
            if (res.status === 204) {
               throw new Error("El hecho buscado no existe o no está disponible.");
            }

            if (!res.ok) {
               throw new Error(`Error del servidor (${res.status})`);
            }

            // Lectura directa del Array
            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
               setHecho(data[0]); // Tomamos el primero (y único) de la lista
            } else {
               throw new Error("Hecho no encontrado en la respuesta.");
            }

         } catch (err) {
            console.error(err);
            setError(err.message);
            toast.error("Error al cargar detalle", { description: err.message });
         } finally {
            setLoading(false);
         }
      };

      if (id) cargarDetalle();
   }, [id]);

   // Helper para evitar error de toFixed en coordenadas nulas
   const formatCoord = (val) => {
      const num = Number(val);
      return !isNaN(num) ? num.toFixed(4) : "N/A";
   };
   
   // Conversión segura de coordenadas
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
               <p className="text-gray-300 mb-6">{error || "El hecho solicitado no existe."}</p>
               <Link to="/misHechos" className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors">
                  Volver al listado
               </Link>
            </div>
         </div>
      );
   }

   // --- RENDERIZADO PRINCIPAL (Clean Glass) ---
   return (
      <div className="min-h-screen relative text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300">

         <FondoChill />
         <Toaster richColors position="top-right" />

         {/* CSS INJECTION: ESTILOS GLASS UNIFICADOS */}
         <style>{`
        .glass-content > div, 
        .glass-content > div > div {
            background-color: transparent !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
        }
        
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
                  <div className="glass-content">
                     <HechoHeader titulo={hecho.titulo} categoria={hecho.categoria} />
                  </div>
               </div>
            </div>

            {/* GRID PRINCIPAL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

               {/* --- COLUMNA IZQUIERDA (Info) --- */}
               <div className="lg:col-span-8 space-y-6">

                  {/* 🔥 TARJETA DE SUGERENCIA DEL ADMIN (NUEVA) 🔥 */}
                  {hecho.sugerencia_cambio && (
                     <div className="bg-amber-50 dark:bg-amber-900/20 backdrop-blur-xl border border-amber-200 dark:border-amber-700/50 rounded-2xl p-6 shadow-sm animate-pulse-slow">
                        <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                           </svg>
                           Sugerencia del Administrador
                        </h3>
                        <p className="text-gray-700 dark:text-gray-200 italic font-medium">
                           "{hecho.sugerencia_cambio}"
                        </p>
                     </div>
                  )}

                  {/* TARJETA 1: DESCRIPCIÓN */}
                  <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl p-8 shadow-sm">
                     <h2 className="text-lg font-bold mb-4 opacity-90">Descripción del Evento</h2>
                     <div className="glass-content text-lg leading-relaxed opacity-90">
                        <PanelDescripcion descripcion={hecho.descripcion} />
                     </div>
                  </div>

                  {/* TARJETA 2: DATOS TÉCNICOS */}
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

                     {/* TARJETA 4: ACCIONES */}
                     <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/50 dark:border-gray-600/50 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-sm font-bold opacity-70 uppercase tracking-wider mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                           Acciones
                        </h2>
                        <div className="glass-content space-y-3">
                           <PanelAcciones
                              idHecho={hecho.id}
                              fechaCarga={hecho.fechaCarga}
                           />
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