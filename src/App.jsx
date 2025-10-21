
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import Productos from "./paginas/Productos";
import ProductoDetalle from "./paginas/ProductoDetalle";
import Carrito from "./componentes/Carrito";
import Confirmacion from "./paginas/Confirmacion";
import CarritoIcon from "./componentes/CarritoIcon";


import Inicio from "./navegacion/Inicio";
import Nosotros from "./navegacion/Nosotros";
import Contacto from "./navegacion/Contacto";
import "./App.css";

function App() {
  return (
    
    <CarritoProvider>
      <Router>
        {/* ✅ Navbar con logo y carrito */}
        <nav className="flex justify-between items-center p-4 shadow bg-white">
          <Link to="/" className="text-2xl font-bold text-pink-500">
            Moda & Estilo 💋
          </Link>

          <div className="flex space-x-6 text-lg font-medium">
            <Link to="/inicio" className="hover:text-pink-500">Inicio</Link>
            <Link to="/productos" className="hover:text-pink-500">Productos</Link>
            <Link to="/nosotros" className="hover:text-pink-500">Nosotros</Link>
            <Link to="/contacto" className="hover:text-pink-500">Contacto</Link>
          </div>

          <CarritoIcon />
        </nav>

        {/* ✅ Contenedor principal de rutas */}
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/confirmacion" element={<Confirmacion />} />
          </Routes>
        </div>

        {/* ✅ Footer simple */}
        <footer className="text-center p-4 text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} Moda & Estilo. Todos los derechos reservados.
        </footer>
      </Router>
    </CarritoProvider>
  );
}

export default App;
