// src/Components/HechoDetalle/PanelInfoReporte.jsx
import React from 'react';

const PanelInfoReporte = ({ nombre, apellido }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Información de Reporte</h3>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
        <div className="text-sm">
          <dt className="font-medium text-gray-500 dark:text-gray-400">Reportado Por</dt>
          <dd className="text-gray-900 dark:text-white">
            {nombre} {apellido}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default PanelInfoReporte;