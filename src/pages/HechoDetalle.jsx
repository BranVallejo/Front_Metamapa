// src/pages/HechoDetalle.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Importamos todos los nuevos componentes
import HechoHeader from '../Components/HechoDetalle/HechoHeader';
import PanelDatosPrincipales from '../Components/HechoDetalle/PanelDatosPrincipales';
import PanelUbicacion from '../Components/HechoDetalle/PanelUbicacion';
import PanelDescripcion from '../Components/HechoDetalle/PanelDescripcion';
import PanelMultimedia from '../Components/HechoDetalle/PanelMultimedia';
import PanelInfoReporte from '../Components/HechoDetalle/PanelInfoReporte';
import PanelAcciones from '../Components/HechoDetalle/PanelAcciones';
import PanelInformacion from '../Components/HechoDetalle/PanelInformacion';

const HechoDetalle = () => {
  const { id } = useParams();
  
  const [hecho, setHecho] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(
      `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica/hechos?idBuscado=${id}`,
      { method: "GET" }
    )
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.hechos && data.hechos.length > 0) {
        setHecho(data.hechos[0]);
      } else {
        throw new Error(`No se encontró ningún hecho con el ID: ${id}`);
      }
    })
    .catch(err => {
      console.error("Error al cargar detalle del hecho:", err);
      setError(err.message);
    })
    .finally(() => {
      setLoading(false);
    });

  }, [id]);

  
  // --- Estados de Carga y Error ---
  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center dark:text-white text-2xl">
        Cargando detalle del hecho...
      </div>
    );
  }

  if (error || !hecho) {
    return (
      <div className="container mx-auto p-8 text-center dark:text-white">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          {error ? 'Error al cargar' : 'Hecho no encontrado'}
        </h1>
        <p className="text-lg mb-6">{error}</p>
        <Link to="/misHechos" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
          Volver a la lista
        </Link>
      </div>
    );
  }

  // --- Renderizado Exitoso ---
  // Ahora solo ensamblamos los componentes y les pasamos los datos
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        
        <HechoHeader titulo={hecho.titulo} categoria={hecho.categoria} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda (Información) */}
          <div className="lg:col-span-2 space-y-6">
            <PanelDatosPrincipales hecho={hecho} />
            <PanelUbicacion latitud={hecho.latitud} longitud={hecho.longitud} />
            <PanelDescripcion descripcion={hecho.descripcion} />
            <PanelMultimedia archivos={hecho.archivosMultimedia} />
            <PanelInfoReporte nombre={hecho.nombre_contribuyente} apellido={hecho.apellido_contribuyente} />
          </div>
          
          {/* Columna Derecha (Acciones e Info) */}
          <div className="lg:col-span-1 space-y-6">
            <PanelAcciones />
            <PanelInformacion hecho={hecho} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HechoDetalle;