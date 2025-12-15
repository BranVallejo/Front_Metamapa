import React from 'react';

// Constantes
const algoritmosConsenso = [
  { valor: "absoluto", label: "Absoluto" },
  { valor: "mayoriasimple", label: "Mayoría Simple" },
  { valor: "multiplesmenciones", label: "Múltiples Menciones" },
];

const fuentesDisponibles = [
  { valor: "DINAMICA", label: "Dinámica" },
  { valor: "ESTATICA", label: "Estática" },
  { valor: "DEMO", label: "Demo" },
  { valor: "METAMAPA", label: "MetaMapa" },
];

const categoriasDisponibles = [
  "vientos fuertes", "inundaciones", "granizo", "nevadas", "calor extremo", "sequia", "derrumbes", "actividad volcánica", "contaminación", "evento sanitario", "derrame", "intoxicacion masiva",
];

const ColeccionesForm = ({ formData, setFormData, modoEdicion, guardar, cancelar }) => {
  
  // Estilos
  // 🔥 AGREGADO: "dark:[&::-webkit-calendar-picker-indicator]:invert" al final para que los calendarios se vean blancos en dark mode
  const inputClass = "w-full px-4 py-2 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500/50 outline-none text-sm backdrop-blur-sm transition-all dark:[&::-webkit-calendar-picker-indicator]:invert";
  
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 opacity-80";
  
  // Handlers internos
  const handleChange = (e) => {
      const { name, value } = e.target;
      if (name.includes(".")) {
          const [parent, child] = name.split(".");
          setFormData(prev => ({
              ...prev,
              [parent]: { ...prev[parent], [child]: value }
          }));
      } else {
          setFormData(prev => ({ ...prev, [name]: value }));
      }
  };

  const handleArrayChange = (field, value) => {
      setFormData(prev => {
          const current = prev[field] || [];
          const updated = current.includes(value) 
              ? current.filter(item => item !== value)
              : [...current, value];
          return { ...prev, [field]: updated };
      });
  };

  const handleCriterioCatChange = (cat) => {
      setFormData(prev => {
          const current = prev.criterios.categoria;
          const updated = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
          return { ...prev, criterios: { ...prev.criterios, categoria: updated } };
      });
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-xl p-6 relative overflow-hidden">
      
      {/* Cinta de estado */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${modoEdicion ? 'bg-yellow-500' : 'bg-blue-500'}`} />

      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        {modoEdicion ? <span className="text-yellow-600 dark:text-yellow-400">✏️ Editando</span> : <span className="text-blue-600 dark:text-blue-400">✨ Nueva Colección</span>}
      </h2>

      <div className="space-y-5">
        
        {/* BÁSICOS */}
        <div className="space-y-3">
            <div>
                <label className={labelClass}>Título</label>
                <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} className={inputClass} placeholder="Nombre de la colección" />
            </div>
            <div>
                <label className={labelClass}>Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="2" className={inputClass} placeholder="Breve descripción..." />
            </div>
            <div>
                <label className={labelClass}>Algoritmo</label>
                <select name="algoritmoConsenso" value={formData.algoritmoConsenso} onChange={handleChange} className={inputClass}>
                    {algoritmosConsenso.map(opt => (
                        <option 
                            key={opt.valor} 
                            value={opt.valor}
                            // 🔥 FIX: Fondo sólido para las opciones
                            className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
                        >
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-white/10" />

        {/* FUENTES */}
        <div>
            <label className={labelClass + " mb-2 block"}>Fuentes de Datos</label>
            <div className="flex flex-wrap gap-2">
                {fuentesDisponibles.map(f => (
                    <button
                        key={f.valor}
                        onClick={() => handleArrayChange('fuentes', f.valor)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${
                            formData.fuentes.includes(f.valor) 
                            ? "bg-blue-500 text-white border-blue-500" 
                            : "bg-transparent text-gray-500 border-gray-300 dark:border-gray-600 hover:border-blue-400"
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-white/10" />

        {/* CRITERIOS */}
        <div>
            <label className={labelClass + " mb-2 block"}>Criterios - Categorías</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1">
                {categoriasDisponibles.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded">
                        <input 
                            type="checkbox" 
                            checked={formData.criterios.categoria.includes(cat)} 
                            onChange={() => handleCriterioCatChange(cat)}
                            className="rounded text-blue-500 focus:ring-0" 
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">{cat}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Fechas Compactas */}
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className={labelClass}>Desde (Acont.)</label>
                <input type="date" name="criterios.porfechaacontecimientodesde" value={formData.criterios.porfechaacontecimientodesde} onChange={handleChange} className={inputClass} />
            </div>
            <div>
                <label className={labelClass}>Hasta (Acont.)</label>
                <input type="date" name="criterios.porfechaacontecimientohasta" value={formData.criterios.porfechaacontecimientohasta} onChange={handleChange} className={inputClass} />
            </div>
        </div>

        {/* ACCIONES */}
        <div className="flex gap-3 pt-4">
            {modoEdicion && (
                <button onClick={cancelar} className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 font-bold text-sm">
                    Cancelar
                </button>
            )}
            <button 
                onClick={guardar}
                className={`flex-1 py-2 rounded-lg text-white font-bold text-sm shadow-lg transition-transform hover:-translate-y-0.5 ${
                    modoEdicion ? "bg-gradient-to-r from-yellow-500 to-orange-500" : "bg-gradient-to-r from-blue-600 to-indigo-600"
                }`}
            >
                {modoEdicion ? "Guardar Cambios" : "Crear Colección"}
            </button>
        </div>

      </div>
    </div>
  );
};

export default ColeccionesForm;