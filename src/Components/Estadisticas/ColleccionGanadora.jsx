import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const ColeccionGanadora = ({ data }) => {
  // 1. Ordenamos los datos por cantidad de hechos (Mayor a menor)
  // Esto es clave para que el "Top 5" y el selector tengan sentido.
  const datosOrdenados = [...data].sort((a, b) => b.cantidadHechos - a.cantidadHechos);

  // 2. Estado para la colección seleccionada (Por defecto, la primera/más grave)
  const [seleccionada, setSeleccionada] = useState(datosOrdenados[0] || null);

  // Actualizar si cambia la data (ej: filtro de fechas)
  useEffect(() => {
    if (datosOrdenados.length > 0) {
      setSeleccionada(datosOrdenados[0]);
    }
  }, [data]);

  if (!seleccionada) return <div className="p-4 text-gray-500">No hay datos disponibles.</div>;

  // Datos para el mini gráfico de Top 5
  const top5Data = datosOrdenados.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      
      {/* COLUMNA 1: Contexto (Top 5) */}
      <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 pb-6 lg:pb-0 lg:pr-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Colecciones Más Reportadas</h2>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Top 5 colecciones con más hechos
        </h3>
        <div className="space-y-3">
          {top5Data.map((item, index) => (
            <button
              key={index}
              onClick={() => setSeleccionada(item)}
              className={`w-full flex justify-between items-center p-2 rounded-lg transition-colors text-sm ${
                seleccionada.coleccionTitulo === item.coleccionTitulo
                  ? "bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <span className="font-medium text-gray-700 dark:text-gray-200 truncate pr-2">
                {index + 1}. {item.coleccionTitulo}
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {item.cantidadHechos}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* COLUMNA 2 y 3: La Tarjeta de Detalle (Tu Diseño) */}
      <div className="lg:col-span-2 flex flex-col items-center justify-center text-center">
        
        {/* Selector (Dropdown) */}
        <div className="w-full max-w-md mb-8">
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 text-left">
            Explorar otra colección:
          </label>
          <select
            value={seleccionada.coleccionTitulo}
            onChange={(e) => {
              const item = datosOrdenados.find(d => d.coleccionTitulo === e.target.value);
              setSeleccionada(item);
            }}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-lg font-medium text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {datosOrdenados.map((item) => (
              <option key={item.coleccionTitulo} value={item.coleccionTitulo}>
                {item.coleccionTitulo} ({item.cantidadHechos} hechos)
              </option>
            ))}
          </select>
        </div>

        {/* La Tarjeta Visual */}
        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-600 w-full max-w-lg shadow-sm">
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 uppercase tracking-tight">
            {seleccionada.coleccionTitulo}
          </h2>

          <div className="flex items-center justify-center gap-8">
            {/* Lado Izquierdo: Provincia */}
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-gray-400 dark:text-gray-400 uppercase mb-1">
                Provincia más afectada
              </span>
              <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {seleccionada.provincia}
              </div>
            </div>

            {/* Separador vertical */}
            <div className="w-px h-16 bg-gray-300 dark:bg-gray-600"></div>

            {/* Lado Derecho: Cantidad */}
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold text-gray-400 dark:text-gray-400 uppercase mb-1">
                Total Reportes
              </span>
              <div className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                {seleccionada.cantidadHechos}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ColeccionGanadora;