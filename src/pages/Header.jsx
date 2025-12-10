import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ThemeToggle from "../Components/ThemeToggle";
import LogoAnimado from "../Components/LogoAnimado"; // <--- IMPORTACIÓN AGREGADA
import { estaLogueado, esAdmin } from "../utils/auth";

// --- UTILIDADES ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- SUB-COMPONENTES ---

// Botón de Navegación con "Magic Background"
const NavItem = ({ to, children, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        "relative px-4 py-2 text-sm font-medium transition-colors duration-200 z-10",
        isActive ? "text-white" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute inset-0 rounded-full bg-blue-600 dark:bg-blue-500 shadow-lg shadow-blue-500/30"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{ zIndex: -1 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Link>
  );
};

// --- COMPONENTE PRINCIPAL ---
const ProfessionalHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // (Opcional si usas el menú en avatar)
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  // Detectar Scroll para efectos visuales (encoger la isla)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth Check
  useEffect(() => {
    const checkAuth = () => {
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
    checkAuth();
  }, [location]);

  // Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
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
    navigate("/");
  };

  const getUserInitials = () => {
    if (!userData) return "U";
    return (userData.nombre ? userData.nombre[0] : userData.email[0]).toUpperCase();
  };

  // Definición de Rutas
  const navLinks = [
    { path: "/", label: "Mapa", icon: "🗺️", show: true },
    { path: "/misHechos", label: "Mis Hechos", icon: "📍", show: isLoggedIn },
    { path: "/colecciones", label: "Colecciones", icon: "📁", show: esAdmin() },
    { path: "/solicitudes-eliminacion", label: "Solicitudes", icon: "🗑️", show: esAdmin() },
    { path: "/estadisticas", label: "Estadísticas", icon: "📊", show: esAdmin() },
  ];

  return (
    <>
      {/* --- ISLA FLOTANTE (DESKTOP & TABLET) --- */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cn(
          "fixed top-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300 pointer-events-none",
        )}
      >
        <div
          className={cn(
            "pointer-events-auto flex items-center justify-between p-2 rounded-full border transition-all duration-300 backdrop-blur-xl shadow-2xl",
            isScrolled 
              ? "w-[90%] max-w-4xl bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 py-2" 
              : "w-[95%] max-w-6xl bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 py-3"
          )}
        >
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 px-4 group select-none">
            {/* Contenedor del Logo Animado con efecto de escala suave al hacer hover */}
            <div className="transform transition-transform duration-300 group-hover:scale-110">
               <LogoAnimado />
            </div>
            
            <span className="font-bold text-lg text-gray-800 dark:text-white hidden sm:block tracking-tight">
              MetaMapa
            </span>
          </Link>

          {/* NAV LINKS (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-100/50 dark:bg-gray-900/50 p-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50">
            {navLinks.map((link) => (
              link.show && (
                <NavItem key={link.path} to={link.path} isActive={location.pathname === link.path}>
                  {link.label}
                </NavItem>
              )
            ))}
          </nav>

          {/* ACTIONS (Right) */}
          <div className="flex items-center gap-3 px-2">
            <div className="scale-90 hover:scale-100 transition-transform">
                <ThemeToggle />
            </div>

            {/* User Profile / Login */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Unirse
                </Link>
              </div>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                    {getUserInitials()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                    {userData?.nombre}
                  </span>
                  <svg className={cn("w-4 h-4 text-gray-400 transition-transform", userMenuOpen && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </motion.button>

                {/* Dropdown Animado */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-60 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden ring-1 ring-black/5"
                    >
                      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{userData?.nombre} {userData?.apellido}</p>
                        <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                      </div>
                      <div className="p-2">
                        {/* Links en móvil que no entran en la barra */}
                        <div className="lg:hidden space-y-1 mb-2">
                            {navLinks.map(link => link.show && (
                                <Link key={link.path} to={link.path} onClick={() => setUserMenuOpen(false)} className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors", location.pathname === link.path ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800")}>
                                    <span>{link.icon}</span> {link.label}
                                </Link>
                            ))}
                             <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                        </div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          Cerrar Sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Spacer para que el contenido no quede tapado por la navbar fixed */}
      <div className="h-24 md:h-28" />
    </>
  );
};

export default ProfessionalHeader;