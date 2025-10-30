// src/Components/HechoDetalle/PanelDescripcion.jsx
import React from 'react';

const PanelDescripcion = ({ descripcion }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Descripción</h3>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{descripcion}</p>
    </div>
  );
};

export default PanelDescripcion;