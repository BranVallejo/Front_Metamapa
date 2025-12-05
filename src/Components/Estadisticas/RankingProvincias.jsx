import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LabelList 
} from 'recharts';

const RankingProvincias = ({ data, onExport }) => {
  
  // Custom Tooltip para que se lea claro al pasar el mouse
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const datos = payload[0].payload;
      return (
        <div className="bg-gray-800 text-white p-3 rounded shadow-lg border border-gray-700 text-sm">
          <p className="font-bold mb-1">{datos.coleccionTitulo}</p>
          <p>Provincia más afectada: <span className="text-yellow-400 font-semibold">{datos.provincia}</span></p>
          <p>Cantidad: {datos.cantidadHechos}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Provincias con más hechos en cada colección
          </h2>
        </div>
        <button onClick={onExport} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          Exportar CSV
        </button>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical" // Barras horizontales para leer mejor los nombres
            margin={{ left: 20, right: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={false} />
            
            {/* Eje X: Cantidad numérica */}
            <XAxis type="number" stroke="#888888" hide />
            
            {/* Eje Y: Nombres de las Colecciones */}
            <YAxis 
              dataKey="coleccionTitulo" 
              type="category" 
              width={100} 
              stroke="#888888" 
              fontSize={12}
              tick={{ fill: '#9CA3AF' }} // Color gris para texto
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
            
            <Bar 
              dataKey="cantidadHechos" 
              fill="#3b82f6" 
              radius={[0, 4, 4, 0]} 
              barSize={30}
            >
              {/* Esto escribe el nombre de la PROVINCIA dentro de la barra */}
              <LabelList 
                dataKey="provincia" 
                position="insideLeft" 
                fill="white" 
                fontSize={12} 
                fontWeight="bold"
              />
              {/* Esto escribe la CANTIDAD a la derecha de la barra */}
              <LabelList 
                dataKey="cantidadHechos" 
                position="right" 
                fill="#888888" 
                fontSize={12} 
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RankingProvincias;