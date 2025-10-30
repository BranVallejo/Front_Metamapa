import React from 'react';
import { Link } from 'react-router-dom';

// Recibimos 'hecho' como una "prop" desde el componente padre
const HechoRow = ({ hecho }) => {

  // Lógica de estado:
  // Si el estado es 'No visible', mostramos el badge gris.
  // Para cualquier OTRA COSA ('Subido', 'Pendiente', null, etc.), mostramos el verde.
  const esVisible = hecho.estado !== 'No visible';

  return (
    // La 'key' se pondrá en el componente padre (en el .map)
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {hecho.titulo}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {hecho.categoria}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {esVisible ? (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            Visible
          </span>
        ) : (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100">
            No visible
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link
          to={`/hechos/${hecho.id}`}
          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
        >
          Ver detalle
        </Link>
      </td>
    </tr>
  );
};

export default HechoRow;