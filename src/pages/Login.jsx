import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos de login:", formData);
    // Aquí iría la lógica de autenticación
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card del Login */}
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

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Correo Electrónico
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

              {/* Campo Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contraseña
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
              </div>

              {/* Recordarme y Olvidé contraseña */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Recordarme
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              {/* Botón de Login */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-semibold shadow-md"
              >
                Iniciar Sesión
              </button>
            </form>

            {/* Enlace a Registro */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-500 font-semibold"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Al iniciar sesión, aceptas nuestros{" "}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Términos de Servicio
              </a>{" "}
              y{" "}
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

export default Login;
