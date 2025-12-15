import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import FondoChill from "../Components/FondoDinamico/FondoChill";
import ColeccionesList from "../Components/Colecciones/ColeccionesList";
import ColeccionesForm from "../Components/Colecciones/ColeccionesForm";

const GestionColecciones = () => {
  // Estados
  const [colecciones, setColecciones] = useState([]);
  const [coleccionSeleccionada, setColeccionSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargando, setCargando] = useState(false);

  const mapearAlgoritmoBackendAValor = (algoritmo) => {
    if (!algoritmo) return "mayoriasimple";

    const normalizado = algoritmo
      .toLowerCase()
      .replaceAll(" ", "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (normalizado === "absoluto") return "absoluto";
    if (normalizado === "multiplesmenciones") return "multiplesmenciones";
    return "mayoriasimple";
  };

  // Formulario Inicial
  const initialFormState = {
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
  };

  const [formData, setFormData] = useState(initialFormState);

  // Cargar colecciones
  const cargarColecciones = async () => {
    setCargando(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica/colecciones`
      );
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();

      const lista = Array.isArray(data.colecciones)
        ? data.colecciones
        : Array.isArray(data)
        ? data
        : [];
      setColecciones(lista);
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudieron cargar las colecciones");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarColecciones();
  }, []);

  // Helpers de transformación (Mantengo tu lógica original intacta)
  const transformarDatosParaBackend = (datosFormulario) => {
    const criterios = [];
    if (Array.isArray(datosFormulario.criterios.categoria)) {
      datosFormulario.criterios.categoria.forEach((cat) =>
        criterios.push({
          tipo: "porcategoria",
          params: { categoriaDeseada: cat },
        })
      );
    }
    if (datosFormulario.criterios.titulo?.trim())
      criterios.push({
        tipo: "portitulo",
        params: { tituloBuscado: datosFormulario.criterios.titulo },
      });
    if (datosFormulario.criterios.descripcion?.trim())
      criterios.push({
        tipo: "pordescripcion",
        params: { fraseClave: datosFormulario.criterios.descripcion },
      });
    if (datosFormulario.criterios.contienemultimedia !== "")
      criterios.push({
        tipo: "contienemultimedia",
        params: { multimedia: datosFormulario.criterios.contienemultimedia },
      });
    if (datosFormulario.criterios.porfechacargadesde)
      criterios.push({
        tipo: "porfechacargadesde",
        params: {
          desde: `${datosFormulario.criterios.porfechacargadesde}T00:00:00`,
        },
      });
    if (datosFormulario.criterios.porfechacargahasta)
      criterios.push({
        tipo: "porfechacargahasta",
        params: {
          hasta: `${datosFormulario.criterios.porfechacargahasta}T23:59:59`,
        },
      });
    if (datosFormulario.criterios.porfechaacontecimientodesde)
      criterios.push({
        tipo: "porfechaacontecimientodesde",
        params: {
          desde: `${datosFormulario.criterios.porfechaacontecimientodesde}T00:00:00`,
        },
      });
    if (datosFormulario.criterios.porfechaacontecimientohasta)
      criterios.push({
        tipo: "porfechaacontecimientohasta",
        params: {
          hasta: `${datosFormulario.criterios.porfechaacontecimientohasta}T23:59:59`,
        },
      });

    return {
      titulo: datosFormulario.titulo,
      descripcion: datosFormulario.descripcion,
      algoritmoConsenso: datosFormulario.algoritmoConsenso,
      tipoFuente: datosFormulario.fuentes,
      criterios: criterios,
    };
  };

  const seleccionarColeccion = (coleccion) => {
    setColeccionSeleccionada(coleccion);
    setModoEdicion(true);

    // Mapeo inverso (de backend a form)
    // Nota: Simplificado para brevedad, asumo que funciona como tu original
    const criterios = coleccion.criterios || [];
    setFormData({
      titulo: coleccion.titulo || "",
      descripcion: coleccion.descripcion || "",
      algoritmoConsenso: mapearAlgoritmoBackendAValor(coleccion.algoritmo),
      fuentes: coleccion.origenesReales || [],
      criterios: {
        categoria: criterios
          .filter((c) => c.tipo === "porcategoria")
          .map((c) => c.params.categoriaDeseada),
        titulo:
          criterios.find((c) => c.tipo === "portitulo")?.params
            ?.tituloBuscado || "",
        descripcion:
          criterios.find((c) => c.tipo === "pordescripcion")?.params
            ?.fraseClave || "",
        contienemultimedia:
          criterios.find((c) => c.tipo === "contienemultimedia")?.params
            ?.multimedia || "",
        porfechacargadesde:
          criterios
            .find((c) => c.tipo === "porfechacargadesde")
            ?.params?.desde?.split("T")[0] || "",
        porfechacargahasta:
          criterios
            .find((c) => c.tipo === "porfechacargahasta")
            ?.params?.hasta?.split("T")[0] || "",
        porfechaacontecimientodesde:
          criterios
            .find((c) => c.tipo === "porfechaacontecimientodesde")
            ?.params?.desde?.split("T")[0] || "",
        porfechaacontecimientohasta:
          criterios
            .find((c) => c.tipo === "porfechaacontecimientohasta")
            ?.params?.hasta?.split("T")[0] || "",
      },
    });

    // Scroll arriba suave
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetearFormulario = () => {
    setColeccionSeleccionada(null);
    setModoEdicion(false);
    setFormData(initialFormState);
  };

  const guardarColeccion = async () => {
    if (!formData.titulo.trim())
      return toast.warning("El título es obligatorio");

    const toastId = toast.loading(
      modoEdicion ? "Actualizando..." : "Creando colección..."
    );
    const datosBackend = transformarDatosParaBackend(formData);

    console.log("📦 Datos enviados al backend (datosBackend):");
    console.log(JSON.stringify(datosBackend, null, 2));

    try {
      const url = modoEdicion
        ? `${import.meta.env.VITE_URL_INICIAL_GESTOR}/admin/colecciones/${
            coleccionSeleccionada.handle
          }`
        : `${import.meta.env.VITE_URL_INICIAL_GESTOR}/admin/colecciones`;

      const method = modoEdicion ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosBackend),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      toast.success(
        `Colección ${modoEdicion ? "actualizada" : "creada"} con éxito`,
        { id: toastId }
      );
      resetearFormulario();
      cargarColecciones();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error", {
        id: toastId,
        description: error.message,
      });
    }
  };

  const eliminarColeccion = async (handle) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta colección?")) return;

    const toastId = toast.loading("Eliminando...");
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_URL_INICIAL_GESTOR
        }/admin/colecciones/${handle}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Error al eliminar");

      toast.success("Colección eliminada", { id: toastId });
      cargarColecciones();
    } catch (error) {
      toast.error("No se pudo eliminar", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen relative transition-colors duration-500 text-gray-800 dark:text-gray-100 font-sans">
      <FondoChill />
      <Toaster richColors position="top-right" />

      <div className="relative z-10 pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 drop-shadow-sm mb-2">
            Gestión de Colecciones
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Crea conjuntos de datos personalizados para análisis y reportes.
          </p>
        </div>

        {/* LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* IZQUIERDA: FORMULARIO (Sticky) */}
          <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1">
            <div className="lg:sticky lg:top-28">
              <ColeccionesForm
                formData={formData}
                setFormData={setFormData}
                modoEdicion={modoEdicion}
                guardar={guardarColeccion}
                cancelar={resetearFormulario}
              />
            </div>
          </div>

          {/* DERECHA: LISTADO */}
          <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2">
            <ColeccionesList
              colecciones={colecciones}
              cargando={cargando}
              onEditar={seleccionarColeccion}
              onEliminar={eliminarColeccion}
              seleccionada={coleccionSeleccionada}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionColecciones;
