import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";

// 🛍️ Páginas
import Productos from "./paginas/Productos";
import ProductoDetalle from "./paginas/ProductoDetalle";
import Carrito from "./componentes/Carrito";
import ScrollToTop from "./componentes/ScrollToTop";
import Confirmacion from "./paginas/Confirmacion";
import Inicio from "./paginas/Inicio";
import Nosotros from "./paginas/Nosotros";
import Contacto from "./paginas/Contacto";
import Footer from "./paginas/Footer";
import Navbar from "./paginas/NavBar";
import Login from "./paginas/Login";
import Registro from "./paginas/Registro";
import Logout from "./paginas/Logout"; 



//BLOG
import BlogInspiracion from "./paginas/Blog-Inspiracion";
import AdminBlog from "./paginas/AdminBlog";
import Suscripcion from "./paginas/Suscripcion";

import ArticuloDetalle from './descubre/ArticuloDetalle';
// 🔒 Protección de rutas
import ProtectedRoute from "./componentes/ProtectedRoute";
import "./App.css";


function App() {
  return (
    <>
    <CarritoProvider>
      <Router>
         <ScrollToTop /> {/* ✅ Aquí está bien ubicado */}
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* 🌸 Barra superior */}
          <Navbar />

          {/* 🧭 Contenido principal */}
          <main className="grow pt-[72px] bg-pink-100"> {/* pt-20 evita que el contenido quede bajo el navbar fijo */}
            <Routes>

              

              {/* 🏠 Rutas públicas */}
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />

              {/* Ruta para la galería / blog de inspiración */}
              <Route path="/inspiracion" element={<BlogInspiracion />} />

              {/* Ruta dinámica para detalle de artículo según slug */}
              <Route path="/inspiracion/:slug" element={<ArticuloDetalle />} />
              
              {/* 🔐 Panel de administración */}
              <Route path="/adminblog" element={<AdminBlog />} />
              <Route path="/" element={<Suscripcion />} />


              {/* 👤 Autenticación */}
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/logout" element={<Logout />} /> {/* ✅ mensaje tipo modal */}

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
            </Routes>
          </main>

          {/* 👣 Footer */}
          <Footer />
        </div>
      </Router>
    </CarritoProvider>
    </>
  );
}

export default App;
