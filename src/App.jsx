import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import Productos from "./paginas/Productos";
import ProductoDetalle from "./paginas/ProductoDetalle";
import Carrito from "./componentes/Carrito";
import Confirmacion from "./paginas/Confirmacion";
import CarritoIcon from "./componentes/carritoIcon";

import Inicio from "./navegacion/Inicio";
import Nosotros from "./navegacion/Nosotros";
import Contacto from  "./navegacion/Contacto";
import "./App.css";

function App() {
  return (
    <CarritoProvider>
      <Router>
        {/* ✅ Navbar simple con logo y carrito */}
        <nav className="flex justify-between items-center p-4 shadow bg-white">
          <a href="/" className="text-2xl font-bold text-pink-500">
            Moda & Estilo 💋
          </a>
          <div className="flex space-x-6 text-lg font-medium">
            <a href="/inicio" className="hover:text-pink-500">Inicio</a>
            <a href="/productos" className="hover:text-pink-500">Productos</a>
            <a href="/nosotros" className="hover:text-pink-500">Nosotros</a>
            <a href="/contacto" className="hover:text-pink-500">Contacto</a>
          </div>
          <CarritoIcon />
        </nav>
        <Routes className="min-h-screen bg-gray-50">
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
        </Routes>

        <CarritoIcon />
        {/* ✅ Footer opcional */}
        <footer className="text-center p-4 text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} Moda & Estilo. Todos los derechos reservados.
        </footer>
      </Router>
    </CarritoProvider>
  );
}

export default App;
