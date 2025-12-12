import React from 'react';
import { formatearFecha } from '../../utils/formatDate';

const PanelInformacion = ({ hecho }) => {
  return (
    <div className="w-full">
      <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-3">
        Metadatos
      </h3>
      <dl className="space-y-3 text-xs">
        <div className="flex justify-between border-b border-gray-200/20 dark:border-white/5 pb-1">
          <dt className="text-gray-500 dark:text-gray-400">Fecha Reg.</dt>
          <dd className="font-mono text-gray-700 dark:text-gray-300 text-right">
            {formatearFecha(hecho.fechaAcontecimiento)}
          </dd>
        </div>
        <div className="flex justify-between border-b border-gray-200/20 dark:border-white/5 pb-1">
          <dt className="text-gray-500 dark:text-gray-400">Autor</dt>
          <dd className="font-medium text-gray-700 dark:text-gray-300 text-right">
            {hecho.nombre_contribuyente} {hecho.apellido_contribuyente?.charAt(0)}.
          </dd>
        </div>
        <div className="flex justify-between pt-1">
          <dt className="text-gray-500 dark:text-gray-400">ID Sistema</dt>
          <dd className="font-mono text-gray-500 dark:text-gray-500">
            #{hecho.id}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default PanelInformacion;