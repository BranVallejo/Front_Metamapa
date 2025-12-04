import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  // Refs para mantener estado entre renders
  const popupRef = useRef(null);
  const messageHandlerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Configurar el listener de mensajes una sola vez al montar el componente
  useEffect(() => {
    console.log(
      "🎯 Configurando listener global de mensajes para Google OAuth"
    );

    messageHandlerRef.current = (event) => {
      console.log("📨 Mensaje recibido en listener global:", {
        data: event.data,
        origin: event.origin,
      });

      // Aceptar mensajes de cualquier origen (el HTML viene del backend)
      if (event.data && event.data.type === "GOOGLE_LOGIN_SUCCESS") {
        console.log("✅ Login Google exitoso recibido:", event.data);

        // Guardar en localStorage
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

        console.log("💾 Token guardado en localStorage");

        // Limpiar timeout si existe
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // No intentamos cerrar el popup aquí - el backend lo hará automáticamente
        // Solo limpiamos la referencia
        popupRef.current = null;

        // Redirigir y mostrar mensaje
        setTimeout(() => {
          alert("¡Inicio de sesión con Google exitoso!");
          navigate("/", { replace: true });
        }, 100);

        setGoogleLoading(false);
      } else if (event.data && event.data.type === "GOOGLE_LOGIN_ERROR") {
        console.error("❌ Error en login Google recibido:", event.data.error);

        // Limpiar timeout si existe
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Limpiar referencia del popup
        popupRef.current = null;

        setError(`Error en Google Login: ${event.data.error}`);
        setGoogleLoading(false);
      }
    };

    // Agregar listener
    window.addEventListener("message", messageHandlerRef.current);
    console.log("👂 Listener de mensajes activado");

    // Limpiar al desmontar
    return () => {
      console.log("🧹 Limpiando recursos del componente Login");
      if (messageHandlerRef.current) {
        window.removeEventListener("message", messageHandlerRef.current);
      }
      // Limpiar timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [navigate]);

  // 🔐 FUNCIÓN simplificada para login con Google
  const loginWithGoogle = () => {
    setGoogleLoading(true);
    setError("");
    console.log("🟢 Iniciando login con Google...");

    const baseUrl =
      import.meta.env.VITE_URL_INICIAL_GESTOR ||
      "http://localhost:8500/gestordatos";
    const googleAuthUrl = `${baseUrl}/contribuyentes/google`;

    console.log("🔗 URL del backend:", googleAuthUrl);
    console.log("📍 URL actual del frontend:", window.location.origin);

    // Configurar popup
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    try {
      // Limpiar timeout anterior si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Abrir popup - IMPORTANTE: agregar `noopener` para evitar problemas de seguridad
      const popup = window.open(
        googleAuthUrl,
        "Google Login",
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      if (!popup) {
        console.error(
          "❌ No se pudo abrir el popup - Probablemente bloqueado por el navegador"
        );
        setError("Por favor, permite ventanas emergentes para Google Login");
        setGoogleLoading(false);
        return;
      }

      popupRef.current = popup;
      console.log("✅ Popup abierto correctamente");

      // Configurar timeout para detectar si el usuario canceló
      timeoutRef.current = setTimeout(() => {
        // Si después de 2 minutos aún está cargando y no recibimos mensaje
        // asumimos que el usuario canceló o hubo un error
        if (googleLoading) {
          console.log("⏰ Timeout de 2 minutos: asumiendo cancelación");
          setError("Tiempo de espera agotado o inicio de sesión cancelado");
          setGoogleLoading(false);
          popupRef.current = null;
        }
      }, 120000); // 2 minutos
    } catch (error) {
      console.error("💥 Error en loginWithGoogle:", error);
      setError("Error al iniciar sesión con Google: " + error.message);
      setGoogleLoading(false);

      // Limpiar timeout en caso de error
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
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

    const datosEnvio = {
      email: formData.email,
      password: formData.password,
    };

    console.log("📤 Enviando datos de login normal:", datosEnvio);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL_INICIAL_GESTOR}/contribuyentes/login`,
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
        console.log("✅ Login normal exitoso:", data);

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data));
          console.log("💾 Token de login normal guardado");
        }

        alert("¡Inicio de sesión exitoso!");
        navigate("/");
      } else {
        const errorText = await response.text();
        console.error("❌ Error en login normal:", errorText);
        setError(errorText || "Credenciales inválidas");
      }
    } catch (error) {
      console.error("💥 Error de red:", error);
      setError("Error de conexión. Verifica que el servidor esté funcionando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Logo y Título */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-800 mb-2">
                MetaMapa
              </h1>
              <h2 className="text-2xl font-semibold text-gray-800">
                Iniciar Sesión
              </h2>
              <p className="text-gray-600 mt-2">
                Accede a tu cuenta para continuar
              </p>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
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

            {/* 🔐 BOTÓN GOOGLE OAUTH */}
            <div className="mb-6">
              <button
                type="button"
                onClick={loginWithGoogle}
                disabled={googleLoading || loading}
                className={`w-full flex items-center justify-center gap-3 py-3 px-4 border rounded-lg transition-all font-medium shadow-sm ${
                  googleLoading || loading
                    ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700 hover:shadow-md hover:border-gray-400 active:scale-[0.98]"
                }`}
              >
                {googleLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-gray-500"
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
                    Procesando con Google...
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

              {/* Nota sobre popup */}
              {googleLoading && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">
                        Se abrirá una ventana emergente
                      </p>
                      <p className="mt-1">
                        Completa el inicio de sesión en la ventana emergente de
                        Google.
                      </p>
                      <p className="mt-1 text-xs">
                        La ventana se cerrará automáticamente al finalizar.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Separador */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  O ingresa con tus credenciales
                </span>
              </div>
            </div>

            {/* Formulario de login normal */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                  placeholder="ejemplo@correo.com"
                  disabled={loading || googleLoading}
                />
              </div>

              {/* Campo Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                  placeholder="••••••••"
                  disabled={loading || googleLoading}
                />
              </div>

              {/* Recordarme y Olvidé contraseña */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={loading || googleLoading}
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Recordarme
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setError("Función no implementada aún")}
                    className="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400"
                    disabled={loading || googleLoading}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>

              {/* Botón de Login normal */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className={`w-full py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-semibold shadow-md ${
                  loading || googleLoading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:scale-[0.98]"
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
                    Iniciando sesión...
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>

            {/* Enlace a Registro */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Al registrarte aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Al iniciar sesión, aceptas nuestros{" "}
              <button
                type="button"
                onClick={() => setError("Términos de servicio no disponibles")}
                className="text-blue-600 hover:text-blue-500 underline"
              >
                Términos de Servicio
              </button>{" "}
              y{" "}
              <button
                type="button"
                onClick={() => setError("Política de privacidad no disponible")}
                className="text-blue-600 hover:text-blue-500 underline"
              >
                Política de Privacidad
              </button>
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => {
                  console.log("🔍 DEBUG: Verificar localStorage");
                  const token = localStorage.getItem("token");
                  const user = localStorage.getItem("user");
                  console.log(
                    "Token:",
                    token ? `${token.substring(0, 20)}...` : "No hay token"
                  );
                  console.log(
                    "User:",
                    user ? JSON.parse(user) : "No hay usuario"
                  );
                }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Verificar estado
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.clear();
                  console.log("🧹 localStorage limpiado");
                  setError("Sesión limpiada. Vuelve a intentar.");
                }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Limpiar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
