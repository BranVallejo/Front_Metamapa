import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

// Componentes
import FondoChill from "../Components/FondoDinamico/FondoChill";

const PaginaReporte = () => {
  // useParams lee lo que hay en la URL. Si la URL está mal, esto lee mal.
  const { idHecho } = useParams();
  const navigate = useNavigate();

  const [hecho, setHecho] = useState(null);
  const [descripcionReporte, setDescripcionReporte] = useState("");
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const cardClass =
    "relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-auto";
  const labelClass =
    "block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 opacity-80";
  const inputClass =
    "w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 backdrop-blur-sm resize-none";

  useEffect(() => {
    cargarHecho();
  }, [idHecho]);

  const cargarHecho = async () => {
    try {
      setCargando(true);
      
      // Validación visual para que sepas si el ID llegó mal
      const idNumerico = parseInt(idHecho);
      if (isNaN(idNumerico)) {
          console.error("URL INCORRECTA. Recibí:", idHecho);
          // No tiramos error aquí para dejar que la UI cargue y muestre el error en el formulario
      }

      // Simulación de carga de datos del hecho
      // (Aquí deberías hacer un fetch GET si quisieras mostrar los datos reales)
      const hechoSimulado = {
        id: idHecho,
        titulo: isNaN(idNumerico) ? "ERROR EN NAVEGACIÓN" : "Hecho bajo revisión",
        categoria: "Investigación",
        descripcion: "Detalles del hecho...",
        fechaAcontecimiento: new Date().toISOString(),
      };
      setHecho(hechoSimulado);
    } catch (error) {
      console.error("Error cargando hecho:", error);
      toast.error("Error al cargar la información");
    } finally {
      setCargando(false);
    }
  };

  const enviarReporte = async () => {
    if (!descripcionReporte.trim()) {
      toast.warning("Falta información", {
        description: "Por favor, describe el motivo de tu reporte.",
      });
      return;
    }

    // 1. Validar ID antes de enviar
    const idHechoNumerico = parseInt(idHecho);
    if (isNaN(idHechoNumerico)) {
        toast.error("Error crítico de navegación", {
            description: `El ID del hecho es inválido ("${idHecho}"). Vuelve atrás e intenta de nuevo.`
        });
        return;
    }

    setEnviando(true);
    const toastId = toast.loading("Enviando reporte...");

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      
      const requestBody = {
        idhecho: idHechoNumerico, // camelCase
        justificacion: descripcionReporte.trim(),
        usuarioId: userData?.userId,
      };

      console.log("📤 Enviando:", requestBody);

      // 2. FETCH CORRECTO PARA TU ENV ACTUAL
      // Tu env es: http://localhost:8080/gestordatos
      // Así que solo agregamos: /publica/solicitudes
      const response = await fetch(
        `${import.meta.env.VITE_URL_INICIAL_GESTOR}/publica/solicitudes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        let errorText = "Error desconocido";
        try {
            const errJson = await response.json();
            errorText = errJson.mensaje || errJson.error || JSON.stringify(errJson);
        } catch(e) {
            errorText = await response.text();
        }
        throw new Error(errorText);
      }

      toast.success("¡Reporte enviado!", {
        id: toastId,
        description: "Gracias por ayudarnos a mantener la calidad.",
        duration: 3000,
      });

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo enviar", {
        id: toastId,
        description: error.message || "Inténtalo de nuevo más tarde.",
      });
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <FondoChill />
        <div className="relative z-10 animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-t-2 border-b-2 border-red-500 rounded-full animate-spin mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative transition-colors duration-500 font-sans text-gray-800 dark:text-gray-100 flex items-center justify-center p-4 pt-24 pb-20">
      <FondoChill />
      <Toaster richColors position="top-right" />

      <div className={cardClass}>
        {/* Header */}
        <div className="mb-8 border-b border-gray-200/50 dark:border-white/10 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
               {/* Icono de alerta */}
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h1 className="text-3xl font-black text-gray-800 dark:text-white">
              Reportar Problema
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 ml-1">
            Ayúdanos a identificar contenido inapropiado.
          </p>
        </div>

        {/* Info del Hecho */}
        <div className="bg-gray-50/80 dark:bg-white/5 rounded-xl p-4 mb-8 border border-gray-200/50 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
              Sobre el hecho
            </span>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 line-clamp-1">
              {hecho?.titulo}
            </h3>
            {/* Aquí mostramos el ID para debug, si ves letras acá, está MAL el link anterior */}
            <span className={`text-xs font-mono ${isNaN(parseInt(idHecho)) ? "text-red-500 font-bold" : "text-gray-500"}`}>
              ID RECIBIDO: {idHecho}
            </span>
          </div>
        </div>

        {/* Formulario */}
        <div className="space-y-6">
          <div>
            <label className={labelClass}>
              Motivo del reporte <span className="text-red-500">*</span>
            </label>
            <textarea
              className={inputClass}
              rows="5"
              placeholder="Ej: La ubicación es incorrecta, contenido ofensivo..."
              value={descripcionReporte}
              onChange={(e) => setDescripcionReporte(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => navigate(-1)}
              disabled={enviando}
              className="flex-1 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={enviarReporte}
              disabled={enviando || !descripcionReporte.trim()}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {enviando ? "Enviando..." : "Enviar Reporte"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaReporte;