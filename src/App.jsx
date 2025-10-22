import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import Productos from "./paginas/Productos";
import ProductoDetalle from "./paginas/ProductoDetalle";
import Carrito from "./componentes/Carrito";
import Confirmacion from "./paginas/Confirmacion";
import CarritoIcon from "./componentes/carritoIcon";
import Inicio from "./paginas/Inicio";
import Nosotros from "./paginas/Nosotros";
import Contacto from "./paginas/Contacto";
import Footer from "./paginas/Footer";
import Navbar from "./paginas/NavBar";
import "./App.css";

function App() {
  return (
    <CarritoProvider>
      <Router>
        <Navbar />
        <Routes className="min-h-screen bg-gray-50">
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
        </Routes>

        <CarritoIcon />
        <Footer />
      </Router>
    </CarritoProvider>
  );
}

export default App;