import React, { useState, useEffect, useCallback } from "react";

// Componentes visuales
// Eliminamos FiltrosFecha porque no se usará
import ColeccionGanadora from "../Components/Estadisticas/ColleccionGanadora";
import CategoriaDestacada from "../Components/Estadisticas/CategoriaDestacada";
import HorariosLine from "../Components/Estadisticas/HorariosLine";
import SpamCard from "../Components/Estadisticas/SpamCard";
import ProvinciaPorCategoria from "../Components/Estadisticas/ProvinciaPorCategoria";
import FondoChill from "../Components/FondoDinamico/FondoChill";

const Estadisticas = () => {
  // --- 1. CONFIGURACIÓN Y ESTADOS ---

  const API_URL = import.meta.env.VITE_URL_INICIAL_ESTADISTICAS;
  const [loading, setLoading] = useState(false);

  // Estados de Datos
  const [rankingProvincias, setRankingProvincias] = useState([]);
  const [categoriasReportadas, setCategoriasReportadas] = useState([]);
  const [horasCategoria, setHorasCategoria] = useState([]);
  const [spamData, setSpamData] = useState([]);
  const [provinciaPorCategoria, setProvinciaPorCategoria] = useState([]);

  // --- 2. FUNCIÓN DE CARGA DE DATOS (GRÁFICOS) ---
  const cargarEstadisticas = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token"); 

    const authFetch = (url) => fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    try {
      // Los endpoints JSON no piden fecha, traen todo el histórico por defecto
      const [resRanking, resCategorias, resHoras, resSpam, resProvCat] =
        await Promise.all([
          authFetch(`${API_URL}/mayor-hechos-provincia-coleccion`),
          authFetch(`${API_URL}/categoria-mas-reportada`),
          authFetch(`${API_URL}/hora-por-categoria`),
          authFetch(`${API_URL}/cantidad-solicitudes-spam`),
          authFetch(`${API_URL}/provincia-por-categoria`),
        ]);

      const dataRanking = resRanking.status === 204 ? [] : await resRanking.json();
      const dataCategorias = resCategorias.status === 204 ? [] : await resCategorias.json();
      const dataHoras = resHoras.status === 204 ? [] : await resHoras.json();
      const dataSpam = resSpam.status === 204 ? [] : await resSpam.json();
      const dataProvCat = resProvCat.status === 204 ? [] : await resProvCat.json();

      setRankingProvincias(dataRanking);
      setCategoriasReportadas(dataCategorias);
      setHorasCategoria(dataHoras);
      setSpamData(dataSpam);
      setProvinciaPorCategoria(dataProvCat);
    } catch (error) {
      console.error("❌ Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // --- 3. USE EFFECT ---
  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  // --- 4. EXPORTAR CSV (HISTORIAL COMPLETO) ---
  const descargarCSV = async (endpointName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No estás autenticado para descargar este archivo.");
        return;
      }

      // Definimos fechas "infinitas" para cumplir con el requisito del Backend de Java
      // pero trayendo TODOS los datos reales.
      const fechaInicioHistoria = "2000-01-01"; 
      const fechaFinHistoria = "2100-12-31"; 

      const url = `${API_URL}/${endpointName}/csv?desde=${fechaInicioHistoria}&hasta=${fechaFinHistoria}`;

      console.log("⬇️ Descargando historial completo:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo generar el CSV`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${endpointName}_COMPLETO.csv`;
      
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error("Error descargando CSV:", error);
      alert("Error al descargar el archivo.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-300">
      <FondoChill />

      <div className="relative z-10 p-6 md:p-10">
        {/* Header simplificado sin filtros */}
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white drop-shadow-sm">
              Dashboard de Estadísticas
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Análisis histórico completo de hechos y reportes.
            </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* FILA 1: Colecciones */}
            <div className="lg:col-span-2">
              <ColeccionGanadora 
                 data={rankingProvincias} 
                 onExport={() => descargarCSV("mayor-hechos-provincia-coleccion")} 
              />
            </div>

            {/* FILA 2: KPIs */}
            <div className="lg:col-span-1 h-full">
              <CategoriaDestacada
                data={categoriasReportadas}
                onExport={() => descargarCSV("categoria-mas-reportada")}
              />
            </div>

            <div className="lg:col-span-1 h-full">
              <SpamCard
                data={spamData}
                onExport={() => descargarCSV("cantidad-solicitudes-spam")}
              />
            </div>

            {/* FILA 3: Provincias */}
            <div className="lg:col-span-2">
              <ProvinciaPorCategoria
                data={provinciaPorCategoria}
                onExport={() => descargarCSV("provincia-por-categoria")}
              />
            </div>

            {/* FILA 4: Horarios */}
            <div className="lg:col-span-2">
              <HorariosLine
                data={horasCategoria}
                onExport={() => descargarCSV("hora-por-categoria")}
              />
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Estadisticas;