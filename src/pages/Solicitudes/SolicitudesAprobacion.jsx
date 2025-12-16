import React, { useState, useEffect } from "react";
import { toast } from "sonner";

// --- ICONOS ---
const IconCheck = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M5 13l4 4L19 7"
    />
  </svg>
);
const IconX = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const IconEdit = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);
const IconMapPin = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const IconUser = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const IconRefresh = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);
const IconSend = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const SolicitudesAprobacion = () => {
  const [loading, setLoading] = useState(false);
  const [hechos, setHechos] = useState([]);
  const [procesando, setProcesando] = useState(null);

  const [modoEdicionId, setModoEdicionId] = useState(null);
  const [textoSugerencia, setTextoSugerencia] = useState("");

  const URL_LISTAR = `${
    import.meta.env.VITE_URL_INICIAL_GESTOR
  }/publica/hechos`;
  const URL_ACCIONES = `${
    import.meta.env.VITE_URL_INICIAL_GESTOR
  }/admin/hechos`;

  useEffect(() => {
    cargarHechosPendientes();
  }, []);

  const cargarHechosPendientes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${URL_LISTAR}?estadoDeseado=EN_REVISION`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();

      if (data.hechos && Array.isArray(data.hechos)) {
        setHechos(data.hechos);
      } else {
        setHechos([]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar hechos pendientes");
    } finally {
      setLoading(false);
    }
  };

  const gestionarHecho = async (idHecho, accion, justificacion = "") => {
    const toastId = toast.loading("Procesando...");
    setProcesando(idHecho);

    try {
      const token = localStorage.getItem("token");
      let endpoint = "";
      const params = new URLSearchParams();
      params.append("id", idHecho);

      if (accion === "ACEPTAR") {
        endpoint = `${URL_ACCIONES}/aceptar`;
      } else if (accion === "RECHAZAR") {
        endpoint = `${URL_ACCIONES}/rechazar`;
      } else if (accion === "SUGERENCIA") {
        endpoint = `${URL_ACCIONES}/aceptarSugerencia`;
        params.append("justificacion", justificacion);
      }

      const fullUrl = `${endpoint}?${params.toString()}`;

      // Hacemos el POST
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({}), // Enviamos un body vacío por si Spring lo requiere
      });

      if (!response.ok) {
        // Intentamos leer el mensaje de error del backend
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}`);
      }

      toast.success(`Hecho procesado correctamente`, { id: toastId });

      if (accion === "SUGERENCIA") {
        setModoEdicionId(null);
        setTextoSugerencia("");
      }
      cargarHechosPendientes();
    } catch (error) {
      console.error(error);
      toast.error("Error en el servidor (Ver consola Java)", { id: toastId });
    } finally {
      setProcesando(null);
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-lg p-6 mb-8 border border-white/40 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-white">
            Validación de Hechos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Aprueba, rechaza o sugiere cambios.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full text-sm font-bold text-blue-700 dark:text-blue-300">
            {hechos.length} Pendientes
          </div>
          <button
            onClick={cargarHechosPendientes}
            disabled={loading}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <IconRefresh />
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hechos.map((hecho) => (
            <div
              key={hecho.id}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-block px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-xs font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wide border border-blue-100 dark:border-blue-900/30">
                    {hecho.categoria || "Sin categoría"}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    ID: {hecho.id}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                  {hecho.titulo || "Sin título"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                  {hecho.descripcion}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6 border-t border-gray-200/50 dark:border-gray-700/50 pt-3">
                  <div className="flex items-center gap-1">
                    <IconUser />{" "}
                    <span className="truncate">
                      {hecho.nombre_contribuyente || "Anónimo"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconMapPin />{" "}
                    <span>
                      {parseFloat(hecho.latitud).toFixed(4)},{" "}
                      {parseFloat(hecho.longitud).toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                {modoEdicionId === hecho.id ? (
                  <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-blue-200 dark:border-blue-900/30 animate-fadeIn">
                    <label className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 block">
                      Sugerencia:
                    </label>
                    <textarea
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      rows="2"
                      value={textoSugerencia}
                      onChange={(e) => setTextoSugerencia(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setModoEdicionId(null);
                          setTextoSugerencia("");
                        }}
                        className="flex-1 py-2 text-xs font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() =>
                          gestionarHecho(
                            hecho.id,
                            "SUGERENCIA",
                            textoSugerencia
                          )
                        }
                        className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-1"
                      >
                        <IconSend /> Enviar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => gestionarHecho(hecho.id, "RECHAZAR")}
                      disabled={procesando === hecho.id}
                      className="p-3 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold disabled:opacity-50"
                    >
                      <IconX />
                    </button>
                    <button
                      onClick={() => {
                        setModoEdicionId(hecho.id);
                        setTextoSugerencia("");
                      }}
                      disabled={procesando === hecho.id}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold text-sm disabled:opacity-50"
                    >
                      <IconEdit /> Cambios
                    </button>
                    <button
                      onClick={() => gestionarHecho(hecho.id, "ACEPTAR")}
                      disabled={procesando === hecho.id}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-lg shadow-green-500/20 active:scale-95 disabled:opacity-50"
                    >
                      <IconCheck /> Aprobar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {hechos.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white/40 dark:bg-black/20 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-4xl mb-3 grayscale opacity-50">✅</div>
              <p className="text-gray-500 dark:text-gray-400">
                No hay hechos pendientes.
              </p>
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SolicitudesAprobacion;
