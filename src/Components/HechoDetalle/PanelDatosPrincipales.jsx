// src/Components/HechoDetalle/PanelDatosPrincipales.jsx
import React from 'react';
import { formatearFecha } from '../../utils/formatDate';

const PanelDatosPrincipales = ({ hecho }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Datos Principales</h3>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
        <div className="text-sm">
          <dt className="font-medium text-gray-500 dark:text-gray-400">Título</dt>
          <dd className="text-gray-900 dark:text-white">{hecho.titulo}</dd>
        </div>
        <div className="text-sm">
          <dt className="font-medium text-gray-500 dark:text-gray-400">Categoría</dt>
          <dd className="text-gray-900 dark:text-white">{hecho.categoria}</dd>
        </div>
        <div className="text-sm">
          <dt className="font-medium text-gray-500 dark:text-gray-400">Fecha del Acontecimiento</dt>
          <dd className="text-gray-900 dark:text-white">{formatearFecha(hecho.fechaAcontecimiento)}</dd>
        </div>
        <div className="text-sm">
          <dt className="font-medium text-gray-500 dark:text-gray-400">Etiqueta</dt>
          <dd className="text-gray-900 dark:text-white">{hecho.etiqueta || "Sin etiqueta"}</dd>
        </div>
      </dl>
    </div>
  );
};

export default PanelDatosPrincipales;