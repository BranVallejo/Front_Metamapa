// src/pages/ReportarHecho.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Este componente asume que estás usando react-router-dom
// y que Tailwind CSS ya está configurado en tu proyecto.

const ReportarHecho = () => {
  const navigate = useNavigate(); // Hook para el botón "Volver"

  // Estado inicial para todos los campos del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    latitud: '',
    longitud: '',
    fechaAcontecimiento: '',
    etiqueta: '',
  });

  // Estado para el nombre del archivo (solo para mostrarlo)
  const [fileName, setFileName] = useState('Ningún archivo seleccionado');

  // Manejador genérico para todos los inputs de texto/select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejador para el input de archivo
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      // Aquí guardarías el archivo en un estado si fueras a subirlo
      // setFile(e.target.files[0]);
    } else {
      setFileName('Ningún archivo seleccionado');
    }
  };

  // Manejador para el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // --- Construcción del DTO ---
    // Creamos el objeto DTO basado en el estado del formulario
    const dto = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      latitud: parseFloat(formData.latitud), // Convertimos a número
      longitud: parseFloat(formData.longitud), // Convertimos a número
      fechaAcontecimiento: new Date(formData.fechaAcontecimiento).toISOString().slice(0, 19),
      origen: "SBASE", // Usamos SBASE como en tu DTO de ejemplo
      etiqueta: formData.etiqueta,
    };

    console.log('DTO que se enviaría al Backend:', dto);

    // Aquí es donde harías tu llamada fetch POST al backend
    // fetch('URL_DE_TU_API', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dto)
    // })
    // .then(res => res.json())
    // .then(data => {
    //   alert('Hecho reportado con éxito!');
    //   navigate('/mapa'); // Redirige al mapa
    // })
    // .catch(error => {
    //   console.error('Error:', error);
    //   alert('Error al reportar el hecho');
    // });

    alert('Hecho reportado (revisá la consola para ver el DTO)');
  };

  return (
    // Usamos clases de Tailwind para centrar y estilizar
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl">
        
        {/* Encabezado con el botón Volver */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Reportar Nuevo Hecho
          </h1>
          <button
            onClick={() => navigate(-1)} // Vuelve a la página anterior
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            &larr; Volver
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ej: Colisión en Av. Corrientes"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe lo que sucedió con el mayor detalle posible."
              required
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecciona una categoría...</option>
              <option value="vientos fuertes">vientos fuertes</option>
              <option value="inundaciones">inundaciones</option>
              <option value="granizo">granizo</option>
              <option value="nevadas">nevadas</option>
              <option value="calor extremo">calor extremo</option>
              <option value="sequía">sequía</option>
              <option value="derrumbes">derrumbes</option>
              <option value="actividad volcánica">actividad volcánica</option>
              <option value="incendios">incendios</option>
              <option value="contaminacion">contaminacion</option>
              <option value="evento sanitario">evento sanitario</option>
              <option value="derrame">derrame</option>
              <option value="intoxicación masiva">intoxicación masiva</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Fila para Latitud y Longitud */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitud" className="block text-sm font-medium text-gray-700">
                Latitud <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="latitud"
                name="latitud"
                value={formData.latitud}
                onChange={handleChange}
                placeholder="-34.6037"
                step="any"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="longitud" className="block text-sm font-medium text-gray-700">
                Longitud <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="longitud"
                name="longitud"
                value={formData.longitud}
                onChange={handleChange}
                placeholder="-58.3816"
                step="any"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Fila para Fecha y Etiqueta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fechaAcontecimiento" className="block text-sm font-medium text-gray-700">
                Fecha y Hora del Acontecimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="fechaAcontecimiento"
                name="fechaAcontecimiento"
                value={formData.fechaAcontecimiento}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="etiqueta" className="block text-sm font-medium text-gray-700">
                Etiqueta
              </label>
              <input
                type="text"
                id="etiqueta"
                name="etiqueta"
                value={formData.etiqueta}
                onChange={handleChange}
                placeholder="Ej: URGENTE"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Archivos Multimedia */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Archivos Multimedia (Opcional)
            </label>
            <div className="mt-1 flex items-center">
              <label className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md shadow-sm cursor-pointer hover:bg-blue-50">
                Elegir archivos
                <input
                  type="file"
                  id="archivosMultimedia"
                  name="archivosMultimedia"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="ml-3 text-gray-600 truncate">{fileName}</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)} // O navigate('/mapa')
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              Reportar Hecho
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReportarHecho;