import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapaSelectorCoordenadas from '../Components/MapaSelectorCoordenadas';

const ReportarHecho = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    latitud: "",
    longitud: "",
    fechaAcontecimiento: "",
    etiqueta: "",
  });

  const [fileName, setFileName] = useState("Ningún archivo seleccionado");
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMapClick = (lat, lng) => {
    setFormData((prevData) => ({
      ...prevData,
      latitud: lat.toFixed(6), // Redondeamos a 6 decimales
      longitud: lng.toFixed(6),
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("Ningún archivo seleccionado");
    }
  };

  // Función para vaciar el formulario
  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      categoria: "",
      latitud: "",
      longitud: "",
      fechaAcontecimiento: "",
      etiqueta: "",
    });
    setFileName("Ningún archivo seleccionado");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const userData = JSON.parse(localStorage.getItem("user"));
    userData.userId;

    // Construcción del DTO
    const dto = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      latitud: parseFloat(formData.latitud),
      longitud: parseFloat(formData.longitud),
      fechaAcontecimiento: new Date(formData.fechaAcontecimiento)
        .toISOString()
        .slice(0, 19),
      etiqueta: formData.etiqueta,
      contribuyenteID: userData.userId,
    };

    console.log("DTO que se enviará:", dto);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL_INICIAL_DINAMICA}/hecho`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dto),
        }
      );

      // Verificar si la respuesta es exitosa
      if (response.ok) {
        // Intentar leer como texto (ya que el servidor devuelve texto plano)
        const responseText = await response.text();
        console.log("Respuesta del servidor:", responseText);

        // Mostrar mensaje de éxito
        alert("¡Hecho reportado con éxito!");

        // Vaciar el formulario
        resetForm();

        // Redirigir al mapa después de 1 segundo para que el usuario vea el mensaje
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        // Manejar errores del servidor
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        alert(`Error al reportar el hecho: ${errorText}`);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de conexión. Verifica que el servidor esté funcionando.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Reportar Nuevo Hecho
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            &larr; Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label
              htmlFor="titulo"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="categoria"
              className="block text-sm font-medium text-gray-700"
            >
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
              <option value="vientos fuertes">Vientos fuertes</option>
              <option value="inundaciones">Inundaciones</option>
              <option value="granizo">Granizo</option>
              <option value="nevadas">Nevadas</option>
              <option value="calor extremo">Calor extremo</option>
              <option value="sequía">Sequía</option>
              <option value="derrumbes">Derrumbes</option>
              <option value="actividad volcánica">Actividad volcánica</option>
              <option value="incendios">Incendios</option>
              <option value="contaminacion">Contaminacion</option>
              <option value="evento sanitario">Evento sanitario</option>
              <option value="derrame">Derrame</option>
              <option value="intoxicación masiva">Intoxicación masiva</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* 3. REEMPLAZAMOS LOS INPUTS DE TEXTO POR EL MAPA */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Ubicación <span className="text-red-500">*</span>
              <span className="text-gray-500 text-xs ml-2">(Haz clic en el mapa para seleccionar)</span>
            </label>
            <MapaSelectorCoordenadas
              latitud={parseFloat(formData.latitud)}
              longitud={parseFloat(formData.longitud)}
              onCoordenadasChange={handleMapClick}
            />
            {/* {errors.latitud && <p className="text-red-500 text-xs mt-1">{errors.latitud}</p>} */}
          </div>

          {/* 4. MANTENEMOS LOS INPUTS PERO DESHABILITADOS (para que el usuario vea las coords) */}
          <div>
            <label htmlFor="latitud" className="block text-gray-700 text-sm font-semibold mb-2">
              Latitud (autocompletado)
            </label>
            <input
              type="number"
              id="latitud"
              name="latitud"
              value={formData.latitud}
              onChange={handleChange} // Opcional: permitir edición manual
              placeholder="Seleccioná en el mapa..."
              step="any"
              disabled // O 'readOnly' si preferís
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="longitud" className="block text-gray-700 text-sm font-semibold mb-2">
              Longitud (autocompletado)
            </label>
            <input
              type="number"
              id="longitud"
              name="longitud"
              value={formData.longitud}
              onChange={handleChange} // Opcional: permitir edición manual
              placeholder="Seleccioná en el mapa..."
              step="any"
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none"
            />
          </div>

          {/* Fila para Fecha y Etiqueta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fechaAcontecimiento"
                className="block text-sm font-medium text-gray-700"
              >
                Fecha y Hora del Acontecimiento{" "}
                <span className="text-red-500">*</span>
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
              <label
                htmlFor="etiqueta"
                className="block text-sm font-medium text-gray-700"
              >
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
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md flex items-center ${enviando ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
            >
              {enviando ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    ></path>
                  </svg>
                  Reportar Hecho
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportarHecho;
