import "./App.css";
import Header from "./pages/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapaPrincipal from "./pages/MapaPrincipal";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportarHecho from "./pages/ReportarHecho";
import MisHechos from "./pages/misHechos";
import HechoDetalle from "./pages/HechoDetalle";
import GestionColecciones from "./pages/Coleccion";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />

        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<MapaPrincipal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hechos/nuevo" element={<ReportarHecho />} />

            {/* 4. AGREGAMOS LAS NUEVAS RUTAS */}
            <Route path="/misHechos" element={<MisHechos />} />
            <Route path="/hechos/:id" element={<HechoDetalle />} />
            <Route path="/colecciones" element={<GestionColecciones />} />
          </Routes>
        </main>
        {/* <Footer /> si tuvieras uno, iría aquí */}
      </div>
    </Router>
  );
}

export default App;
