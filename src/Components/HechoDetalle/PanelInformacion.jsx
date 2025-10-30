// src/Components/HechoDetalle/PanelInformacion.jsx
import React from 'react';
import { formatearFecha } from '../../utils/formatDate';

const PanelInformacion = ({ hecho }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Información</h3>
      <dl className="text-sm space-y-2">
        <div>
          <dt className="font-medium text-gray-500 dark:text-gray-400">Fecha Acontecimiento</dt>
          <dd className="text-gray-900 dark:text-white">{formatearFecha(hecho.fechaAcontecimiento)}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500 dark:text-gray-400">Reportado por</dt>
          <dd className="text-gray-900 dark:text-white">
            {hecho.nombre_contribuyente} {hecho.apellido_contribuyente}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default PanelInformacion;