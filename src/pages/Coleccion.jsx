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

  // Datos del formulario
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    algoritmoConsenso: "MAYORIASIMPLE",
    fuentes: [],
    criterios: {
      categoria: [],
      titulo: "",
      descripcion: "",
      contienemultimedia: "",
      porfechacargadesde: "",
      porfechacargahasta: "",
      porfechaacontecimientodesde: "",
      porfechaacontecimientohasta: "",
    },
  });

  // Opciones disponibles
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

  // Lista de categorías disponibles
  const categoriasDisponibles = [
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
  ];

  // Cargar colecciones
  const cargarColecciones = async (pagina = 1) => {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8500/gestordatos/publica/colecciones`
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data.colecciones)) {
        setColecciones(data.colecciones);
        setTotalPaginas(data.totalPaginas || 1);
      } else if (data && Array.isArray(data)) {
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
      setColecciones([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarColecciones();
  }, []);

  // Transformar datos del formulario al formato del backend
  const transformarDatosParaBackend = (datosFormulario) => {
    const criterios = [];

    // 1. Transformar categorías (cada categoría es un criterio individual)
    if (Array.isArray(datosFormulario.criterios.categoria)) {
      datosFormulario.criterios.categoria.forEach((categoria) => {
        criterios.push({
          tipo: "porcategoria",
          params: {
            categoriaDeseada: categoria,
          },
        });
      });
    }

    // 2. Criterio por título
    if (
      datosFormulario.criterios.titulo &&
      datosFormulario.criterios.titulo.trim() !== ""
    ) {
      criterios.push({
        tipo: "portitulo",
        params: {
          tituloBuscado: datosFormulario.criterios.titulo,
        },
      });
    }

    // 3. Criterio por descripción
    if (
      datosFormulario.criterios.descripcion &&
      datosFormulario.criterios.descripcion.trim() !== ""
    ) {
      criterios.push({
        tipo: "pordescripcion",
        params: {
          fraseClave: datosFormulario.criterios.descripcion,
        },
      });
    }

    // 4. Criterio por contenido multimedia
    if (datosFormulario.criterios.contienemultimedia !== "") {
      criterios.push({
        tipo: "contienemultimedia",
        params: {
          multimedia: datosFormulario.criterios.contienemultimedia.toString(),
        },
      });
    }

    // 5. Criterios por fecha de carga
    if (datosFormulario.criterios.porfechacargadesde) {
      criterios.push({
        tipo: "porfechacargadesde",
        params: {
          desde: `${datosFormulario.criterios.porfechacargadesde}T00:00:00`,
        },
      });
    }

    if (datosFormulario.criterios.porfechacargahasta) {
      criterios.push({
        tipo: "porfechacargahasta",
        params: {
          hasta: `${datosFormulario.criterios.porfechacargahasta}T23:59:59`,
        },
      });
    }

    // 6. Criterios por fecha de acontecimiento
    if (datosFormulario.criterios.porfechaacontecimientodesde) {
      criterios.push({
        tipo: "porfechaacontecimientodesde",
        params: {
          desde: `${datosFormulario.criterios.porfechaacontecimientodesde}T00:00:00`,
        },
      });
    }

    if (datosFormulario.criterios.porfechaacontecimientohasta) {
      criterios.push({
        tipo: "porfechaacontecimientohasta",
        params: {
          hasta: `${datosFormulario.criterios.porfechaacontecimientohasta}T23:59:59`,
        },
      });
    }

    return {
      titulo: datosFormulario.titulo,
      descripcion: datosFormulario.descripcion,
      algoritmoConsenso: datosFormulario.algoritmoConsenso,
      origenesReales: datosFormulario.fuentes,
      criterios: criterios,
    };
  };

  // Manejar selección de categorías
  const handleCategoriaChange = (categoria) => {
    try {
      setFormData((prev) => ({
        ...prev,
        criterios: {
          ...prev.criterios,
          categoria: prev.criterios.categoria.includes(categoria)
            ? prev.criterios.categoria.filter((c) => c !== categoria)
            : [...prev.criterios.categoria, categoria],
        },
      }));
    } catch (err) {
      console.error("Error en handleCategoriaChange:", err);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    try {
      if (name.startsWith("criterios.")) {
        const criterioField = name.split(".")[1];
        if (criterioField !== "categoria") {
          setFormData((prev) => ({
            ...prev,
            criterios: {
              ...prev.criterios,
              [criterioField]: value,
            },
          }));
        }
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

  // Manejar selección de fuentes
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

  // MEJORADO: Seleccionar colección para editar
  const seleccionarColeccion = (coleccion) => {
    try {
      setColeccionSeleccionada(coleccion);
      setModoEdicion(true);

      // Extraer criterios de la colección existente
      const criterios = coleccion.criterios || [];

      const categorias = criterios
        .filter((c) => c.tipo === "porcategoria")
        .map((c) => c.params.categoriaDeseada);

      const titulo =
        criterios.find((c) => c.tipo === "portitulo")?.params?.tituloBuscado ||
        "";
      const descripcion =
        criterios.find((c) => c.tipo === "pordescripcion")?.params
          ?.fraseClave || "";
      const contienemultimedia =
        criterios.find((c) => c.tipo === "contienemultimedia")?.params
          ?.multimedia || "";

      // Extraer fechas (esto es más complejo, simplificamos por ahora)
      const fechaCargaDesde =
        criterios
          .find((c) => c.tipo === "porfechacargadesde")
          ?.params?.desde?.split("T")[0] || "";
      const fechaCargaHasta =
        criterios
          .find((c) => c.tipo === "porfechacargahasta")
          ?.params?.hasta?.split("T")[0] || "";
      const fechaAcontecimientoDesde =
        criterios
          .find((c) => c.tipo === "porfechaacontecimientodesde")
          ?.params?.desde?.split("T")[0] || "";
      const fechaAcontecimientoHasta =
        criterios
          .find((c) => c.tipo === "porfechaacontecimientohasta")
          ?.params?.hasta?.split("T")[0] || "";

      setFormData({
        titulo: coleccion.titulo || "",
        descripcion: coleccion.descripcion || "",
        algoritmoConsenso: coleccion.algoritmoConsenso || "MAYORIASIMPLE",
        fuentes: Array.isArray(coleccion.origenesReales)
          ? coleccion.origenesReales
          : [],
        criterios: {
          categoria: categorias,
          titulo: titulo,
          descripcion: descripcion,
          contienemultimedia: contienemultimedia,
          porfechacargadesde: fechaCargaDesde,
          porfechacargahasta: fechaCargaHasta,
          porfechaacontecimientodesde: fechaAcontecimientoDesde,
          porfechaacontecimientohasta: fechaAcontecimientoHasta,
        },
      });
    } catch (err) {
      console.error("Error en seleccionarColeccion:", err);
      setError("Error al cargar la colección para editar");
    }
  };

  // Crear nueva colección
  const crearColeccion = () => {
    try {
      setColeccionSeleccionada(null);
      setModoEdicion(false);
      setFormData({
        titulo: "",
        descripcion: "",
        algoritmoConsenso: "MAYORIASIMPLE",
        fuentes: [],
        criterios: {
          categoria: [],
          titulo: "",
          descripcion: "",
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

  // MEJORADO: Guardar colección (ahora maneja CREATE y UPDATE)
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

      // Transformar datos al formato del backend
      const datosParaBackend = transformarDatosParaBackend(formData);

      console.log("📤 Enviando datos al backend:", datosParaBackend);

      let url, method;

      if (modoEdicion && coleccionSeleccionada) {
        // UPDATE - Usar PUT para editar
        url = `http://localhost:8500/gestordatos/admin/colecciones/${coleccionSeleccionada.handle}`;
        method = "PUT";
      } else {
        // CREATE - Usar POST para crear nueva
        url = "http://localhost:8500/gestordatos/admin/colecciones";
        method = "POST";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosParaBackend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
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

  // Eliminar colección
  const eliminarColeccion = async (handle) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar esta colección?")
    ) {
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8500/gestordatos/admin/colecciones/${handle}`,
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
              ? `Editando: ${coleccionSeleccionada?.titulo || "Colección"}`
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {modoEdicion ? "✏️ Editar Colección" : "➕ Nueva Colección"}
              </h2>
              {modoEdicion && (
                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Modo Edición
                </span>
              )}
            </div>

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
                  Orígenes Reales
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
                <div className="space-y-4">
                  {/* Selector de categorías múltiples */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categorías
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                      {categoriasDisponibles.map((categoria) => (
                        <label
                          key={categoria}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={formData.criterios.categoria.includes(
                              categoria
                            )}
                            onChange={() => handleCategoriaChange(categoria)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 capitalize">
                            {categoria}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Selecciona una o más categorías
                    </p>
                  </div>

                  {/* Resto de campos de criterios */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título contiene
                      </label>
                      <input
                        type="text"
                        name="criterios.titulo"
                        value={formData.criterios.titulo}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Texto a buscar en títulos"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción contiene
                      </label>
                      <input
                        type="text"
                        name="criterios.descripcion"
                        value={formData.criterios.descripcion}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Texto a buscar en descripciones"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contiene Multimedia
                      </label>
                      <select
                        name="criterios.contienemultimedia"
                        value={formData.criterios.contienemultimedia}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Todos</option>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha Carga Desde
                      </label>
                      <input
                        type="date"
                        name="criterios.porfechacargadesde"
                        value={formData.criterios.porfechacargadesde}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha Carga Hasta
                      </label>
                      <input
                        type="date"
                        name="criterios.porfechacargahasta"
                        value={formData.criterios.porfechacargahasta}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha Acontecimiento Desde
                      </label>
                      <input
                        type="date"
                        name="criterios.porfechaacontecimientodesde"
                        value={formData.criterios.porfechaacontecimientodesde}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha Acontecimiento Hasta
                      </label>
                      <input
                        type="date"
                        name="criterios.porfechaacontecimientohasta"
                        value={formData.criterios.porfechaacontecimientohasta}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones del formulario - MEJORADO */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={guardarColeccion}
                  disabled={cargando}
                  className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    modoEdicion
                      ? "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500"
                      : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                  }`}
                >
                  {cargando
                    ? "Guardando..."
                    : modoEdicion
                    ? "💾 Actualizar Colección"
                    : "➕ Crear Colección"}
                </button>

                {modoEdicion && (
                  <button
                    onClick={crearColeccion}
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    ❌ Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Lista de Colecciones */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                📚 Colecciones Existentes
              </h2>
              <span className="text-sm text-gray-500">
                {colecciones.length} colección(es)
              </span>
            </div>

            {cargando ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Cargando colecciones...</p>
              </div>
            ) : colecciones.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                📝 No hay colecciones creadas
              </div>
            ) : (
              <div className="space-y-4">
                {colecciones.map((coleccion, index) => (
                  <div
                    key={coleccion.handle || index}
                    className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${
                      modoEdicion &&
                      coleccionSeleccionada?.handle === coleccion.handle
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {coleccion.titulo || "Sin título"}
                          </h3>
                          {modoEdicion &&
                            coleccionSeleccionada?.handle ===
                              coleccion.handle && (
                              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full ml-2">
                                Editando
                              </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {coleccion.descripcion || "Sin descripción"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {coleccion.algoritmo || "MAYORIASIMPLE"}
                          </span>
                          {Array.isArray(coleccion.origenesReales) &&
                            coleccion.origenesReales.map((fuente, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {fuente}
                              </span>
                            ))}
                          {coleccion.criterios &&
                            coleccion.criterios
                              .filter((c) => c.tipo === "porcategoria")
                              .map((criterio, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                >
                                  {criterio.params.categoriaDeseada}
                                </span>
                              ))}
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => seleccionarColeccion(coleccion)}
                          disabled={modoEdicion}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          title={
                            modoEdicion
                              ? "Termina la edición actual primero"
                              : "Editar colección"
                          }
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => eliminarColeccion(coleccion.handle)}
                          disabled={modoEdicion}
                          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          title={
                            modoEdicion
                              ? "Termina la edición actual primero"
                              : "Eliminar colección"
                          }
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionColecciones;
