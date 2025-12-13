import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// 👇 1. Importamos el fondo
import FondoMapaConectado from "../Components/FondoDinamico/FondoMapaConectado.jsx";
// 👇 2. Importamos Sonner
import { Toaster, toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [popupWindow, setPopupWindow] = useState(null);

  // Configurar listener una sola vez
  useEffect(() => {
    const handleMessage = (event) => {
      console.log("📩 Mensaje recibido:", event.data);

      if (!event.data || !event.data.type) return;

      if (event.data.type === "GOOGLE_LOGIN_SUCCESS") {
        console.log("✅ Google login exitoso");

        localStorage.setItem("token", event.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: event.data.email,
            userId: event.data.userId,
            nombre: event.data.nombre,
            apellido: event.data.apellido,
            rol: event.data.rol,
          })
        );

        if (popupWindow && !popupWindow.closed) {
          popupWindow.close();
        }

        setGoogleLoading(false);
        setPopupWindow(null);

        // Notificación de éxito
        toast.success("¡Login con Google exitoso!");

        // Pequeño delay para que se vea el toast antes de irse
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);

      } else if (event.data.type === "GOOGLE_LOGIN_ERROR") {
        console.error("❌ Error Google:", event.data.error);

        if (popupWindow && !popupWindow.closed) {
          popupWindow.close();
        }

        const msgError = "Error Google: " + event.data.error;
        setError(msgError);
        toast.error(msgError); // Toast de error
        
        setGoogleLoading(false);
        setPopupWindow(null);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
      }
    };
  }, [navigate, popupWindow]);

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setError("");
    const toastId = toast.loading("Abriendo Google...");

    console.log("🔵 Iniciando Google Login...");

    const baseUrl =
      import.meta.env.VITE_URL_INICIAL_GESTOR ||
      "http://localhost:8080/gestordatos";
    const googleAuthUrl = `${baseUrl}/contribuyentes/google`;

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      googleAuthUrl,
      "Google Login",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );

    if (!popup) {
      toast.dismiss(toastId);
      const msg = "¡Permite ventanas emergentes para Google Login!";
      setError(msg);
      toast.warning(msg); // Toast de advertencia
      setGoogleLoading(false);
      return;
    }

    toast.dismiss(toastId);
    setPopupWindow(popup);

    setTimeout(() => {
      if (googleLoading) {
        console.log("⏰ Timeout - cerrando popup");
        if (popup && !popup.closed) {
          popup.close();
        }
        const msg = "Tiempo agotado. Intenta nuevamente.";
        setError(msg);
        toast.error(msg);
        setGoogleLoading(false);
        setPopupWindow(null);
      }
    }, 120000);
  };

  const handleNormalLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const toastId = toast.loading("Iniciando sesión...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL_INICIAL_GESTOR}/contribuyentes/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        
        toast.success("¡Bienvenido a MetaMapa!", { id: toastId });

        setTimeout(() => {
            navigate("/");
        }, 1500);

      } else {
        const msg = "Email o contraseña incorrectos";
        setError(msg);
        toast.error(msg, { id: toastId });
      }
    } catch (error) {
      console.error("Error de login:", error);
      const msg = "Error de conexión con el servidor";
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  return (
    // Quitamos bg-gray-50/900 sólido para asegurar que el fondo del mapa predomine si hay gaps
    <div className="min-h-screen relative overflow-hidden transition-colors duration-300">
      
      {/* 👇 3. TOASTER DE SONNER */}
      <Toaster richColors position="top-right" />

      <FondoMapaConectado />

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          
          {/* ✨ AQUÍ ESTÁ EL EFECTO GLASS FACHERO ✨ */}
          <div className="
            backdrop-blur-xl 
            bg-white/30 dark:bg-black/50 
            rounded-2xl shadow-2xl p-8 
            border border-white/40 dark:border-gray-700/50
            transition-all duration-300
          ">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-300 mb-2 drop-shadow-sm">
                MetaMapa
              </h1>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Iniciar Sesión
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mt-2 font-medium">Accede a tu cuenta</p>
            </div>

            {/* Error en caja */}
            {error && (
              <div className="mb-4 p-3 bg-red-100/90 border border-red-400 text-red-800 rounded-lg backdrop-blur-sm">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Botón Google */}
            <div className="mb-6">
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-white/50 dark:border-gray-600 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/80 font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-white/70 dark:bg-gray-800/60 text-gray-800 dark:text-gray-100 transition-all backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                {googleLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-white"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuar con Google
                  </>
                )}
              </button>

              {googleLoading && (
                <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center">
                    <span className="text-sm text-blue-800 font-medium">
                      Completa el login en la ventana emergente...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Separador */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-400/50 dark:border-gray-500/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-700 dark:text-gray-300 font-medium bg-opacity-0 backdrop-blur-md rounded">
                  O ingresa con email
                </span>
              </div>
            </div>

            {/* Formulario normal */}
            <form onSubmit={handleNormalLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  // Inputs semitransparentes para seguir el estilo glass
                  className="w-full px-3 py-2 border border-gray-300/60 dark:border-gray-600/60 rounded-lg bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 backdrop-blur-sm transition-all"
                  required
                  disabled={loading || googleLoading}
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300/60 dark:border-gray-600/60 rounded-lg bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all"
                  required
                  disabled={loading || googleLoading}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 bg-white/60"
                  disabled={loading || googleLoading}
                />
                <label className="ml-2 text-sm text-gray-800 dark:text-gray-200 font-medium">Recordarme</label>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-2 px-4 bg-blue-600/90 hover:bg-blue-700/90 text-white font-semibold rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 transition-all backdrop-blur-sm"
              >
                {loading ? "Iniciando..." : "Iniciar Sesión"}
              </button>
            </form>

            {/* Link a registro */}
            <div className="mt-6 pt-4 border-t border-gray-300/50 dark:border-gray-600/50 text-center">
              <p className="text-gray-800 dark:text-gray-300">
                ¿No tienes cuenta?{" "}
                <Link to="/register" className="text-blue-700 dark:text-blue-300 font-bold hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>

            {/* Debug con Toast */}
            <div className="mt-4 pt-4 border-t border-gray-300/50 dark:border-gray-600/50">
              <button
                onClick={() => {
                  const token = localStorage.getItem("token");
                  if (token) {
                    toast.success("✅ Hay token almacenado");
                  } else {
                    toast.error("❌ No hay token almacenado");
                  }
                }}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
              >
                Verificar token
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;