import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import CarritoIcon from "../componentes/carritoIcon";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem("novaglow_session");
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("novaglow_session");
    setUser(null);
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-extrabold text-pink-500 hover:text-pink-600 transition-colors"
          onClick={closeMenu}
        >
          NovaGlow 💖
        </Link>

        {/* Botón Hamburguesa */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Links Desktop */}
        <div className="hidden md:flex items-center space-x-8 text-lg font-medium">
          <NavLink to="/inicio" className={({ isActive }) => isActive ? "text-pink-500" : "hover:text-pink-500"}>Inicio</NavLink>
          <NavLink to="/productos" className={({ isActive }) => isActive ? "text-pink-500" : "hover:text-pink-500"}>Productos</NavLink>
          <NavLink to="/nosotros" className={({ isActive }) => isActive ? "text-pink-500" : "hover:text-pink-500"}>Nosotros</NavLink>
          <NavLink to="/contacto" className={({ isActive }) => isActive ? "text-pink-500" : "hover:text-pink-500"}>Contacto</NavLink>

          {user ? (
            <>
              <span className="text-pink-600 font-semibold">
                Hola, {user.nombre?.split(" ")[0] || "Amiga"} 💖
              </span>
              <button
                onClick={handleLogout}
                className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium px-3 py-1 rounded-lg transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-pink-500">Iniciar sesión</NavLink>
              <NavLink to="/registro" className="hover:text-pink-500">Registrarse</NavLink>
            </>
          )}
          <CarritoIcon />
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 flex flex-col items-center space-y-4 py-4 text-lg font-medium">
          <NavLink to="/inicio" onClick={closeMenu} className="hover:text-pink-500">Inicio</NavLink>
          <NavLink to="/productos" onClick={closeMenu} className="hover:text-pink-500">Productos</NavLink>
          <NavLink to="/nosotros" onClick={closeMenu} className="hover:text-pink-500">Nosotros</NavLink>
          <NavLink to="/contacto" onClick={closeMenu} className="hover:text-pink-500">Contacto</NavLink>

          {user ? (
            <>
              <span className="text-pink-600 font-semibold">
                Hola, {user.nombre?.split(" ")[0] || "Amiga"} 💖
              </span>
              <button
                onClick={() => { handleLogout(); closeMenu(); }}
                className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium px-3 py-1 rounded-lg transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu} className="hover:text-pink-500">Iniciar sesión</NavLink>
              <NavLink to="/registro" onClick={closeMenu} className="hover:text-pink-500">Registrarse</NavLink>
            </>
          )}
          <CarritoIcon />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
