import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// 👇 1. Importamos el fondo
import FondoMapaConectado from "../Components/FondoDinamico/FondoMapaConectado.jsx";
// 👇 2. Importamos Sonner
import { Toaster, toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    password: "",
    confirmPassword: "",
    aceptaTerminos: false,
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [popupWindow, setPopupWindow] = useState(null);

  // Configurar listener para Google OAuth
  useEffect(() => {
    const handleMessage = (event) => {
      console.log("📩 Mensaje recibido en Register:", event.data);

      if (!event.data || !event.data.type) return;

      if (event.data.type === "GOOGLE_LOGIN_SUCCESS") {
        console.log("✅ Google login/registro exitoso desde Register");

        // Guardar token y datos
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

        // Feedback visual
        toast.success("¡Registro con Google exitoso!");

        // Redirigir con pequeño delay para ver el mensaje
        setTimeout(() => {
            navigate("/", { replace: true });
        }, 1500);

      } else if (event.data.type === "GOOGLE_LOGIN_ERROR") {
        console.error("❌ Error Google desde Register:", event.data.error);

        if (popupWindow && !popupWindow.closed) {
          popupWindow.close();
        }

        const msg = "Error con Google: " + event.data.error;
        setError(msg);
        toast.error(msg); // Toast Error
        
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

  // Login con Google
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setError("");
    const toastId = toast.loading("Abriendo Google...");

    console.log("🔵 Iniciando Google Login desde Register...");

    const baseUrl =
      import.meta.env.VITE_URL_INICIAL_GESTOR ||
      "http://localhost:8500/gestordatos";
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
      toast.warning(msg);
      setGoogleLoading(false);
      return;
    }

    toast.dismiss(toastId);
    setPopupWindow(popup);

    setTimeout(() => {
      if (googleLoading) {
        console.log("⏰ Timeout - cerrando popup desde Register");
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

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      const msg = "Las contraseñas no coinciden";
      setError(msg);
      toast.warning(msg); // Toast Warning
      setLoading(false);
      return;
    }

    if (!formData.aceptaTerminos) {
      const msg = "Debes aceptar los términos y condiciones";
      setError(msg);
      toast.warning(msg); // Toast Warning
      setLoading(false);
      return;
    }

    // Toast de carga
    const toastId = toast.loading("Creando tu cuenta...");

    const datosEnvio = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      dni: parseInt(formData.dni),
      email: formData.email,
      password: formData.password,
    };

    console.log("Datos de registro:", datosEnvio);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL_INICIAL_GESTOR}/contribuyentes/registrarse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosEnvio),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Registro exitoso:", data);

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data));
        }

        // Éxito
        toast.success("¡Registro exitoso! Bienvenido.", { id: toastId });
        
        setTimeout(() => {
            navigate("/");
        }, 1500);

      } else {
        const errorData = await response.json();
        let errorMessage = errorData.mensaje || "Error en el registro";

        if (errorMessage.startsWith("Error inesperado: ")) {
          errorMessage = errorMessage.replace("Error inesperado: ", "");
        }

        setError(errorMessage);
        toast.error(errorMessage, { id: toastId }); // Error del back
      }
    } catch (error) {
      console.error("Error de red:", error);
      const msg = "Error de conexión. Intenta nuevamente.";
      setError(msg);
      toast.error(msg, { id: toastId }); // Error de red
    } finally {
      setLoading(false);
    }
  };

  return (
    // Contenedor principal con relative y overflow-hidden para el fondo
    <div className="min-h-screen relative overflow-hidden transition-colors duration-300">
      
      {/* 2. COMPONENTE TOASTER */}
      <Toaster richColors position="top-right" />

      {/* FONDO DINÁMICO */}
      <FondoMapaConectado />

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          
          {/* ✨ GLASS FACHERO (Card del Registro) ✨ */}
          <div className="
            backdrop-blur-xl 
            bg-white/30 dark:bg-black/50 
            rounded-2xl shadow-2xl p-8 
            border border-white/40 dark:border-gray-700/50
            transition-all duration-300
          ">
            
            {/* Logo y Título */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-300 mb-2 drop-shadow-sm">
                MetaMapa
              </h1>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Crear Cuenta
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mt-2 font-medium">
                Únete a nuestra comunidad colaborativa
              </p>
            </div>

            {/* Mensaje de error en caja */}
            {error && (
              <div className="mb-4 p-3 bg-red-100/90 border border-red-400 text-red-800 rounded-lg backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* 🔐 BOTÓN GOOGLE */}
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
                    <svg
                      className="w-5 h-5 text-blue-600 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-blue-800 font-medium">
                      Completa el registro en la ventana emergente...
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
                  O regístrate con tus datos
                </span>
              </div>
            </div>

            {/* Formulario normal */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
                  >
                    Nombre *
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300/60 dark:border-gray-600/60 rounded-lg bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all"
                    placeholder="Tu nombre"
                    disabled={loading || googleLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="apellido"
                    className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
                  >
                    Apellido *
                  </label>
                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    required
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300/60 dark:border-gray-600/60 rounded-lg bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all"
                    placeholder="Tu apellido"
                    disabled={loading || googleLoading}
                  />
                </div>
              </div>

              {/* DNI */}
              <div>
                <label
                  htmlFor="dni"
                  className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
                >
                  DNI *
                </label>
                <input
                  id="dni"
                  name="dni"
                  type="number"
                  required
                  value={formData.dni}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300/60 dark:border-gray-600/60 rounded-lg bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all"
                  placeholder="Tu número de documento"
                  disabled={loading || googleLoading}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
                >
                  Correo Electrónico *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300/60 dark:border-gray-600/60 rounded-lg bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all"
                  placeholder="tu@ejemplo.com"
                  disabled={loading || googleLoading}
                />
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
                >
                  Contraseña *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300/60 dark:border-gray-600/60 rounded-lg bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all"
                  placeholder="••••••••"
                  minLength="6"
                  disabled={loading || googleLoading}
                />
                <p className="mt-1 text-xs text-gray-700 dark:text-gray-400 font-medium">
                  Mínimo 6 caracteres
                </p>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2"
                >
                  Confirmar Contraseña *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300/60 dark:border-gray-600/60 rounded-lg bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all"
                  placeholder="••••••••"
                  disabled={loading || googleLoading}
                />
              </div>

              {/* Términos y Condiciones */}
              <div className="flex items-center">
                <input
                  id="aceptaTerminos"
                  name="aceptaTerminos"
                  type="checkbox"
                  required
                  checked={formData.aceptaTerminos}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white/60"
                  disabled={loading || googleLoading}
                />
                <label
                  htmlFor="aceptaTerminos"
                  className="ml-2 block text-sm text-gray-800 dark:text-gray-200"
                >
                  Acepto los{" "}
                  <a
                    href="#"
                    className="text-blue-700 dark:text-blue-300 hover:text-blue-500 font-bold"
                  >
                    Términos de Servicio
                  </a>{" "}
                  y la{" "}
                  <a
                    href="#"
                    className="text-blue-700 dark:text-blue-300 hover:text-blue-500 font-bold"
                  >
                    Política de Privacidad
                  </a>
                </label>
              </div>

              {/* Botón de Registro */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className={`w-full py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-semibold shadow-md backdrop-blur-sm ${
                  loading || googleLoading
                    ? "bg-gray-400/80 cursor-not-allowed text-white"
                    : "bg-blue-600/90 hover:bg-blue-700/90 hover:shadow-lg text-white"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
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
                    Registrando...
                  </div>
                ) : (
                  "Crear Cuenta"
                )}
              </button>
            </form>

            {/* Enlace a Login */}
            <div className="mt-8 text-center border-t border-gray-300/50 dark:border-gray-600/50 pt-4">
              <p className="text-gray-800 dark:text-gray-300">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="text-blue-700 dark:text-blue-300 hover:text-blue-500 font-bold hover:underline"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-8 text-center relative z-20">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium px-4 py-2 rounded-lg bg-white/30 dark:bg-black/30 backdrop-blur-md inline-block">
              * Campos obligatorios. Los datos personales se manejan según
              nuestra{" "}
              <a href="#" className="text-blue-700 dark:text-blue-300 hover:text-blue-500 font-bold underline">
                Política de Privacidad
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;