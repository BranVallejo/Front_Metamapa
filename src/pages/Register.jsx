import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    password: "",
    confirmPassword: "",
    fechaNacimiento: "",
    aceptaTerminos: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (!formData.aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones");
      setLoading(false);
      return;
    }

    // Preparar datos para enviar (sin confirmPassword y aceptaTerminos)
    const datosEnvio = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      dni: parseInt(formData.dni),
      fechaNacimiento: formData.fechaNacimiento,
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

        // Guardar token en localStorage
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data));
        }

        alert("¡Registro exitoso! Serás redirigido al mapa.");
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error de red:", error);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card del Registro */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Logo y Título */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-800 mb-2">
                MetaMapa
              </h1>
              <h2 className="text-2xl font-semibold text-gray-800">
                Crear Cuenta
              </h2>
              <p className="text-gray-600 mt-2">
                Únete a nuestra comunidad colaborativa
              </p>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label
                    htmlFor="apellido"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              {/* DNI */}
              <div>
                <label
                  htmlFor="dni"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="12345678"
                  min="1000000"
                  max="99999999"
                />
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label
                  htmlFor="fechaNacimiento"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Fecha de Nacimiento *
                </label>
                <input
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  required
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Email */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="tu@ejemplo.com"
                />
              </div>

              {/* Contraseña */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  minLength="6"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mínimo 6 caracteres
                </p>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="aceptaTerminos"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Acepto los{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Términos de Servicio
                  </a>{" "}
                  y la{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Política de Privacidad
                  </a>
                </label>
              </div>

              {/* Botón de Registro */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-semibold shadow-md ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
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
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-500 font-semibold"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              * Campos obligatorios. Los datos personales se manejan según
              nuestra{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
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
