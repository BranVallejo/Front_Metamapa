// src/pages/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "../Components/ThemeToggle";
import { estaLogueado, esAdmin } from "../utils/auth";

const ProfessionalHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Verificar autenticación al cargar y cuando cambia la ruta
  useEffect(() => {
    checkAuthStatus();
  }, [location]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(user));
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUserMenuClick = (e) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigationClick = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Obtener iniciales del usuario
  const getUserInitials = () => {
    if (!userData) return "U";
    const { nombre, apellido } = userData;
    if (nombre && apellido) {
      return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    }
    if (nombre) {
      return nombre.charAt(0).toUpperCase();
    }
    if (userData.email) {
      return userData.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Obtener nombre para mostrar
  const getDisplayName = () => {
    if (!userData) return "Usuario";
    if (userData.nombre && userData.apellido) {
      return `${userData.nombre} ${userData.apellido}`;
    }
    if (userData.nombre) {
      return userData.nombre;
    }
    return userData.email.split("@")[0];
  };

  // Componente de navegación para móvil
  const MobileNavigation = () => (
    <div className="lg:hidden space-y-3 pt-4 pb-6 border-t border-gray-200 dark:border-gray-700">
      {/* Hechos - Para usuarios logueados */}
      {estaLogueado() && (
        <Link
          to="/misHechos"
          className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium py-3 px-4 rounded-lg transition-all duration-200 border border-gray-300 dark:border-gray-600 w-full text-base"
          onClick={handleNavigationClick}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
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
          <span>Mis Hechos</span>
        </Link>
      )}

      {/* Colecciones - Solo para ADMIN */}
      {esAdmin() && (
        <Link
          to="/colecciones"
          className="flex items-center space-x-3 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 font-medium py-3 px-4 rounded-lg transition-all duration-200 border border-blue-300 dark:border-blue-600 w-full text-base"
          onClick={handleNavigationClick}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span>Colecciones</span>
        </Link>
      )}

      {/* Solicitudes Eliminación - Solo para ADMIN */}
      {esAdmin() && (
        <Link
          to="/solicitudes-eliminacion"
          className="flex items-center space-x-3 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-800 dark:text-red-200 font-medium py-3 px-4 rounded-lg transition-all duration-200 border border-red-300 dark:border-red-600 w-full text-base"
          onClick={handleNavigationClick}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span>Solicitudes de Eliminación</span>
        </Link>
      )}
    </div>
  );

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Menú Hamburguesa */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Botón menú hamburguesa - Solo móvil y tablet */}
            <button
              onClick={handleMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Menú principal"
            >
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200 whitespace-nowrap"
              onClick={handleNavigationClick}
            >
              MetaMapa
            </Link>
          </div>

          {/* Navegación Central - Desktop (lg y xl) */}
          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-3 xl:space-x-4">
            {/* Hechos - Para usuarios logueados */}
            {estaLogueado() && (
              <Link
                to="/misHechos"
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium py-2 px-3 xl:px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 border border-gray-300 dark:border-gray-600 hover:border-gray-400 hover:shadow-sm text-sm xl:text-base"
              >
                <svg
                  className="w-4 h-4 xl:w-5 xl:h-5 flex-shrink-0"
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
                <span className="whitespace-nowrap">Mis Hechos</span>
              </Link>
            )}

            {/* Colecciones - Solo para ADMIN */}
            {esAdmin() && (
              <Link
                to="/colecciones"
                className="bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 font-medium py-2 px-3 xl:px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 border border-blue-300 dark:border-blue-600 hover:border-blue-400 hover:shadow-sm text-sm xl:text-base"
              >
                <svg
                  className="w-4 h-4 xl:w-5 xl:h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="whitespace-nowrap">Colecciones</span>
              </Link>
            )}

            {/* Solicitudes Eliminación - Solo para ADMIN */}
            {esAdmin() && (
              <Link
                to="/solicitudes-eliminacion"
                className="bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-800 dark:text-red-200 font-medium py-2 px-3 xl:px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 border border-red-300 dark:border-red-600 hover:border-red-400 hover:shadow-sm text-sm xl:text-base"
              >
                <svg
                  className="w-4 h-4 xl:w-5 xl:h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="whitespace-nowrap">Solicitudes</span>
              </Link>
            )}
          </div>

          {/* Navegación Derecha */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Botón de Modo Oscuro */}
            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>

            {!isLoggedIn ? (
              // Usuario NO logueado
              <>
                {/* Desktop */}
                <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 hover:scale-105 border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 py-2 px-3 lg:px-4 rounded-lg text-sm lg:text-base whitespace-nowrap"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-medium py-2.5 px-4 lg:px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-2 border-black dark:border-white text-sm lg:text-base whitespace-nowrap"
                  >
                    Registrarse
                  </Link>
                </div>

                {/* Móvil - Solo botón de login */}
                <div className="sm:hidden">
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 py-2 px-3 rounded-lg text-sm"
                  >
                    Login
                  </Link>
                </div>
              </>
            ) : (
              // Usuario LOGUEADO
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={handleUserMenuClick}
                  className="flex items-center space-x-2 lg:space-x-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-2 lg:px-4 transition-all duration-200 hover:shadow-md min-w-0"
                >
                  <div className="w-7 h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-white font-semibold text-xs lg:text-sm">
                      {getUserInitials()}
                    </span>
                  </div>

                  {/* Información del usuario - Ocultar en móvil, mostrar en tablet y desktop */}
                  <div className="hidden sm:block text-left min-w-0 max-w-32 lg:max-w-40">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {getDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {esAdmin() ? "Administrador" : "Usuario"}
                    </p>
                  </div>

                  <svg
                    className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 flex-shrink-0 ${
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

                {/* Menú Desplegable del Usuario */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 py-1 z-50">
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {userData?.email}
                      </p>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-2 flex-shrink-0"
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

        {/* Menú Móvil Desplegable */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
          >
            <MobileNavigation />

            {/* Sección de autenticación para móvil cuando no está logueado */}
            {!isLoggedIn && (
              <div className="pt-4 pb-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <Link
                  to="/login"
                  className="flex items-center justify-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 px-4 rounded-lg transition-all duration-200 border border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 w-full text-base"
                  onClick={handleNavigationClick}
                >
                  <span>Iniciar Sesión</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center space-x-2 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-2 border-black dark:border-white w-full text-base"
                  onClick={handleNavigationClick}
                >
                  <span>Registrarse</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default ProfessionalHeader;
