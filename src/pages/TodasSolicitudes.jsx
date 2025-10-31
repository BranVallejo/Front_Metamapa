import React, { useState, useEffect } from "react";

const ModuloSolicitudesAdmin = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(null);

  const API_BASE_URL = "http://localhost:8500/gestordatos/publica";

  // Cargar solicitudes pendientes
  const cargarSolicitudes = async () => {
    try {
      setCargando(true);
      const response = await fetch(`${API_BASE_URL}/solicitudes/pendientes`);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Solicitudes cargadas:", data);
      setSolicitudes(data);
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
      alert("Error al cargar las solicitudes");
    } finally {
      setCargando(false);
    }
  };

  // Cargar solicitudes al inicio
  useEffect(() => {
    cargarSolicitudes();
  }, []);

  // Procesar solicitud (aceptar o rechazar) - CORREGIDO para usar ID de solicitud
  const procesarSolicitud = async (solicitudId, accion) => {
    try {
      setProcesando(solicitudId);

      // CORRECCIÓN: Usar el ID de la solicitud en lugar del ID del hecho
      const endpoint = `${API_BASE_URL}/solicitudes/${accion}?id=${solicitudId}`;

      console.log(`📤 Enviando solicitud a: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📥 Status de respuesta:", response.status);
      console.log("📥 OK:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("❌ Error response:", errorText);
        throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
      }

      const resultado = await response.json();
      console.log(`✅ Solicitud ${accion}da:`, resultado);

      // Recargar la lista de solicitudes
      await cargarSolicitudes();

      alert(
        `Solicitud ${
          accion === "aceptar" ? "aceptada" : "rechazada"
        } correctamente`
      );
    } catch (error) {
      console.error(`❌ Error al ${accion} solicitud:`, error);
      alert(`Error al ${accion} la solicitud: ${error.message}`);
    } finally {
      setProcesando(null);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Gestión de Solicitudes
              </h1>
              <p className="text-gray-600 mt-1">
                Revisa y gestiona las solicitudes de reporte pendientes
              </p>
            </div>
            <button
              onClick={cargarSolicitudes}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualizar
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-600">Por Revisar</h3>
            <p className="text-2xl font-bold text-gray-800">
              {solicitudes.length}
            </p>
          </div>
        </div>

        {/* Lista de Solicitudes */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Solicitudes Pendientes
            </h2>
          </div>

          {solicitudes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No hay solicitudes pendientes
              </h3>
              <p className="text-gray-500">
                Todas las solicitudes han sido procesadas.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {solicitudes.map((solicitud) => (
                <div
                  key={solicitud.id} // Usar el ID de la solicitud como key
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {solicitud.estado}
                        </span>
                        <span className="text-sm text-gray-500">
                          Solicitud ID: {solicitud.id}
                        </span>
                        <span className="text-sm text-gray-500">
                          Hecho ID: {solicitud.idHechoAsociado}
                        </span>
                      </div>

                      <p className="text-gray-800 mb-3">
                        {solicitud.justificacion}
                      </p>

                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Recibida recientemente
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={
                        () => procesarSolicitud(solicitud.id, "aceptar") // Usar solicitud.id en lugar de idHechoAsociado
                      }
                      disabled={procesando === solicitud.id}
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {procesando === solicitud.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Aceptar
                        </>
                      )}
                    </button>

                    <button
                      onClick={
                        () => procesarSolicitud(solicitud.id, "rechazar") // Usar solicitud.id en lugar de idHechoAsociado
                      }
                      disabled={procesando === solicitud.id}
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {procesando === solicitud.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Rechazar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuloSolicitudesAdmin;
