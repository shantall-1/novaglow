import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import Productos from "./paginas/Productos";
import ProductoDetalle from "./paginas/ProductoDetalle";
import Carrito from "./componentes/Carrito";
import Confirmacion from "./paginas/Confirmacion";
import Inicio from "./paginas/Inicio";
import Nosotros from "./paginas/Nosotros";
import Contacto from "./paginas/Contacto";
import Footer from "./paginas/Footer";
import Navbar from "./paginas/NavBar";
import Login from "./paginas/Login";
import Registro from "./paginas/Registro";
import ProtectedRoute from "./componentes/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <CarritoProvider>
      <Router>
        <Navbar />
        <Routes className="min-h-screen bg-gray-50">
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* 🔒 Estas rutas sí requieren sesión */}
          <Route
            path="/carrito"
            element={
              <ProtectedRoute>
                <Carrito />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirmacion"
            element={
              <ProtectedRoute>
                <Confirmacion />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
        <Footer />
      </Router>
    </CarritoProvider>
  );
}

export default App;