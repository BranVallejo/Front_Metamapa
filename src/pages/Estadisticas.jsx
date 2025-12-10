import React, { useState, useEffect, useCallback } from "react";

// Componentes visuales
import FiltrosFecha from "../Components/Estadisticas/FiltrosFecha";
import RankingProvincias from "../Components/Estadisticas/RankingProvincias"; // (Si usas el viejo)
import ColeccionGanadora from "../Components/Estadisticas/ColleccionGanadora"; // (El nuevo)
import CategoriaDestacada from "../Components/Estadisticas/CategoriaDestacada";
import HorariosLine from "../Components/Estadisticas/HorariosLine";
import SpamCard from "../Components/Estadisticas/SpamCard";
import ProvinciaPorCategoria from "../Components/Estadisticas/ProvinciaPorCategoria";
import FondoChill from "../components/FondoDinamico/FondoChill";

const Estadisticas = () => {
  // --- 1. CONFIGURACIÓN Y ESTADOS ---

  // URL Base del Backend (Asegurate que en tu .env se llame así o cambialo acá)
  const API_URL = import.meta.env.VITE_URL_INICIAL_ESTADISTICAS;

  // Fechas por defecto (Último mes)
  const hoy = new Date();
  const haceUnMes = new Date();
  haceUnMes.setMonth(hoy.getMonth() - 1);

  const [fechaDesde, setFechaDesde] = useState(
    haceUnMes.toISOString().split("T")[0]
  );
  const [fechaHasta, setFechaHasta] = useState(hoy.toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  // Estados de Datos (Inicializados vacíos, NO con mocks)
  const [rankingProvincias, setRankingProvincias] = useState([]);
  const [categoriasReportadas, setCategoriasReportadas] = useState([]);
  const [horasCategoria, setHorasCategoria] = useState([]);
  const [spamData, setSpamData] = useState([]);
  const [provinciaPorCategoria, setProvinciaPorCategoria] = useState([]);

  // --- 2. FUNCIÓN DE CARGA DE DATOS  ---

  const cargarEstadisticas = useCallback(async () => {
    setLoading(true);

    try {
      // Hacemos todas las peticiones en paralelo con Promise.all para que sea rápido
      const [resRanking, resCategorias, resHoras, resSpam, resProvCat] =
        await Promise.all([
          fetch(`${API_URL}/mayor-hechos-provincia-coleccion`),
          fetch(`${API_URL}/categoria-mas-reportada`),
          fetch(`${API_URL}/hora-por-categoria`),
          fetch(`${API_URL}/cantidad-solicitudes-spam`),
          fetch(`${API_URL}/provincia-por-categoria`),
        ]);

      // Procesamos las respuestas
      // Nota: Si el backend devuelve 204 No Content, asignamos array vacío
      const dataRanking =
        resRanking.status === 204 ? [] : await resRanking.json();
      const dataCategorias =
        resCategorias.status === 204 ? [] : await resCategorias.json();
      const dataHoras = resHoras.status === 204 ? [] : await resHoras.json();
      const dataSpam = resSpam.status === 204 ? [] : await resSpam.json();
      const dataProvCat =
        resProvCat.status === 204 ? [] : await resProvCat.json();

      // Guardamos en el estado
      setRankingProvincias(dataRanking);
      setCategoriasReportadas(dataCategorias);
      setHorasCategoria(dataHoras);
      setSpamData(dataSpam);
      setProvinciaPorCategoria(dataProvCat);
    } catch (error) {
      console.error("❌ Error cargando estadísticas:", error);
      alert("Hubo un error al conectar con el servidor de estadísticas.");
    } finally {
      setLoading(false);
    }
  }, [fechaDesde, fechaHasta, API_URL]);

  // --- 3. USE EFFECT: Carga inicial y ante cambios ---

  // Se ejecuta al montar el componente (automáticamente carga el último mes)
  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]); // Se ejecutará si cambia la función (que depende de las fechas)

  // Manejador del botón "Filtrar" (por si el usuario quiere forzar la recarga)
  const handleFiltrar = () => {
    cargarEstadisticas();
  };

  // --- 4. EXPORTAR CSV REAL ---
  const descargarCSV = (endpointName) => {
    // Redirigimos al navegador a la URL del CSV. El backend maneja la descarga.
    const url = `${API_URL}/estadisticas/${endpointName}/csv?desde=${fechaDesde}&hasta=${fechaHasta}`;
    window.location.href = url;
  };

  // Helper visual para fechas
  const formatearFechaString = (fechaString) => {
    if (!fechaString) return "-";
    const [anio, mes, dia] = fechaString.split("-");
    return `${dia}/${mes}/${anio}`;
  };

return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-300">
      {/* Fondo Animado */}
      <FondoChill />

      {/* Contenido */}
      <div className="relative z-10 p-6 md:p-10">
        {/* Header */}
        <header className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white drop-shadow-sm">
              Dashboard de Estadísticas
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Análisis de hechos y reportes del sistema.
            </p>
          </div>
        </header>

        {/* Loading Spinner o Gráficos */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* FILA 1: Colecciones (Ancho completo) */}
            <div className="lg:col-span-2">
              <ColeccionGanadora data={rankingProvincias} />
            </div>

            {/* FILA 2: KPIs (Mitad y Mitad) */}
            {/* Categoria Destacada */}
            <div className="lg:col-span-1 h-full">
              <CategoriaDestacada
                data={categoriasReportadas}
                onExport={() => descargarCSV("categoria-mas-reportada")}
              />
            </div>

            {/* Spam Card (Ahora ocupa el hueco vacío) */}
            <div className="lg:col-span-1 h-full">
              <SpamCard
                data={spamData}
                onExport={() => descargarCSV("cantidad-solicitudes-spam")}
              />
            </div>

            {/* FILA 3: Provincias por Categoría (Ancho completo) */}
            <div className="lg:col-span-2">
              <ProvinciaPorCategoria
                data={provinciaPorCategoria}
                onExport={() => descargarCSV("provincia-por-categoria")}
              />
            </div>

            {/* FILA 4: Horarios (Ancho completo) */}
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
