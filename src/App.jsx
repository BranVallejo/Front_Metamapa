import "./App.css";
import Header from "./pages/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapaPrincipal from "./pages/MapaPrincipal";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MapaPrincipal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
