import { Routes, Route } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import ScrollToTop from "./componentes/ScrollToTop";
import FloatingPlayer from "./componentes/FloatingPlayer";

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
import EnviosYDevoluciones from "./paginas/EnviosYDevoluciones";
import TerminosYCondiciones from "./paginas/TerminosYCondiciones";
import PoliticaPrivacidad from "./paginas/PoliticaPrivacidad";

// BLOG
import BlogInspiracion from "./paginas/Blog-Inspiracion";
import AdminBlog from "./paginas/AdminBlog";
import Suscripcion from "./paginas/Suscripcion";
import ArticuloDetalle from "./descubre/ArticuloDetalle";

// 🔒 Rutas protegidas
import ProtectedRoute from "./componentes/ProtectedRoute";

function App() {
  return (
    <CarritoProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <ScrollToTop />
        <Navbar />
        <FloatingPlayer />

        <main className="flex-grow pt-16">
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Inicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/blog" element={<BlogInspiracion />} />
            <Route path="/blog/:slug" element={<ArticuloDetalle />} />
            <Route path="/suscripcion" element={<Suscripcion />} />
            
            {/* Páginas Legales */}
            <Route path="/envios-y-devoluciones" element={<EnviosYDevoluciones />} />
            <Route path="/terminos-y-condiciones" element={<TerminosYCondiciones />} />
            <Route path="/politica-de-privacidad" element={<PoliticaPrivacidad />} />

            {/* Rutas de Usuario/Auth */}
            <Route path="/logout" element={<Logout />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/intranet" element={<Intranet />} />
            <Route path="/adminblog" element={<AdminBlog />} />

            {/* Rutas Protegidas */}
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

            {/* Si FavoritosModal es una página independiente, se queda aquí. 
                Si es un modal que se abre sobre otras páginas, NO debe ser una Route */}
            <Route path="/favoritos" element={<FavoritosModal />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </CarritoProvider>
  );
}

export default App;