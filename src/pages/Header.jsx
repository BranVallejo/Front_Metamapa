import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ThemeToggle from "../Components/ThemeToggle";
import LogoAnimado from "../Components/LogoAnimado";
import { estaLogueado, esAdmin } from "../utils/auth";

// --- UTILIDADES ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- CSS FIX PARA EL MAPA ---
const MapLayoutFixes = () => (
  <style>{`
    /* MÓVIL Y TABLET (Pantallas menores a 1024px) */
    @media (max-width: 1024px) {
      .leaflet-top,
      .mapboxgl-ctrl-top-left, 
      .mapboxgl-ctrl-top-right,
      .map-controls-top {
        top: 120px !important;
      }

      .leaflet-bottom, 
      .mapboxgl-ctrl-bottom-left, 
      .mapboxgl-ctrl-bottom-right,
      .map-controls-bottom { 
        bottom: 90px !important; 
      }
      
      .leaflet-control-container .leaflet-bottom {
        margin-bottom: 20px !important;
      }
    }
  `}</style>
);

// --- ICONOS SVG ---
const Icons = {
  Map: ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  ),
  MapPin: ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  Folder: ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  ),
  Inbox: ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  ),
  Chart: ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  Database: ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
      />
    </svg>
  ),
  // 👇 NUEVO ICONO DE SEGURIDAD (ESCUDO)
  Security: ({ className }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
};

// --- SUB-COMPONENTES ---

const DesktopNavItem = ({ to, children, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        "relative px-4 py-2 text-sm font-medium transition-colors duration-200 z-10",
        isActive
          ? "text-white"
          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
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

const MobileNavItem = ({ to, IconComponent, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        "relative flex items-center justify-center w-full h-full transition-colors",
        isActive
          ? "text-gray-900 dark:text-white"
          : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
      )}
    >
      <div className="relative">
        <IconComponent
          className={cn(
            "w-7 h-7 transition-all duration-200",
            isActive && "stroke-[2.5px] scale-105"
          )}
        />
      </div>
    </Link>
  );
};

// --- COMPONENTE PRINCIPAL ---
const ProfessionalHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    setUserMenuOpen(false);
  }, [location]);

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
    return (
      userData.nombre ? userData.nombre[0] : userData.email[0]
    ).toUpperCase();
  };

  // 👇 AQUÍ AGREGUÉ LA PESTAÑA SEGURIDAD
  const navLinks = [
    { path: "/", label: "Mapa", Icon: Icons.Map, show: true },
    { path: "/misHechos", label: "Hechos", Icon: Icons.MapPin, show: true },
    {
      path: "/colecciones",
      label: "Colecciones",
      Icon: Icons.Folder,
      show: esAdmin(),
    },
    {
      path: "/fuentes",
      label: "Fuentes",
      Icon: Icons.Database,
      show: esAdmin(),
    },
    {
      path: "/solicitudes-eliminacion",
      label: "Solicitudes",
      Icon: Icons.Inbox,
      show: esAdmin(),
    },
    {
      path: "/estadisticas",
      label: "Estadísticas",
      Icon: Icons.Chart,
      show: esAdmin(),
    },
    // 👇 NUEVO LINK SEGURIDAD (Solo Admin)
    {
      path: "/seguridad",
      label: "Seguridad",
      Icon: Icons.Security,
      show: esAdmin(),
    },
  ];

  return (
    <>
      <MapLayoutFixes />

      {/* --- HEADER SUPERIOR --- */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cn(
          "fixed top-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "pointer-events-auto flex items-center justify-between px-3 rounded-full border transition-all duration-300 backdrop-blur-xl shadow-2xl",
            isScrolled
              ? "w-[95%] lg:w-[90%] max-w-4xl bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 py-2"
              : "w-[95%] lg:w-[95%] max-w-6xl bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 py-3"
          )}
        >
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center justify-center px-1 group select-none"
          >
            <div className="transform transition-transform duration-300 group-hover:scale-110">
              <LogoAnimado />
            </div>
          </Link>

          {/* NAV LINKS (DESKTOP) */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-100/50 dark:bg-gray-900/50 p-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50">
            {navLinks.map(
              (link) =>
                link.show && (
                  <DesktopNavItem
                    key={link.path}
                    to={link.path}
                    isActive={location.pathname === link.path}
                  >
                    {link.label}
                  </DesktopNavItem>
                )
            )}
          </nav>

          {/* ACCIONES */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="scale-90 hover:scale-100 transition-transform">
              <ThemeToggle />
            </div>

            {!isLoggedIn ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap"
                >
                  Registarse
                </Link>
              </div>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-1 sm:pr-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                    {getUserInitials()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                    {userData?.nombre}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-60 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden ring-1 ring-black/5 z-50"
                    >
                      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {userData?.nombre} {userData?.apellido}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {userData?.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
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

      {/* --- NAVBAR INFERIOR (MÓVIL) --- */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 pb-safe safe-area-bottom shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
        {/* Agregado overflow-x-auto para que si hay muchos iconos se pueda scrollear horizontalmente en pantallas muy pequeñas */}
        <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto overflow-x-auto scrollbar-hide">
          {navLinks.map(
            (link) =>
              link.show && (
                <div key={link.path} className="flex-1 h-full min-w-[3rem]">
                  <MobileNavItem
                    to={link.path}
                    IconComponent={link.Icon}
                    isActive={location.pathname === link.path}
                  />
                </div>
              )
          )}
        </div>
      </nav>

      {/* --- SPACERS --- */}
      {/* Spacer SUPERIOR para el header fijo */}
      <div className="h-24 md:h-28" />
    </>
  );
};

export default ProfessionalHeader;