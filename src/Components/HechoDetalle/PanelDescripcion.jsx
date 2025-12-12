import React from 'react';

const PanelDescripcion = ({ descripcion }) => {
  return (
    <div className="w-full">
      {/* El título ya lo pone el padre si quiere, o lo dejamos sutil aquí */}
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-lg font-light">
        {descripcion}
      </p>
    </div>
  );
};

export default PanelDescripcion;