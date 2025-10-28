// src/pages/Header.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // 1. IMPORTAR LINK

const ProfessionalHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      setUserMenuOpen(false);
    };
    if (userMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleUserMenuClick = (e) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <header className="w-full bg-white shadow-md border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Enlaza a la página principal */}
          <div className="flex-shrink-0">
            {/* 2. CAMBIADO DE <a> A <Link> */}
            <Link
              to="/"
              className="text-2xl font-bold text-blue-800 hover:text-blue-600 transition-colors duration-200"
            >
              MetaMapa
            </Link>
          </div>

          {/* Botón Central - Centrado exacto */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            {/* 3. CAMBIADO DE <button> A <Link> */}
            <Link
              to="/hechos/nuevo"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 border border-gray-300 hover:border-gray-400 hover:shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Reportar Hechos</span>
            </Link>
          </div>

          {/* Navegación Derecha */}
          <div className="flex-shrink-0 flex justify-end">
            {!isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {/* Botón Iniciar Sesión - Enlaza a /login */}
                {/* 4. CAMBIADO DE <a> A <Link> */}
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 border border-gray-300 hover:border-blue-600 py-2 px-4 rounded-lg"
                >
                  Iniciar Sesión
                </Link>
                {/* Botón Registrarse - Enlaza a /register */}
                {/* 5. CAMBIADO DE <a> A <Link> */}
                <Link
                  to="/register"
                  className="bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-2 border-black"
                >
                  Registrarse
                </Link>
              </div>
            ) : (
              // (El resto de tu lógica de menú de usuario queda igual)
              <div className="relative">
                <button
                  onClick={handleUserMenuClick}
                  className="flex items-center space-x-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 transition-all duration-200 hover:shadow-md"
                >
                  {/* ... (contenido del botón de usuario) ... */}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-300 py-2 z-50">
                    {/* ... (contenido del menú desplegable) ... */}
                    {/* NOTA: Los <a> aquí adentro pueden quedar como <a> si son links externos
                        o si son para acciones, pero si navegan a rutas de tu app
                        (como "Mi Perfil"), también deberían ser <Link> */}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfessionalHeader;