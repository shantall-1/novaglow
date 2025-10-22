import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react"; // iconos hamburguesa
import CarritoIcon from "../componentes/carritoIcon";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-pink-500 hover:text-pink-600 transition-colors"
          onClick={closeMenu}
        >
          NovaGlow
        </Link>

        {/* BOTÓN HAMBURGUESA (solo en móvil) */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* LINKS PRINCIPALES (desktop) */}
        <div className="hidden md:flex items-center space-x-8 text-lg font-medium">
          <NavLink
            to="/inicio"
            className={({ isActive }) =>
              isActive ? "text-pink-500" : "hover:text-pink-500"
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/productos"
            className={({ isActive }) =>
              isActive ? "text-pink-500" : "hover:text-pink-500"
            }
          >
            Productos
          </NavLink>

          <NavLink
            to="/nosotros"
            className={({ isActive }) =>
              isActive ? "text-pink-500" : "hover:text-pink-500"
            }
          >
            Nosotros
          </NavLink>

          <NavLink
            to="/contacto"
            className={({ isActive }) =>
              isActive ? "text-pink-500" : "hover:text-pink-500"
            }
          >
            Contacto
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "text-pink-500" : "hover:text-pink-500"
            }
          >
            Iniciar sesión
          </NavLink>

          {/* Ícono del carrito */}
          <CarritoIcon />
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 flex flex-col items-center space-y-4 py-4 text-lg font-medium">
          <NavLink
            to="/inicio"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "text-pink-500" : "hover:text-pink-500"
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/productos"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "text-pink-500" : "hover:text-pink-500"
            }
          >
            Productos
          </NavLink>

          <NavLink
            to="/nosotros"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "text-pink-500" : "hover:text-pink-500"
            }
          >
            Nosotros
          </NavLink>

          <NavLink
            to="/contacto"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "text-pink-500" : "hover:text-pink-500"
            }
          >
            Contacto
          </NavLink>

          <NavLink
            to="/login"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "text-pink-500" : "hover:text-pink-500"
            }
          >
            Iniciar sesión
          </NavLink>

          <CarritoIcon />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
