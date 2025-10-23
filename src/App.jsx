import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";

// 🛍️ Páginas
import Productos from "./paginas/Productos";
import ProductoDetalle from "./paginas/ProductoDetalle";
import Carrito from "./componentes/Carrito";
import Confirmacion from "./paginas/Confirmacion";
import Inicio from "./paginas/Inicio";
import Nosotros from "./paginas/Nosotros";
import Contacto from "./paginas/Contacto";
import MetodosPago from "./layouts/MetodosPago";
import Login from "./paginas/Login";
import Registro from "./paginas/Registro";
import ProtectedRoute from "./componentes/ProtectedRoute";

// 🎨 Estilos
import "./App.css";

// 🧭 Componentes globales
import Footer from "./paginas/Footer";
import Navbar from "./paginas/NavBar";

function App() {
  return (
    <CarritoProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* NAVBAR siempre visible */}
          <Navbar />

          {/* CONTENIDO PRINCIPAL */}
          <main className="grow">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />

              {/* 🔒 Rutas protegidas */}
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

              {/* Autenticación */}
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />

              {/* Pago */}
              <Route path="/pago" element={<MetodosPago />} />
            </Routes>
          </main>

          {/* FOOTER siempre visible */}
          <Footer />
        </div>
      </Router>
    </CarritoProvider>
  );
}

export default App;

