import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Menu, X } from "lucide-react"; // 🔥 Iconos para el menú
import CarritoIcon from "../componentes/carritoIcon";
import BlogDropdown from "../componen/BlogDropdown";
import { ADMIN_EMAILS } from "../lib/firebase";

const Navbar = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false); // 👈 Estado del menú móvil
  const auth = getAuth();

  useEffect(() => {
    const cargarUsuario = () => {
      const sesion = localStorage.getItem("novaglow_session");
      setUsuario(sesion ? JSON.parse(sesion) : null);
    };

    cargarUsuario();

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
        <Link to="/inicio" className="flex items-center space-x-2 group">
          <span className="text-2xl font-extrabold text-pink-600 font-[Poppins] group-hover:text-pink-700 transition-colors">
            🌸NovaGlow
          </span>
        </Link>

        {/* 🔘 Botón menú móvil */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden text-pink-600 hover:text-pink-700 focus:outline-none"
        >
          {menuAbierto ? <X size={30} /> : <Menu size={30} />}
        </button>

        {/* 🔗 Menú de escritorio */}
        <div className="hidden md:flex space-x-6 items-center text-gray-700 font-medium">
          <Link to="/inicio" className="hover:text-pink-500 transition">
            Inicio
          </Link>
          <Link to="/productos" className="hover:text-pink-500 transition">
            Productos
          </Link>
          <BlogDropdown />
          <Link to="/contacto" className="hover:text-pink-500 transition">
            Contacto
          </Link>
        </div>

        {/* 🛒 Carrito + sesión */}
        <div className="hidden md:flex items-center space-x-4">
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

      {/* 📱 Menú móvil desplegable */}
      {menuAbierto && (
        <div className="md:hidden bg-pink-50 border-t border-pink-200 mt-2 space-y-4 py-4 px-6 text-center text-gray-700 font-medium animate-slideDown">
          <Link to="/" className="block hover:text-pink-500" onClick={() => setMenuAbierto(false)}>
            Inicio
          </Link>
          <Link to="/productos" className="block hover:text-pink-500" onClick={() => setMenuAbierto(false)}>
            Productos
          </Link>
          <Link to="/nosotros" className="block hover:text-pink-500" onClick={() => setMenuAbierto(false)}>
            Nosotros✨
          </Link>
          <BlogDropdown />
          <Link to="/contacto" className="block hover:text-pink-500" onClick={() => setMenuAbierto(false)}>
            Contacto
          </Link>

          <div className="pt-4 border-t border-gray-200">
            {usuario ? (
              <>
                <span className="block text-pink-700 font-semibold mb-2">
                  Hola, {usuario.nombre?.split(" ")[0]} ✨
                </span>
                <button
                  onClick={handleLogout}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded-lg"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuAbierto(false)}
                  className="block w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded-lg mb-2"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  onClick={() => setMenuAbierto(false)}
                  className="block w-full border border-pink-500 text-pink-600 font-bold py-2 rounded-lg hover:bg-pink-50"
                >
                  Registrarme
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
