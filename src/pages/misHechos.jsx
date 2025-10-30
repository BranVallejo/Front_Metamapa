import React, { useState, useEffect } from 'react'; // <-- 1. IMPORTAMOS LOS HOOKS
import { Link } from 'react-router-dom';
// import { mockHechos } from '../data/mockHechos'; // Ya no lo usamos, pero lo podés dejar comentado

const MisHechos = () => {
  // 2. CREAMOS EL ESTADO para guardar los hechos (reemplaza a la constante)
  const [misHechos, setMisHechos] = useState([]);

  // 3. PEGADO COMPLETO DE TU LÓGICA FETCH
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));

    // (Asegurate de que userData y userData.userId existan antes de hacer el fetch)
    if (!userData || !userData.userId) {
      console.error("No se encontró ID de usuario en localStorage");
      // Podrías redirigir al login aquí
      return; 
    }

    fetch(
      `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica/hechos?idContribuyente=${userData.userId}`,
      {
        method: "GET",
        // No se necesita "Content-Type" para un GET
      })
      .then(response => {
        // ¡CLAVE! Verificamos si la respuesta fue un error (como 500 o 404)
        if (!response.ok) {
          // Si es un error, lanzamos una excepción para que la capture el .catch
          throw new Error(`Error del servidor: ${response.status}`);
        }
        return response.json(); // Si todo está OK, leemos el JSON
      })
      .then(data => {
        // ¡CLAVE! Accedemos a la propiedad "hechos" del objeto de respuesta
        if (data && data.hechos) {
          setMisHechos(data.hechos); // 4. Llenamos el estado con el ARRAY de hechos
        } else {
          // Si la respuesta no tiene 'hechos', seteamos un array vacío
          setMisHechos([]); 
        }
      })
      .catch(error => {
        console.error("Error al cargar hechos:", error);
        setMisHechos([]); // En caso de error, seteamos un array vacío para evitar el crash
      });

  }, []); // El array vacío `[]` asegura que esto se ejecute solo una vez.

  
  // --- TU CÓDIGO JSX (la "versión vieja") QUEDA IDÉNTICO AQUÍ ABAJO ---
  // Ahora .map() usará el estado 'misHechos' que se llena con el fetch.
  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      {/* --- Título y Botón Nuevo --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Mis Hechos
        </h1>
        <Link
          to="/hechos/nuevo"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
        >
          + Reportar Nuevo Hecho
        </Link>
      </div>

      {/* --- Panel de Resumen --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Mis Hechos</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {misHechos.length}
          </p>
        </div>
        {/* Aquí podrías agregar más paneles de resumen en el futuro */}
      </div>

      {/* --- Tabla de Hechos --- */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            {/* Encabezado de la tabla */}
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            
            {/* Cuerpo de la tabla */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {misHechos.map((hecho) => (
                <tr key={hecho.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {hecho.titulo}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {hecho.categoria}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {hecho.estado === 'Subido' ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        Subido
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MisHechos;