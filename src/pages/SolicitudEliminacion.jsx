import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// 1. IMPORTAMOS SONNER
import { Toaster, toast } from "sonner";

const PaginaReporte = () => {
  const { idHecho } = useParams();
  const navigate = useNavigate();

  const [hecho, setHecho] = useState(null);
  const [descripcionReporte, setDescripcionReporte] = useState("");
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Cargar información del hecho
  useEffect(() => {
    cargarHecho();
  }, [idHecho]);

  const cargarHecho = async () => {
    try {
      setCargando(true);

      // Simulación de carga de datos (puedes descomentar tu fetch real aquí si lo tienes)
      const hechoSimulado = {
        id: idHecho,
        titulo: "Hecho sobre condiciones climáticas",
        categoria: "vientos fuertes",
        descripcion: "Evento meteorológico registrado en la zona",
        fechaAcontecimiento: new Date().toISOString(),
        latitud: -34.6037,
        longitud: -58.3816,
      };

      setHecho(hechoSimulado);
    } catch (error) {
      console.error("Error cargando hecho:", error);
      toast.error("Error al cargar la información del hecho");
    } finally {
      setCargando(false);
    }
  };

  const enviarReporte = async () => {
    if (!descripcionReporte.trim()) {
      toast.warning("Falta información", {
        description:
          "Por favor, describe el motivo de tu reporte antes de enviar.",
      });
      return;
    }

    setEnviando(true);

    // Mostrar toast de carga y guardar la función para cerrarlo
    const dismiss = toast.loading("Enviando reporte...");

    try {
      const idHechoNumerico = parseInt(idHecho);

      if (isNaN(idHechoNumerico)) {
        throw new Error("ID del hecho no es un número válido");
      }

      const userData = JSON.parse(localStorage.getItem("user"));

      const requestBody = {
        idhecho: idHechoNumerico,
        justificacion: descripcionReporte.trim(),
        usuarioId: userData.userId,
      };

      const response = await fetch(
        "http://localhost:8500/gestordatos/publica/solicitudes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const resultado = await response.json();
      console.log("Reporte enviado:", resultado);

      // Cerrar el toast de carga
      toast.dismiss(dismiss);

      // Mostrar éxito
      toast.success("Reporte enviado correctamente", {
        description: "Gracias por tu colaboración.",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error enviando reporte:", error);

      // Cerrar el toast de carga
      toast.dismiss(dismiss);

      // Mostrar el error
      toast.error("No se pudo enviar el reporte", {
        description: error.message,
      });
    } finally {
      setEnviando(false);
    }
  };

  const cancelarReporte = () => {
    navigate("/mapa");
  };

  if (cargando) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Cargando información del hecho...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* 2. TOASTER DE SONNER */}
      <Toaster richColors position="top-right" />

      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Reportar Hecho
          </h1>
          <p className="text-gray-600">
            Por favor, describe el motivo de tu reporte.
          </p>
        </div>

        {/* Información del Hecho */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Información del Hecho
          </h2>

          {hecho ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">ID:</span>
                <span className="text-gray-800 font-mono">{idHecho}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Título:</span>
                <span className="text-gray-800">{hecho.titulo}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Categoría:</span>
                <span className="text-gray-800 capitalize">
                  {hecho.categoria}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Fecha:</span>
                <span className="text-gray-800">
                  {hecho.fechaAcontecimiento
                    ? new Date(hecho.fechaAcontecimiento).toLocaleDateString(
                        "es-AR"
                      )
                    : "No especificada"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Ubicación:</span>
                <span className="text-gray-800">
                  {hecho.latitud && hecho.longitud
                    ? `${hecho.latitud.toFixed(4)}, ${hecho.longitud.toFixed(
                        4
                      )}`
                    : "No especificada"}
                </span>
              </div>

              {hecho.descripcion && (
                <div>
                  <span className="text-gray-600 font-medium block mb-2">
                    Descripción:
                  </span>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-md text-sm">
                    {hecho.descripcion}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No se pudo cargar la información del hecho.
            </p>
          )}
        </div>

        {/* Formulario de Reporte */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Motivo del Reporte
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Justificación del reporte *
            </label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows="6"
              placeholder="Ejemplo: Información incorrecta, contenido duplicado, datos desactualizados, ubicación errónea, etc."
              value={descripcionReporte}
              onChange={(e) => setDescripcionReporte(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-2">
              * Este campo es obligatorio. Proporciona la mayor cantidad de
              detalles posible.
            </p>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-blue-800">
                  ¿Por qué reportar?
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  Tu reporte nos ayuda a mantener la calidad y precisión de la
                  información en el mapa. Revisaremos tu solicitud y tomaremos
                  las acciones necesarias.
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              onClick={cancelarReporte}
              disabled={enviando}
              className="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={enviarReporte}
              disabled={enviando || !descripcionReporte.trim()}
              className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              {enviando ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                "Confirmar Reporte"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaReporte;
