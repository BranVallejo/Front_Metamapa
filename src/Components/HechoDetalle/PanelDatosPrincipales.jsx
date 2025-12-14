import React from 'react';
import { formatearFecha } from '../../utils/formatDate';

const PanelDatosPrincipales = ({ hecho }) => {
  return (
    <div className="w-full">
      <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4 border-b border-gray-200/50 dark:border-white/10 pb-2">
        Detalles Técnicos
      </h3>
      <dl className="grid grid-cols-1 gap-y-4">
        
        {/* FECHA DEL ACONTECIMIENTO */}
        <div>
          <dt className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Fecha del Hecho</dt>
          <dd className="text-base font-medium text-gray-800 dark:text-gray-200">
            {formatearFecha(hecho.fechaAcontecimiento)}
          </dd>
        </div>

        {/* FECHA DE CARGA (Corregido para igualar estilo) */}
        <div>
          <dt className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Fecha de Reporte</dt>
          <dd className="text-base font-medium text-gray-800 dark:text-gray-200">
             {hecho.fechaCarga ? formatearFecha(hecho.fechaCarga) : "Sin datos"}
          </dd>
        </div>

        {/* ETIQUETA */}
        <div>
          <dt className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Etiqueta</dt>
          <dd className="text-base font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {hecho.etiqueta || "General"}
          </dd>
        </div>

        {/* CATEGORÍA */}
        <div>
          <dt className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Categoría</dt>
          <dd className="text-base font-medium text-gray-800 dark:text-gray-200">
            {hecho.categoria}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default PanelDatosPrincipales;