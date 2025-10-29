// src/pages/GestionColecciones.jsx
import React, { useState, useEffect } from "react";

const GestionColecciones = () => {
  // Estados
  const [colecciones, setColecciones] = useState([]);
  const [coleccionSeleccionada, setColeccionSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);

  // Datos del formulario - INICIALIZADO CORRECTAMENTE
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    algoritmoConsenso: "ABSOLUTO",
    fuentes: [],
    criterios: {
      categoria: "",
      descripcion: "",
      portipofuente: "",
      contienemultimedia: "",
      porfechacargadesde: "",
      porfechacargahasta: "",
      porfechaacontecimientodesde: "",
      porfechaacontecimientohasta: "",
    },
  });

  // Opciones disponibles
  const algoritmosConsenso = [
    { valor: "ABSOLUTO", label: "Absoluto" },
    { valor: "MAYORIA_SIMPLE", label: "Mayoría Simple" },
    { valor: "MULTIPLES_MENCIONES", label: "Múltiples Menciones" },
  ];

  const fuentesDisponibles = [
    { valor: "DINAMICA", label: "Dinámica" },
    { valor: "ESTATICA", label: "Estática" },
    { valor: "DEMO", label: "Demo" },
    { valor: "METAMAPA", label: "MetaMapa" },
  ];

  // Cargar colecciones - CON MEJOR MANEJO DE ERRORES
  const cargarColecciones = async (pagina = 1) => {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8500/gestordatos/publica/colecciones?pagina=${pagina}&limite=10`
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Validar que la respuesta tenga la estructura esperada
      if (data && Array.isArray(data.colecciones)) {
        setColecciones(data.colecciones);
        setTotalPaginas(data.totalPaginas || 1);
      } else if (data && Array.isArray(data)) {
        // Si la respuesta es directamente un array
        setColecciones(data);
        setTotalPaginas(1);
      } else {
        setColecciones([]);
      }

      setPaginaActual(pagina);
    } catch (error) {
      console.error("Error cargando colecciones:", error);
      setError(
        "No se pudieron cargar las colecciones. Verifica que el servidor esté funcionando."
      );
      setColecciones([]); // Asegurar que siempre tenga un array
    } finally {
      setCargando(false);
    }
  };

  // Efecto para cargar colecciones al montar el componente
  useEffect(() => {
    cargarColecciones();
  }, []);

  // Manejar cambios en el formulario - CON VALIDACIÓN
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    try {
      if (name.startsWith("criterios.")) {
        const criterioField = name.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          criterios: {
            ...prev.criterios,
            [criterioField]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } catch (err) {
      console.error("Error en handleInputChange:", err);
    }
  };

  // Manejar selección de fuentes - CON VALIDACIÓN
  const handleFuenteChange = (fuente) => {
    try {
      setFormData((prev) => ({
        ...prev,
        fuentes: prev.fuentes.includes(fuente)
          ? prev.fuentes.filter((f) => f !== fuente)
          : [...prev.fuentes, fuente],
      }));
    } catch (err) {
      console.error("Error en handleFuenteChange:", err);
    }
  };

  // Seleccionar colección para editar - CON VALIDACIÓN
  const seleccionarColeccion = (coleccion) => {
    try {
      setColeccionSeleccionada(coleccion);
      setModoEdicion(true);
      setFormData({
        titulo: coleccion.titulo || "",
        descripcion: coleccion.descripcion || "",
        algoritmoConsenso: coleccion.algoritmoConsenso || "ABSOLUTO",
        fuentes: Array.isArray(coleccion.fuentes) ? coleccion.fuentes : [],
        criterios: {
          categoria: coleccion.criterios?.categoria || "",
          descripcion: coleccion.criterios?.descripcion || "",
          portipofuente: coleccion.criterios?.portipofuente || "",
          contienemultimedia: coleccion.criterios?.contienemultimedia || "",
          porfechacargadesde: coleccion.criterios?.porfechacargadesde || "",
          porfechacargahasta: coleccion.criterios?.porfechacargahasta || "",
          porfechaacontecimientodesde:
            coleccion.criterios?.porfechaacontecimientodesde || "",
          porfechaacontecimientohasta:
            coleccion.criterios?.porfechaacontecimientohasta || "",
        },
      });
    } catch (err) {
      console.error("Error en seleccionarColeccion:", err);
      setError("Error al cargar la colección para editar");
    }
  };

  // Crear nueva colección - CON VALIDACIÓN
  const crearColeccion = () => {
    try {
      setColeccionSeleccionada(null);
      setModoEdicion(false);
      setFormData({
        titulo: "",
        descripcion: "",
        algoritmoConsenso: "ABSOLUTO",
        fuentes: [],
        criterios: {
          categoria: "",
          descripcion: "",
          portipofuente: "",
          contienemultimedia: "",
          porfechacargadesde: "",
          porfechacargahasta: "",
          porfechaacontecimientodesde: "",
          porfechaacontecimientohasta: "",
        },
      });
    } catch (err) {
      console.error("Error en crearColeccion:", err);
    }
  };

  // Guardar colección - CON VALIDACIÓN
  const guardarColeccion = async () => {
    setCargando(true);
    setError(null);
    try {
      // Validación básica
      if (!formData.titulo.trim()) {
        setError("El título es obligatorio");
        setCargando(false);
        return;
      }

      const url = modoEdicion
        ? `http://localhost:8500/gestordatos/publica/colecciones/${coleccionSeleccionada?.id}`
        : "http://localhost:8500/gestordatos/publica/colecciones";

      const method = modoEdicion ? "PUT" : "POST";

      console.log("Enviando datos:", formData); // Para debug

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      setMensaje(
        `Colección ${modoEdicion ? "actualizada" : "creada"} correctamente`
      );
      await cargarColecciones(paginaActual);
      crearColeccion();
    } catch (error) {
      console.error("Error guardando colección:", error);
      setError(
        `Error al ${modoEdicion ? "actualizar" : "crear"} la colección: ${
          error.message
        }`
      );
    } finally {
      setCargando(false);
    }
  };

  // Eliminar colección - CON VALIDACIÓN
  const eliminarColeccion = async (id) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar esta colección?")
    ) {
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8500/gestordatos/publica/colecciones/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      setMensaje("Colección eliminada correctamente");
      await cargarColecciones(paginaActual);
    } catch (error) {
      console.error("Error eliminando colección:", error);
      setError("Error al eliminar la colección");
    } finally {
      setCargando(false);
    }
  };

  // Si hay un error crítico, mostrar página de error
  if (error && colecciones.length === 0 && !cargando) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              cargarColecciones();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Colecciones
          </h1>
          <p className="text-gray-600 mt-2">
            {modoEdicion
              ? "Editando colección"
              : "Crear y administrar colecciones de datos"}
          </p>
        </div>

        {/* Mensajes de éxito */}
        {mensaje && (
          <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-700 border border-green-300">
            {mensaje}
          </div>
        )}

        {/* Mensajes de error */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {modoEdicion ? "Editar Colección" : "Nueva Colección"}
            </h2>

            <div className="space-y-6">
              {/* Información Básica */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Información Básica
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ingrese el título de la colección"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Descripción de la colección"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Algoritmo de Consenso *
                    </label>
                    <select
                      name="algoritmoConsenso"
                      value={formData.algoritmoConsenso}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {algoritmosConsenso.map((algo) => (
                        <option key={algo.valor} value={algo.valor}>
                          {algo.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Fuentes */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Fuentes
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {fuentesDisponibles.map((fuente) => (
                    <label
                      key={fuente.valor}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={formData.fuentes.includes(fuente.valor)}
                        onChange={() => handleFuenteChange(fuente.valor)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {fuente.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Criterios */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Criterios de Filtrado
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "criterios.categoria",
                      label: "Categoría",
                      type: "text",
                    },
                    {
                      name: "criterios.descripcion",
                      label: "Descripción",
                      type: "text",
                    },
                    {
                      name: "criterios.contienemultimedia",
                      label: "Contiene Multimedia",
                      type: "select",
                    },
                    {
                      name: "criterios.porfechacargadesde",
                      label: "Fecha Carga Desde",
                      type: "date",
                    },
                    {
                      name: "criterios.porfechacargahasta",
                      label: "Fecha Carga Hasta",
                      type: "date",
                    },
                    {
                      name: "criterios.porfechaacontecimientodesde",
                      label: "Fecha Acontecimiento Desde",
                      type: "date",
                    },
                    {
                      name: "criterios.porfechaacontecimientohasta",
                      label: "Fecha Acontecimiento Hasta",
                      type: "date",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          value={
                            formData.criterios[field.name.split(".")[1]] || ""
                          }
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Todos</option>
                          <option value="true">Sí</option>
                          <option value="false">No</option>
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={
                            formData.criterios[field.name.split(".")[1]] || ""
                          }
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones del formulario */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={guardarColeccion}
                  disabled={cargando}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cargando
                    ? "Guardando..."
                    : modoEdicion
                    ? "Actualizar"
                    : "Crear Colección"}
                </button>

                {modoEdicion && (
                  <button
                    onClick={crearColeccion}
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Lista de Colecciones */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Colecciones Existentes
              </h2>
              <span className="text-sm text-gray-500">
                Página {paginaActual} de {totalPaginas}
              </span>
            </div>

            {cargando ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando colecciones...</p>
              </div>
            ) : colecciones.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay colecciones creadas
              </div>
            ) : (
              <div className="space-y-4">
                {colecciones.map((coleccion, index) => (
                  <div
                    key={coleccion.id || index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {coleccion.titulo || "Sin título"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {coleccion.descripcion || "Sin descripción"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {coleccion.algoritmoConsenso || "ABSOLUTO"}
                          </span>
                          {Array.isArray(coleccion.fuentes) &&
                            coleccion.fuentes.map((fuente, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {fuente}
                              </span>
                            ))}
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => seleccionarColeccion(coleccion)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarColeccion(coleccion.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => cargarColecciones(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                <span className="text-sm text-gray-700">
                  Página {paginaActual} de {totalPaginas}
                </span>

                <button
                  onClick={() => cargarColecciones(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionColecciones;
