import "./App.css";
import Header from "./pages/Header";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; // Agregué useLocation
import MapaPrincipal from "./pages/MapaPrincipal";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportarHecho from "./pages/ReportarHecho";
import MisHechos from "./pages/misHechos";
import HechoDetalle from "./pages/HechoDetalle";
import GestionColecciones from "./pages/Coleccion";
import EditarHecho from "./pages/EditarHecho";
import PaginaReporte from "./pages/SolicitudEliminacion";
import ModuloSolicitudesAdmin from "./pages/TodasSolicitudes";
import "leaflet/dist/leaflet.css";
import Estadisticas from "./pages/Estadisticas";

// Creamos este componente para manejar la lógica de la UI según la ruta
function AppContent() {
  const location = useLocation();
  
  // Detectamos si estamos en la Home (el mapa)
  const isMap = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* CAMBIO 1: El Header ahora SIEMPRE es absolute (flota).
         Quitamos la condición para que siempre esté por encima del contenido.
         Nota: Si tu componente <Header> es transparente, tomará el fondo de la página.
      */}
      <header className="absolute top-0 w-full z-50">
        <Header />
      </header>

      {/* CAMBIO 2: Manejo del Padding en el Main.
         - Si es Mapa: `h-screen` y sin padding.
         - Si NO es Mapa: `pt-20` (padding top de 5rem/80px).
           Esto empuja el contenido hacia abajo lo suficiente para que 
           el Header flotante no tape los títulos.
      */}
      <main className={`flex-grow ${isMap ? "h-screen w-full overflow-hidden" : "pt-20 pb-6 px-4 md:px-8"}`}>
        <Routes>
          <Route path="/" element={<MapaPrincipal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hechos/nuevo" element={<ReportarHecho />} />

          <Route path="/misHechos" element={<MisHechos />} />
          <Route path="/hechos/:id" element={<HechoDetalle />} />
          <Route path="/colecciones" element={<GestionColecciones />} />
          <Route path="/hechos/editar/:id" element={<EditarHecho />} />
          <Route path="/estadisticas" element={<Estadisticas />} />

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