// src/pages/EditarHecho.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

// 1. DEFINIMOS LA NUEVA LISTA DE CATEGORÍAS
const categoriasPermitidas = [
  "vientos fuertes",
  "inundaciones",
  "granizo",
  "nevadas",
  "calor extremo",
  "sequia",
  "derrumbes",
  "actividad volcánica",
  "contaminación",
  "evento sanitario",
  "derrame",
  "intoxicacion masiva",
  "Otro" // Añadimos "Otro" como opción seleccionable
];

const EditarHecho = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    latitud: '',
    longitud: '',
    fechaAcontecimiento: '',
    etiqueta: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica/hechos?idBuscado=${id}`,
      { method: "GET" }
    )
    .then(response => {
      if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (data && data.hechos && data.hechos.length > 0) {
        const hecho = data.hechos[0];
        
        const fechaFormateada = hecho.fechaAcontecimiento ? hecho.fechaAcontecimiento.slice(0, 16) : "";

        // 2. LÓGICA DE CATEGORÍA CON FALLBACK
        // Comprobamos si la categoría del hecho está en nuestra lista permitida
        const categoriaDelHecho = hecho.categoria;
        const categoriaEsValida = categoriasPermitidas.includes(categoriaDelHecho);

        setFormData({
          titulo: hecho.titulo,
          descripcion: hecho.descripcion,
          // Si la categoría del backend no es válida, la seteamos en "Otro"
          categoria: categoriaEsValida ? categoriaDelHecho : "Otro", 
          latitud: hecho.latitud,
          longitud: hecho.longitud,
          fechaAcontecimiento: fechaFormateada,
          etiqueta: hecho.etiqueta || '',
        });
        setLoading(false);
      } else {
        throw new Error(`No se encontró ningún hecho con el ID: ${id}`);
      }
    })
    .catch(err => {
      console.error("Error al cargar datos para editar:", err);
      setError(err.message);
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 

    const cambios = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      latitud: parseFloat(formData.latitud),
      longitud: parseFloat(formData.longitud),
      fechaAcontecimiento: new Date(formData.fechaAcontecimiento).toISOString().slice(0, 19),
      etiqueta: formData.etiqueta,
    };
    
    const url = `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica/hechos/${id}`;

    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.mensaje || `Error del servidor: ${response.status}`);
        });
      }
      return response.json();
    })
    .then(data => {
      alert(data.mensaje || '¡Hecho actualizado con éxito!');
      navigate(`/hechos/${id}`);
    })
    .catch(error => {
      console.error('Error al editar el hecho:', error);
      alert(`Error: ${error.message}`);
    });
  };
  
  if (loading) {
    return <div className="p-8 text-center dark:text-white">Cargando datos para editar...</div>;
  }
  if (error) {
    return <div className="p-8 text-center dark:text-white text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Editar Hecho
          </h1>
          <Link
            to={`/hechos/${id}`}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            &larr; Volver al Detalle
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ... (input de título) ... */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* ... (input de descripción) ... */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          {/* 3. <select> ACTUALIZADO */}
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecciona una categoría...</option>
              {/* Mapeamos sobre la lista de categorías permitidas */}
              {categoriasPermitidas.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* ... (resto del formulario: latitud, longitud, fecha, etiqueta) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitud" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Latitud <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="latitud"
                name="latitud"
                value={formData.latitud}
                onChange={handleChange}
                step="any"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="longitud" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Longitud <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="longitud"
                name="longitud"
                value={formData.longitud}
                onChange={handleChange}
                step="any"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fechaAcontecimiento" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fecha y Hora del Acontecimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="fechaAcontecimiento"
                name="fechaAcontecimiento"
                value={formData.fechaAcontecimiento}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="etiqueta" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Etiqueta
              </label>
              <input
                type="text"
                id="etiqueta"
                name="etiqueta"
                value={formData.etiqueta}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Link
              to={`/hechos/${id}`}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center"
            >
              Guardar Cambios
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditarHecho;