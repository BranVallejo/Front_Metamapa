import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CategoriasPie = ({ data, onExport }) => {
  const COLORES = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Categorías Más Reportadas</h2>
        <button onClick={onExport} className="text-sm text-blue-600 hover:underline dark:text-blue-400">Exportar CSV</button>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="cantidadHechos"
              nameKey="categoriaNombre"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default CategoriasPie;