import React, { useState, useEffect } from "react";

// Importamos los mocks (recuerda que luego los cambiarás por fetch)
import {
  mockRankingProvincias,
  mockCategoriaMasReportada,
  mockHoraPorCategoria,
  mockSpam,
  mockProvinciaPorCategoria
} from "../data/mockEstadisticas";



// Importamos los componentes nuevos
import FiltrosFecha from "../Components/Estadisticas/FiltrosFecha";
import RankingProvincias from "../Components/Estadisticas/RankingProvincias";
import CategoriasPie from "../Components/Estadisticas/CategoriasPie";
import HorariosLine from "../Components/Estadisticas/HorariosLine";
import SpamCard from "../Components/Estadisticas/SpamCard";
import ColeccionGanadora from "../Components/Estadisticas/ColleccionGanadora";
import ProvinciaPorCategoria from "../Components/Estadisticas/ProvinciaPorCategoria";


const Estadisticas = () => {
  // --- LÓGICA DE FECHAS POR DEFECTO ---
  // Calculamos "Hoy" y "Hace un mes" para iniciar los estados
  const hoy = new Date();
  const haceUnMes = new Date();
  haceUnMes.setMonth(hoy.getMonth() - 1);

  // Formato YYYY-MM-DD para los inputs
  const [fechaDesde, setFechaDesde] = useState(haceUnMes.toISOString().split('T')[0]);
  const [fechaHasta, setFechaHasta] = useState(hoy.toISOString().split('T')[0]);

  // Estados de datos
  const [rankingProvincias, setRankingProvincias] = useState(mockRankingProvincias);
  const [categoriasReportadas, setCategoriasReportadas] = useState(mockCategoriaMasReportada);
  const [horasCategoria, setHorasCategoria] = useState(mockHoraPorCategoria);
  const [spamData, setSpamData] = useState(mockSpam);
  const [provinciaPorCategoria, setProvinciaPorCategoria] = useState(mockProvinciaPorCategoria);

  // Función para simular el filtrado (aquí irían tus fetchs reales)
  const handleFiltrar = () => {
    console.log(`Filtrando datos desde ${fechaDesde} hasta ${fechaHasta}...`);
    // fetch(`${API_URL}/...?desde=${fechaDesde}&hasta=${fechaHasta}`) ...
    alert(`Actualizando gráficos para: ${fechaDesde} al ${fechaHasta}`);
  };

  // Función genérica para exportar
  const descargarCSV = (endpointName) => {
    alert(`Descargando CSV de: ${endpointName} (${fechaDesde} - ${fechaHasta})`);
  };

  // Función para convertir "2025-11-05" a "05/11/2025" sin líos de zona horaria
  const formatearFechaString = (fechaString) => {
    if (!fechaString) return "-";
    const [anio, mes, dia] = fechaString.split('-');
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-10 transition-colors duration-300">

      {/* --- HEADER Y FILTROS --- */}
      <header className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard de Estadísticas
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Análisis de hechos y reportes del sistema.
          </p>
          {/* Feedback visual del periodo */}
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">
            Viendo datos del <span className="font-bold">{formatearFechaString(fechaDesde)}</span> al <span className="font-bold">{formatearFechaString(fechaHasta)}</span>
          </p>
        </div>

        {/* Componente de Filtros Modularizado */}
        <FiltrosFecha
          desde={fechaDesde}
          hasta={fechaHasta}
          setDesde={setFechaDesde}
          setHasta={setFechaHasta}
          onFiltrar={handleFiltrar}
        />
      </header>

      {/* --- GRID DE GRÁFICOS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="lg:col-span-2"> {/* Hacemos que ocupe todo el ancho para que se luzca */}
          <ColeccionGanadora
            data={rankingProvincias}
          />
        </div>

        <CategoriasPie
          data={categoriasReportadas}
          onExport={() => descargarCSV("categoria-mas-reportada")}
        />

        {/* Focos por Categoría (Grilla) */}
        <div className="lg:col-span-2">
          <ProvinciaPorCategoria
            data={provinciaPorCategoria}
            onExport={() => descargarCSV("provincia-por-categoria")}
          />
        </div>
        
        <HorariosLine
          data={horasCategoria}
          onExport={() => descargarCSV("hora-por-categoria")}
        />

        <SpamCard
          data={spamData}
          onExport={() => descargarCSV("cantidad-solicitudes-spam")}
        />

      </div>
    </div>
  );
};

export default Estadisticas;