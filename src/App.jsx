import "./App.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapaPrincipal from "./pages/MapaPrincipal";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/pepe" element={<MapaPrincipal />} />
      </Routes>
    </Router>
  );
}

export default App;
