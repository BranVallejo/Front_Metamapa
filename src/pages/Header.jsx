import React, { useState, useEffect } from "react";

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
            <a
              href="/"
              className="text-2xl font-bold text-blue-800 hover:text-blue-600 transition-colors duration-200"
            >
              MetaMapa
            </a>
          </div>

          {/* Botón Central - Centrado exacto */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 border border-gray-300 hover:border-gray-400 hover:shadow-sm">
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
            </button>
          </div>

          {/* Navegación Derecha */}
          <div className="flex-shrink-0 flex justify-end">
            {!isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {/* Botón Iniciar Sesión - Enlaza a /login */}
                <a
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 border border-gray-300 hover:border-blue-600 py-2 px-4 rounded-lg"
                >
                  Iniciar Sesión
                </a>
                {/* Botón Registrarse - Enlaza a /register */}
                <a
                  href="/register"
                  className="bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-2 border-black"
                >
                  Registrarse
                </a>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={handleUserMenuClick}
                  className="flex items-center space-x-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg py-2 px-4 transition-all duration-200 hover:shadow-md"
                >
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm">U</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      Usuario Demo
                    </p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
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

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-300 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        usuario@example.com
                      </p>
                    </div>
                    <a
                      href="#"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Mi Perfil
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Mis Reportes
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Configuración
                    </a>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
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
