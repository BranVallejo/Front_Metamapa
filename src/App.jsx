import "./App.css";
import Header from "./pages/Header";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; 
import "leaflet/dist/leaflet.css";

// Pages
import MapaPrincipal from "./pages/MapaPrincipal";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportarHecho from "./pages/ReportarHecho";
import MisHechos from "./pages/misHechos";
import HechoDetalle from "./pages/HechoDetalle";
import GestionColecciones from "./pages/Coleccion";
import EditarHecho from "./pages/EditarHecho";
import Estadisticas from "./pages/Estadisticas";
import Fuentes from "./pages/Fuentes";

// Solicitudes
import PaginaReporte from "./pages/SolicitudEliminacion"; 
import ModuloSolicitudesAdmin from "./pages/Solicitudes/ModuloSolicitudesAdmin"; 

// Seguridad (NUEVO)
import GestionSeguridad from "./pages/GestionSeguridad"; // Crea la carpeta 'Seguridad'

function AppContent() {
  const location = useLocation();
  const isMap = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Header con z-index alto para sobreponerse al mapa */}
      <header className="absolute top-0 w-full z-[5000]">
        <Header />
      </header>

      <main className={`flex-grow ${isMap ? "h-screen w-full overflow-hidden" : "pt-20 pb-6 px-4 md:px-8"}`}>
        <Routes>
          {/* Rutas Públicas / Generales */}
          <Route path="/" element={<MapaPrincipal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas de Hechos */}
          <Route path="/hechos/nuevo" element={<ReportarHecho />} />
          <Route path="/misHechos" element={<MisHechos />} />
          <Route path="/hechos/:id" element={<HechoDetalle />} />
          <Route path="/hechos/editar/:id" element={<EditarHecho />} />

          {/* Rutas de Administración */}
          <Route path="/colecciones" element={<GestionColecciones />} />
          <Route path="/fuentes" element={<Fuentes />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          
          {/* 👇 NUEVA RUTA DE SEGURIDAD */}
          <Route path="/seguridad" element={<GestionSeguridad />} />

          {/* Gestión de Reportes y Solicitudes */}
          <Route
            path="/solicitarEliminacion/:idHecho"
            element={<PaginaReporte />}
          />
          <Route
            path="/solicitudes-eliminacion"
            element={<ModuloSolicitudesAdmin />}
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;