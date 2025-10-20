import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import Productos from "./paginas/Productos";
import ProductoDetalle from "./paginas/ProductoDetalle";
import Carrito from "./componentes/Carrito";
import Confirmacion from "./paginas/Confirmacion";
import CarritoIcon from "./componentes/carritoIcon";
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
          <CarritoIcon />
        </nav>

        {/* ✅ Rutas de la aplicación */}
        <Routes>
          <Route path="/" element={<Productos />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
        </Routes>

        {/* ✅ Footer opcional */}
        <footer className="text-center p-4 text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} Moda & Estilo. Todos los derechos reservados.
        </footer>
      </Router>
    </CarritoProvider>
  );
}

export default App;
