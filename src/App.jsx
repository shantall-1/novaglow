import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import Productos from "./paginas/Productos";
import Carrito from "./componentes/Carrito";
import Confirmacion from "./paginas/Confirmacion";
import Inicio from "./paginas/Inicio";
import Nosotros from "./paginas/Nosotros";
import Contacto from "./paginas/Contacto";
import Footer from "./paginas/Footer";
import Navbar from "./paginas/NavBar";
import "./App.css";
import ProductoDetalles from "./paginas/ProductoDetalle";
import MetodosPago from "./layouts/MetodosPago";

function App() {
  return (
    <CarritoProvider>
      <Router>
        <Navbar />
        <Routes className="min-h-screen bg-gray-50">
          <Route path="/" element={<Inicio />} />
           <Route path="/inicio" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<ProductoDetalles />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
          <Route path="/pago" element={<MetodosPago />} />
        </Routes>

        <Footer />
      </Router>
    </CarritoProvider>
  );
}

export default App;