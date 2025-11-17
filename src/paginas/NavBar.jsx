
import { useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import CarritoIcon from "../componentes/carritoIcon";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // ✅ Firebase Auth

const Navbar = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const cargarUsuario = () => {
      const sesion = localStorage.getItem("novaglow_session");
      setUsuario(sesion ? JSON.parse(sesion) : null);
    };

    cargarUsuario();

    // 🔥 Escucha cambios desde Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const nombre = user.email.split("@")[0];
        const data = { nombre, email: user.email };
        localStorage.setItem("novaglow_session", JSON.stringify(data));
        setUsuario(data);
      } else {
        localStorage.removeItem("novaglow_session");
        setUsuario(null);
      }
      window.dispatchEvent(new Event("novaglow_session_change"));
    });

    // 🔁 Escucha eventos del almacenamiento local
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
      await signOut(auth); // 🔐 Cierra sesión de Firebase
      localStorage.removeItem("novaglow_session");
      setUsuario(null);
      window.dispatchEvent(new Event("novaglow_session_change"));
      alert("👋 Sesión cerrada correctamente.");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("⚠️ Error al cerrar sesión. Intenta nuevamente.");
    }
  };

  return (
    <nav className="bg-pink-100 shadow-md py-4 fixed top-0 left-0 w-full z-50 transition-all duration-500">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* 🌸 Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="text-2xl font-extrabold text-pink-600 font-[Poppins] group-hover:text-pink-700 transition-colors">
            🌸NovaGlow
          </span>
        </Link>

        {/* 🔗 Navegación */}
        <div className="hidden md:flex space-x-6 items-center text-gray-700 font-medium">
          <Link to="/inicio" className="hover:text-pink-500 transition">
            Inicio
          </Link>
          <Link to="/productos" className="hover:text-pink-500 transition">
            Productos
          </Link>
          <Link to="/nosotros" className="hover:text-pink-500 transition">
            Nosotros
          </Link>
          <Link to="/contacto" className="hover:text-pink-500 transition">
            Contacto
          </Link>
        </div>

        {/* 🛒 Carrito + sesión */}
        <div className="flex items-center space-x-4">
          <CarritoIcon />
          {usuario ? (
            <div className="flex items-center space-x-3">
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
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/registro"
                className="border border-pink-500 text-pink-600 font-bold py-2 px-4 rounded-lg hover:bg-pink-50 transition-transform hover:scale-105"
              >
                Registrarme
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
