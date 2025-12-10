import { Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import ScrollToTop from "./componentes/ScrollToTop";
import FloatingPlayer from "./componentes/FloatingPlayer"; // <--- IMPORTAR REPRODUCTOR

// Páginas
import Inicio from "./paginas/Inicio";
import Productos from "./paginas/Productos";
import ProductoDetalle from "./paginas/ProductoDetalle";
import Carrito from "./componentes/Carrito"; 
import Confirmacion from "./paginas/Confirmacion";
import Nosotros from "./paginas/Nosotros";
import Contacto from "./paginas/Contacto";
import Footer from "./paginas/Footer";
import Navbar from "./paginas/NavBar";
import Logout from "./paginas/Logout";
import Intranet from "./paginas/Intranet";
import Perfil from "./paginas/Perfil";
import FavoritosModal from "./paginas/FavoritosModal";


// BLOG
import BlogInspiracion from "./paginas/Blog-Inspiracion";
import AdminBlog from "./paginas/AdminBlog";
import Suscripcion from "./paginas/Suscripcion";
import ArticuloDetalle from "./descubre/ArticuloDetalle";

// 🔒 Rutas protegidas
import ProtectedRoute from "./componentes/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <CarritoProvider>
      <>
        <ScrollToTop />
        
        {/* 🎵 REPRODUCTOR GLOBAL FLOTANTE 🎵 */}
        {/* Al ponerlo aquí, persiste en toda la navegación */}
        <FloatingPlayer />

        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* 🌸 Navbar */}
          <Navbar />

          {/* 🧭 Contenido principal */}
          <main className="grow pt-[72px] bg-pink-100">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />

              <Route path="/inspiracion" element={<BlogInspiracion />} />
              <Route path="/inspiracion/:slug" element={<ArticuloDetalle />} />

                <Route path="/adminblog" element={<AdminBlog />} />
                <Route path="/suscripcion" element={<Suscripcion />} />
                <Route path="/intranet" element={<Intranet />} />

              <Route path="/logout" element={<Logout />} />
              <Route path="/perfil" element={<Perfil />} />
              
              <Route
                path="/carrito"
                element={
                  <ProtectedRoute>
                    <Carrito />
                  </ProtectedRoute>
                }
              />
                <Route path="/logout" element={<Logout />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/favoritosModal" element={<FavoritosModal />} />
                


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

            <Footer />
          </div>
        </>
      </CarritoProvider>
  );
}

export default App;