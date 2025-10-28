import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    fechaNacimiento: "",
    aceptaTerminos: false,
  });

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos de registro:", formData);
    // Aquí iría la lógica de registro
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
                    Apellido
                  </label>
                  <input
                    id="apellido"
                    name="apellido"
                    type="text"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label
                  htmlFor="fechaNacimiento"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Fecha de Nacimiento
                </label>
                <input
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
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
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mínimo 8 caracteres con letras y números
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
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-semibold shadow-md"
              >
                Crear Cuenta
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
