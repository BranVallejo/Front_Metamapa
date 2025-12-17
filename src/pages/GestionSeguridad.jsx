import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";

// Componentes visuales
import FondoChill from "../Components/FondoDinamico/FondoChill";

// --- ICONOS ---
const IconShield = () => (
  <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const IconLock = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const GestionSeguridad = () => {
  const [ips, setIps] = useState([]);
  const [ipInput, setIpInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [procesando, setProcesando] = useState(false);

  // Endpoint base
  const API_URL = `${import.meta.env.VITE_URL_INICIAL_GESTOR}/getaway`;

  useEffect(() => {
    cargarIps();
  }, []);

  const cargarIps = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      
      if (!res.ok) throw new Error("Error al cargar IPs");
      
      const data = await res.json();
      setIps(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron cargar las direcciones IP");
    } finally {
      setLoading(false);
    }
  };

  const bloquearIp = async (e) => {
    e.preventDefault();
    
    // Validación simple de formato IPv4
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ipInput)) {
      toast.error("Formato de IP inválido (Ej: 192.168.1.1)");
      return;
    }

    setProcesando(true);
    const toastId = toast.loading("Bloqueando acceso...");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ direccion: ipInput }), 
      });

      if (!res.ok) throw new Error("Error al bloquear IP");

      toast.success(`IP ${ipInput} bloqueada correctamente`, { id: toastId });
      setIpInput("");
      cargarIps();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la regla", { id: toastId });
    } finally {
      setProcesando(false);
    }
  };

  const eliminarRegla = async (id) => {
    if (!confirm("¿Desbloquear esta dirección IP?")) return;

    const toastId = toast.loading("Desbloqueando...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      if (!res.ok) throw new Error("Error al eliminar regla");

      toast.success("IP desbloqueada", { id: toastId });
      setIps((prev) => prev.filter((ip) => ip.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("No se pudo desbloquear", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen relative text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300">
      <FondoChill />
      <Toaster richColors position="top-right" />

      {/* 👇 AQUÍ ESTÁ EL CAMBIO: Agregué pt-32 (padding-top) para bajarlo */}
      <div className="relative z-10 pt-32 pb-20 px-4 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-lg p-8 mb-8 border border-white/40 dark:border-white/10 flex items-center gap-6">
          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-2xl">
            <IconShield />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              Centro de Seguridad
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Administración de lista negra y bloqueo de accesos por IP.
            </p>
          </div>
        </div>

        {/* Panel de Control */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Columna Izquierda: Formulario */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <IconLock /> Bloquear Nueva IP
            </h2>
            <form onSubmit={bloquearIp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Dirección IP</label>
                <input
                  type="text"
                  placeholder="Ej: 192.168.0.1"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-red-500 outline-none font-mono text-sm"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={!ipInput || procesando}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {procesando ? "Procesando..." : "Bloquear Acceso"}
              </button>
            </form>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
              <p className="text-xs text-yellow-700 dark:text-yellow-500">
                ⚠️ Las IPs bloqueadas perderán acceso inmediato a la API pública.
              </p>
            </div>
          </div>

          {/* Columna Derecha: Lista */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">IPs Bloqueadas</h2>
              <span className="text-xs font-bold px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                Total: {ips.length}
              </span>
            </div>

            {loading ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : ips.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
                <div className="text-4xl mb-2">🛡️</div>
                <p className="text-sm">No hay restricciones activas.</p>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                {ips.map((ip) => (
                  <div
                    key={ip.id}
                    className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-700/50 group hover:border-red-200 dark:hover:border-red-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                      <div>
                        {/* Ajustar si tu back devuelve 'ip' o 'direccion' */}
                        <p className="font-mono text-sm font-bold">{ip.direccion || ip.ip}</p>
                        <p className="text-[10px] text-gray-400">ID: {ip.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarRegla(ip.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Desbloquear"
                    >
                      <IconTrash />
                    </button>
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

export default GestionSeguridad;