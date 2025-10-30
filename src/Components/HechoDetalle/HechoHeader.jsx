// src/Components/HechoDetalle/HechoHeader.jsx
import React from 'react';

const HechoHeader = ({ titulo, categoria }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{titulo}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">{categoria}</p>
      </div>
    </div>
  );
};

export default HechoHeader;