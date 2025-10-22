import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import Productos from "./paginas/Productos";
import ProductoDetalle from "./paginas/ProductoDetalle";
import Carrito from "./componentes/Carrito";
import Confirmacion from "./paginas/Confirmacion";
import CarritoIcon from "./componentes/carritoIcon";
import Registro from "./paginas/Registro";


import Login from "./paginas/Login";
import Inicio from "./paginas/Inicio";
import Nosotros from "./paginas/Nosotros";
import Contacto from  "./paginas/Contacto";
import "aos/dist/aos.css";
import "./App.css";

function App() {
  return (
    
    <CarritoProvider>
      <Router>
        {/* ✅ Navbar con logo y carrito */}
        <nav className="flex justify-between items-center p-4 shadow bg-white">
          <Link to="/" className="text-2xl font-bold text-pink-500">NovaGlow</Link>

          <div className="flex items-center">
            <div className="flex space-x-6 text-lg font-medium">
              <Link to="/inicio" className="hover:text-pink-500">Inicio</Link>
              <Link to="/productos" className="hover:text-pink-500">Productos</Link>
              <Link to="/nosotros" className="hover:text-pink-500">Nosotros</Link>
              <Link to="/contacto" className="hover:text-pink-500">Contacto</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="hover:text-pink-500">Iniciar Sesión</Link>
            <CarritoIcon />
          </div>
        </nav>
        <Routes className="min-h-screen bg-gray-50">
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

           
        </Routes>

        {/* ✅ Footer simple */}
        <footer className="text-center p-4 text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} Moda & Estilo. Todos los derechos reservados.
        </footer>
      </Router>
    </CarritoProvider>
  );
}

export default App;
