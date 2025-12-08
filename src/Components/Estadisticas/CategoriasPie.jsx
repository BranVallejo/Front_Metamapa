import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CategoriasPie = ({ data, onExport }) => {
  const COLORES = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#a4de6c"];

  // 1. Calculamos ganadora, total y DATA AGRUPADA (Top 4 + Otros)
  const { ganadora, total, dataGrafico } = useMemo(() => {
    if (!data || data.length === 0) return { ganadora: null, total: 0, dataGrafico: [] };

    // Ordenamos de mayor a menor
    const dataOrdenada = [...data].sort((a, b) => b.cantidadHechos - a.cantidadHechos);
    
    const totalCalculado = dataOrdenada.reduce((acc, curr) => acc + curr.cantidadHechos, 0);
    const ganadoraCalculada = dataOrdenada[0];

    // Lógica para agrupar "Otros" si hay muchas categorías
    let dataFinal = dataOrdenada;
    if (dataOrdenada.length > 5) {
      const top4 = dataOrdenada.slice(0, 4);
      const otros = dataOrdenada.slice(4).reduce((acc, curr) => acc + curr.cantidadHechos, 0);
      dataFinal = [...top4, { categoriaNombre: "Otros", cantidadHechos: otros }];
    }

    return { ganadora: ganadoraCalculada, total: totalCalculado, dataGrafico: dataFinal };
  }, [data]);

  if (!ganadora) return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 h-full flex items-center justify-center">
      <p className="text-gray-500">No hay datos de categorías.</p>
    </div>
  );

  const porcentajeGanadora = ((ganadora.cantidadHechos / total) * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      
      {/* Encabezado */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white max-w-[70%]">
          Categoría Más Reportada
        </h2>
        <button onClick={onExport} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          Exportar CSV
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        
        {/* PARTE 1: El Dato Destacado */}
        <div className="md:w-1/3 text-center md:text-left">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Categoría N°1
          </p>
          <div className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
            {ganadora.categoriaNombre}
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-lg">
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {ganadora.cantidadHechos} hechos
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 dark:text-gray-300">
              {porcentajeGanadora}% del total
            </span>
          </div>
          <p className="mt-4 text-xs text-gray-400 leading-relaxed">
            Esta categoría representa la mayor incidencia en el periodo seleccionado.
          </p>
        </div>

        {/* PARTE 2: El Gráfico de Contexto */}
        <div className="h-64 w-full md:w-2/3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataGrafico} // Usamos la data agrupada
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="cantidadHechos"
                nameKey="categoriaNombre"
              >
                {dataGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                ))}
              </Pie>
              
              {/* Tooltip con estilos forzados para legibilidad */}
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1f2937", // Fondo oscuro
                  borderColor: "#374151",     // Borde gris oscuro
                  borderRadius: "8px", 
                  color: "#f3f4f6"            // Texto blanco/claro
                }}
                itemStyle={{ color: "#f3f4f6" }} // Asegura que el texto del item sea claro
                formatter={(value) => [`${value} hechos`, 'Cantidad']}
              />
              
              <Legend 
                verticalAlign="middle" 
                align="right" 
                layout="vertical"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default CategoriasPie;