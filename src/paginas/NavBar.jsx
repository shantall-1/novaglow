

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CarritoIcon from "../componentes/CarritoIcon";
import PerfilModal from "../componentes/PerfilModal";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { usuario, logout, cargando } = useAuth();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  const mostrarCargando = () => {
    setGlobalLoading(true);
    setTimeout(() => setGlobalLoading(false), 1500);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Foto visible en navbar (corregido)
  const fotoNavbar = usuario?.foto || usuario?.photoURL || null;

  return (
    <>
      <nav className="bg-pink-100/90 backdrop-blur-md shadow-sm fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-3">

          {/* 🌸 Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl font-semibold text-pink-600 font-[Dancing Script] transition-all duration-500 group-hover:text-pink-700 group-hover:drop-shadow-[0_0_6px_rgba(236,72,153,0.6)]">
              🌸 NovaGlow 🌸
            </span>
          </Link>

          {/* 🔗 Navegación Desktop */}
          <div className="hidden md:flex space-x-6 items-center text-gray-700 font-medium">
            <Link to="/inicio" className="hover:text-pink-500 transition">Inicio</Link>
            <Link to="/productos" className="hover:text-pink-500 transition">Productos</Link>
            <Link to="/nosotros" className="hover:text-pink-500 transition">Nosotros</Link>
            <Link to="/contacto" className="hover:text-pink-500 transition">Contacto</Link>

            {usuario && (
              <button
                onClick={() => setShowPerfil(true)}
                className="hover:text-pink-600 flex items-center gap-1 transition"
              >
                <User size={18} /> Perfil
              </button>
            )}
          </div>

          {/* 🛒 Carrito + Sesión */}
          <div className="flex items-center space-x-4">

            <CarritoIcon
              onLoginRequired={() => {
                mostrarCargando();
                navigate("/login");
              }}
            />

            {/* 👤 Usuario logueado */}
            {usuario ? (
              <div className="flex items-center space-x-3">

                {/* Foto si existe */}
                {fotoNavbar ? (
                  <img
                    src={fotoNavbar}
                    alt="Perfil"
                    className="w-8 h-8 rounded-full border border-pink-400 shadow-sm object-cover cursor-pointer"
                    onClick={() => setShowPerfil(true)}
                  />
                ) : (
                  <div
                    onClick={() => setShowPerfil(true)}
                    className="w-8 h-8 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold cursor-pointer"
                  >
                    {usuario.displayName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}

                <span className="text-pink-700 font-semibold">
                  Hola, {usuario.displayName?.split(" ")[0]} ✨
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105"
                >
                  Cerrar Sesión
                </button>
              </div>

            ) : (
              /* 🔓 Invitado */
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

            {/* 📱 Botón menú móvil */}
            <button
              className="md:hidden text-pink-600"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              {menuAbierto ? <X size={26} /> : <Menu size={26} />}
            </button>

          </div>
        </div>

        {/* 🚪 Menú móvil */}
        <AnimatePresence>
          {menuAbierto && (
            <motion.div
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 p-5 border-r border-pink-200"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-pink-600">Menú</h2>
                <button onClick={() => setMenuAbierto(false)}>
                  <X size={22} className="text-pink-600" />
                </button>
              </div>

              <ul className="flex flex-col gap-4 text-gray-700 font-medium">
                <Link to="/" onClick={() => setMenuAbierto(false)}>Inicio</Link>
                <Link to="/productos" onClick={() => setMenuAbierto(false)}>Productos</Link>
                <Link to="/nosotros" onClick={() => setMenuAbierto(false)}>Nosotros</Link>
                <Link to="/contacto" onClick={() => setMenuAbierto(false)}>Contacto</Link>

                {usuario && (
                  <li
                    className="cursor-pointer hover:text-pink-600 transition"
                    onClick={() => {
                      setShowPerfil(true);
                      setMenuAbierto(false);
                    }}
                  >
                    Perfil
                  </li>
                )}

                {usuario ? (
                  <li
                    onClick={handleLogout}
                    className="text-pink-600 cursor-pointer hover:underline"
                  >
                    Cerrar sesión
                  </li>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuAbierto(false)}>
                      Iniciar Sesión
                    </Link>
                    <Link to="/registro" onClick={() => setMenuAbierto(false)}>
                      Registrarme
                    </Link>
                  </>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <PerfilModal isOpen={showPerfil} onClose={() => setShowPerfil(false)} />

      <AnimatePresence>
        {(cargando || globalLoading) && (
          <motion.div
            className="fixed inset-0 bg-white/90 flex items-center justify-center z-999"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.p
              className="text-pink-600 text-xl font-semibold"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.8,
              }}
            >
              Cargando...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;



