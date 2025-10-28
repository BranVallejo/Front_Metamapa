// src/pages/Header.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ThemeToggle from "../Components/ThemeToggle";

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
    // 👇 2. CLASES DARK: AGREGADAS AL HEADER
    <header className="w-full bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Enlaza a la página principal */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              // 👇 CLASES DARK:
              className="text-2xl font-bold text-blue-800 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200"
            >
              MetaMapa
            </Link>
          </div>

          {/* Botón Central - Centrado exacto */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/hechos/nuevo"
              // 👇 CLASES DARK:
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium py-2 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 border border-gray-300 dark:border-gray-600 hover:border-gray-400 hover:shadow-sm"
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
          {/* 👇 3. AGREGADO 'items-center' Y 'space-x-4' PARA ALINEAR EL BOTÓN */}
          <div className="flex-shrink-0 flex justify-end items-center space-x-4">
            
            {/* 4. BOTÓN DE MODO OSCURO AGREGADO */}
            <ThemeToggle />

            {!isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {/* Botón Iniciar Sesión */}
                <Link
                  to="/login"
                  // 👇 CLASES DARK:
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 hover:scale-105 border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 py-2 px-4 rounded-lg"
                >
                  Iniciar Sesión
                </Link>
                {/* Botón Registrarse */}
                <Link
                  to="/register"
                  // 👇 CLASES DARK:
                  className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-medium py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-2 border-black dark:border-white"
                >
                  Registrarse
                </Link>
              </div>
            ) : (
              // Menú de Usuario Logueado
              <div className="relative">
                <button
                  onClick={handleUserMenuClick}
                  // 👇 CLASES DARK:
                  className="flex items-center space-x-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 transition-all duration-200 hover:shadow-md"
                >
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm">U</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Usuario Demo
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Administrador</p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Menú Desplegable */}
                {userMenuOpen && (
                  // 👇 CLASES DARK:
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        usuario@example.com
                      </p>
                    </div>
                    {/* Items del Menú */}
                    <a
                      href="#"
                      // 👇 CLASES DARK:
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">...</svg>
                      Mi Perfil
                    </a>
                    {/* ... (repetir clases dark: para los otros <a>) ... */}
                    
                    {/* Botón Cerrar Sesión */}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setUserMenuOpen(false);
                      }}
                      // 👇 CLASES DARK:
                      className="flex items-center w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">...</svg>
                      Cerrar Sesión
                    </button>
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