import { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import CarritoIcon from "../componentes/carritoIcon";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ChevronDown, Lock, Menu, X, Heart } from "lucide-react"; // ⭐ CAMBIO FAVORITOS
import ModalFavoritos from "../componentes/ModalFavoritos";       // ⭐ CAMBIO FAVORITOS

const Navbar = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  // ⭐ CAMBIO FAVORITOS — controla el modal
  const [modalFavoritosAbierto, setModalFavoritosAbierto] = useState(false);

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mobileMenuAbierto, setMobileMenuAbierto] = useState(false);
  const auth = getAuth();

  const allowedEmails = ["fundadora@novaglow.com", "hylromeroduran@crackthecode.la"];

  useEffect(() => {
    const cargarUsuario = () => {
      const sesion = localStorage.getItem("novaglow_session");
      setUsuario(sesion ? JSON.parse(sesion) : null);
    };

    cargarUsuario();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const nombre = user.email.split("@")[0];
        const data = { nombre, email: user.email, uid: user.uid }; // ⭐ UID NECESARIO PARA FAVORITOS
        localStorage.setItem("novaglow_session", JSON.stringify(data));
        setUsuario(data);
      } else {
        localStorage.removeItem("novaglow_session");
        setUsuario(null);
      }
      window.dispatchEvent(new Event("novaglow_session_change"));
    });

    window.addEventListener("storage", cargarUsuario);
    window.addEventListener("novaglow_session_change", cargarUsuario);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", cargarUsuario);
      window.removeEventListener("novaglow_session_change", cargarUsuario);
    };
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("novaglow_session");
      setUsuario(null);
      window.dispatchEvent(new Event("novaglow_session_change"));
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      {/* ⭐ MODAL FAVORITOS */}
      {modalFavoritosAbierto && (
        <ModalFavoritos 
          usuario={usuario}
          cerrar={() => setModalFavoritosAbierto(false)} 
        />
      )}

      <nav className="bg-pink-100 shadow-md py-4 fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center px-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-extrabold text-pink-600 font-[Poppins] group-hover:text-pink-700 transition-colors">
              🌸NovaGlow
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6 items-center text-gray-700 font-medium">
            <Link to="/inicio" className="hover:text-pink-500 transition">Inicio</Link>
            <Link to="/productos" className="hover:text-pink-500 transition">Productos</Link>

            {/* Nosotros */}
            <div className="relative">
              <Link
                to="/nosotros"
                className="hover:text-pink-500 transition font-semibold flex items-center gap-1"
              >
                Nosotros <ChevronDown className="w-5 h-5" />
              </Link>
              {menuAbierto && (
                <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-xl border border-gray-100 py-3 w-56 z-50">
                  <Link
                    to="/inspiracion"
                    className="block px-4 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition"
                    onClick={() => setMenuAbierto(false)}
                  >
                    💫 Ver Blog & Galería
                  </Link>

                  {usuario && allowedEmails.includes(usuario.email) && (
                    <Link
                      to="/adminblog"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition"
                      onClick={() => setMenuAbierto(false)}
                    >
                      <Lock className="w-4 h-4" /> Panel de Administración
                    </Link>
                  )}
                </div>
              )}
            </div>

            <Link to="/contacto" className="hover:text-pink-500 transition">Contacto</Link>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">

            {/* ⭐ BOTÓN FAVORITOS */}
            <button
              onClick={() => setModalFavoritosAbierto(true)}
              className="text-pink-600 hover:text-pink-700 transition"
            >
              <Heart size={26} />
            </button>

            {/* CARRITO */}
            <CarritoIcon />

            {/* Login / Logout */}
            {usuario ? (
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-pink-700 font-semibold">
                  Hola, {usuario.nombre?.split(" ")[0]} ✨
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105">
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="border border-pink-500 text-pink-600 font-bold py-2 px-4 rounded-lg hover:bg-pink-50 transition-transform hover:scale-105">
                  Registrarme
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden text-pink-600"
              onClick={() => setMobileMenuAbierto(!mobileMenuAbierto)}
            >
              {mobileMenuAbierto ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* mobile menu... (no cambios) */}
      </nav>
    </>
  );
};

export default Navbar;
