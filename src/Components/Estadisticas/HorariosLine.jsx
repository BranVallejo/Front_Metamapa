import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HorariosLine = ({ data, onExport }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Frecuencia Horaria (Categoría: Robo)</h2>
        <button onClick={onExport} className="text-sm text-blue-600 hover:underline dark:text-blue-400">Exportar CSV</button>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="hora" stroke="#888888" tickFormatter={(hora) => `${hora}:00`} />
            <YAxis stroke="#888888" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }} labelFormatter={(hora) => `Hora: ${hora}:00`} />
            <Legend />
            <Line type="monotone" dataKey="cantidadHechos" stroke="#ef4444" strokeWidth={3} activeDot={{ r: 8 }} name="Cantidad de Hechos" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default HorariosLine;