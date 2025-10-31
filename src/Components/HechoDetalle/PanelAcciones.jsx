// src/Components/HechoDetalle/PanelAcciones.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // <-- 1. IMPORTÁ LINK

// 2. RECIBÍ 'idHecho' COMO PROP
const PanelAcciones = ({ idHecho }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Acciones</h3>
      <div className="flex flex-col space-y-2">

        {/* 3. REEMPLAZÁ EL <button> POR <Link> */}
        <Link
          to={`/hechos/editar/${idHecho}`} // <-- 4. USÁ EL ID PARA LA RUTA
          className="w-full text-left px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Editar Hecho
        </Link>
        
        {/* El resto de tus botones/links */}
        <button className="w-full text-left px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Ocultar Hecho
        </button>
        <Link 
          to="/mis-hechos"
          className="block w-full text-left px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300"
        >
          Ver Todos Mis Hechos
        </Link>
        <Link 
          to="/hechos/nuevo"
          className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reportar Nuevo Hecho
        </Link>
      </div>
    </div>
  );
};

export default PanelAcciones;