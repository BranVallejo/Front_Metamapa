import React, { useState, useMemo, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Area, ComposedChart 
} from 'recharts';

const HorariosLine = ({ data, onExport }) => {
  
  // 1. Extraemos las categorías únicas disponibles en la data
  const categoriasDisponibles = useMemo(() => {
    if (!data) return [];
    // Creamos un Set para eliminar duplicados y lo convertimos a array
    const unicas = [...new Set(data.map(item => item.categoriaNombre))];
    return unicas.sort(); // Orden alfabético
  }, [data]);

  // 2. Estado para la categoría seleccionada
  const [seleccionada, setSeleccionada] = useState("");

  // Seleccionar la primera categoría por defecto cuando carga la data
  useEffect(() => {
    if (categoriasDisponibles.length > 0 && !seleccionada) {
      setSeleccionada(categoriasDisponibles[0]);
    }
  }, [categoriasDisponibles]);

  // 3. Procesamos la data para el gráfico (Rellenar huecos de 0 a 23hs)
  const chartData = useMemo(() => {
    if (!seleccionada || !data) return [];

    // Filtramos solo los datos de la categoría elegida
    const datosRaw = data.filter(d => d.categoriaNombre === seleccionada);

    // Creamos un array base de 0 a 23 horas con valor 0
    const dataCompleta = Array.from({ length: 24 }, (_, i) => ({
      hora: i,
      cantidadHechos: 0
    }));

    // Rellenamos con la data real que tenemos
    datosRaw.forEach(dato => {
      if (dato.hora >= 0 && dato.hora <= 23) {
        dataCompleta[dato.hora].cantidadHechos = dato.cantidadHechos;
      }
    });

    return dataCompleta;
  }, [data, seleccionada]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 lg:col-span-2">
      
      {/* Encabezado y Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Frecuencia Horaria
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Distribución de incidentes a lo largo del día (0 - 24hs)
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Selector de Categoría */}
          <select
            value={seleccionada}
            onChange={(e) => setSeleccionada(e.target.value)}
            className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-48"
          >
            {categoriasDisponibles.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button 
            onClick={onExport} 
            className="text-sm text-blue-600 hover:underline dark:text-blue-400 whitespace-nowrap"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {/* Usamos ComposedChart para poder poner un Area sombreada abajo de la linea si queremos */}
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHechos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
            <XAxis 
              dataKey="hora" 
              stroke="#888888" 
              tick={{fontSize: 12}}
              tickFormatter={(hora) => `${hora}:00`} 
              interval={3} // Muestra una etiqueta cada 3 horas para no saturar
            />
            <YAxis 
              stroke="#888888" 
              tick={{fontSize: 12}}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
              labelFormatter={(hora) => `${hora}:00 hs`}
              formatter={(value) => [value, "Hechos"]}
            />
            
            {/* Área sombreada bajo la línea */}
            <Area 
              type="monotone" 
              dataKey="cantidadHechos" 
              stroke="none" 
              fillOpacity={1} 
              fill="url(#colorHechos)" 
            />
            
            {/* La línea principal */}
            <Line 
              type="monotone" // "monotone" hace la curva suave
              dataKey="cantidadHechos" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }} // Puntos pequeños
              activeDot={{ r: 7, strokeWidth: 0 }} // Punto grande al pasar mouse
              name="Cantidad"
              animationDuration={1500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HorariosLine;