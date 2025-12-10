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

  // --- 1. LÓGICA DE ESTILOS ACTIVOS ---
  // Esta función decide si el botón debe verse "Activo" o "Normal"
  const getNavLinkClass = (path) => {
    // Es activo si la ruta actual COINCIDE con la del botón
    const isActive = location.pathname === path;

    const baseClasses = "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ";
    
    // Estilo cuando ESTÁS en esa página (Fondo visible, texto azul)
    const activeClasses = "bg-gray-100 dark:bg-gray-700 text-blue-700 dark:text-blue-400 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600";
    
    // Estilo normal (Ghost)
    const inactiveClasses = "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  // Lo mismo para el menú móvil
  const getMobileNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    const base = "flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 border ";
    
    // Activo Móvil
    const active = "bg-blue-50 dark:bg-gray-700 border-blue-200 dark:border-gray-500 text-blue-700 dark:text-blue-400";
    // Inactivo Móvil
    const inactive = "bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600";

    return `${base} ${isActive ? active : inactive}`;
  };

  // Verificar autenticación
  useEffect(() => {
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
    checkAuthStatus();
  }, [location]);

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const getUserInitials = () => {
    if (!userData) return "U";
    if (userData.nombre && userData.apellido) return `${userData.nombre.charAt(0)}${userData.apellido.charAt(0)}`.toUpperCase();
    if (userData.email) return userData.email.charAt(0).toUpperCase();
    return "U";
  };

  const getDisplayName = () => {
    if (!userData) return "Usuario";
    if (userData.nombre) return `${userData.nombre} ${userData.apellido || ''}`;
    return userData.email.split("@")[0];
  };

  // --- RENDER ---
  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* SECCIÓN IZQUIERDA: Logo y Menú Hamburguesa */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-400 hover:opacity-90 transition-opacity whitespace-nowrap">
              MetaMapa
            </Link>
          </div>

          {/* SECCIÓN CENTRAL: Navegación Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            
            {/* 1. BOTÓN MAPA (Siempre visible, lleva al inicio) */}
            <Link to="/" className={getNavLinkClass("/")}>
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
               <span>Mapa</span>
            </Link>

            {estaLogueado() && (
              <Link to="/misHechos" className={getNavLinkClass("/misHechos")}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Mis Hechos</span>
              </Link>
            )}

            {esAdmin() && (
              <>
                <Link to="/colecciones" className={getNavLinkClass("/colecciones")}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  <span>Colecciones</span>
                </Link>

                <Link to="/solicitudes-eliminacion" className={getNavLinkClass("/solicitudes-eliminacion")}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  <span>Solicitudes</span>
                </Link>

                <Link to="/estadisticas" className={getNavLinkClass("/estadisticas")}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  <span>Estadísticas</span>
                </Link>
              </>
            )}
          </nav>

          {/* SECCIÓN DERECHA: Theme Toggle y User/Login */}
          <div className="flex items-center gap-3">
            
            <div className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <ThemeToggle />
            </div>

            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                  Registrarse
                </Link>
              </div>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {getUserInitials()}
                  </div>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 transform origin-top-right transition-all">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{getDisplayName()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-xl absolute w-full z-40">
          <div className="p-4 space-y-3">
            
            {/* Mapa Móvil */}
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={getMobileNavLinkClass("/")}>
              <span className="text-xl">🗺️</span> Mapa
            </Link>

            {estaLogueado() && (
              <Link to="/misHechos" onClick={() => setMobileMenuOpen(false)} className={getMobileNavLinkClass("/misHechos")}>
                <span className="text-xl">📍</span> Mis Hechos
              </Link>
            )}
            
            {esAdmin() && (
              <>
                <Link to="/colecciones" onClick={() => setMobileMenuOpen(false)} className={getMobileNavLinkClass("/colecciones")}>
                  <span className="text-xl">📁</span> Colecciones
                </Link>
                <Link to="/solicitudes-eliminacion" onClick={() => setMobileMenuOpen(false)} className={getMobileNavLinkClass("/solicitudes-eliminacion")}>
                  <span className="text-xl">🗑️</span> Solicitudes
                </Link>
                <Link to="/estadisticas" onClick={() => setMobileMenuOpen(false)} className={getMobileNavLinkClass("/estadisticas")}>
                  <span className="text-xl">📊</span> Estadísticas
                </Link>
              </>
            )}

            {!isLoggedIn && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                <Link to="/login" className="w-full text-center py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium">Iniciar Sesión</Link>
                <Link to="/register" className="w-full text-center py-2 bg-blue-600 text-white rounded-lg font-medium">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default ProfessionalHeader;