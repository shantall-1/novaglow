import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CarritoIcon from "../componentes/CarritoIcon";
import { useAuth } from "../context/AuthContext";
import BlogDropdown from "../componen/BlogDropdown";
import BlogDropdownMobile from "../componen/BlogDropdownMobile";
import confetti from "canvas-confetti";
import { LogOut } from "lucide-react";
// Modales
import MiCuenta from "../paginas/MiCuentaModal";
import EditarDatosModal from "../componentes/EditarDatosModal";
import MisPedidosModal from "../componentes/MisPedidosModal";

const Navbar = () => {
  const { usuario, cargando, logout, updateUserProfile } = useAuth();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [showCuenta, setShowCuenta] = useState(false);
  const [showEditarDatos, setShowEditarDatos] = useState(false);
  const [showMisPedidos, setShowMisPedidos] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);

  // Opciones de perfil
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState(usuario?.displayName || "");
  const [nuevaFotoURL, setNuevaFotoURL] = useState("");
  const [previewFoto, setPreviewFoto] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const fotoNavbar = usuario?.foto || usuario?.photoURL || null;

  const mostrarCargando = () => {
    setGlobalLoading(true);
    setTimeout(() => setGlobalLoading(false), 1500);
  };

  const dispararConfeti = () => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";

    document.body.appendChild(canvas);
    const myConfetti = confetti.create(canvas, { resize: true });
    myConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => canvas.remove(), 1500);
  };

  const guardarNombre = async () => {
    if (!nuevoNombre.trim()) return;
    setSubiendo(true);
    try {
      await updateUserProfile({ nombre: nuevoNombre, foto: fotoNavbar });
      setEditandoNombre(false);
      dispararConfeti();
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el nombre");
    }
    setSubiendo(false);
  };

  const guardarFoto = async () => {
    if (!nuevaFotoURL.trim()) return;
    setSubiendo(true);
    try {
      await updateUserProfile({ nombre: usuario.displayName, foto: nuevaFotoURL });
      setPreviewFoto(null);
      setNuevaFotoURL("");
      dispararConfeti();
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar la foto");
    }
    setSubiendo(false);
  };

  return (
    <>
      <nav className="bg-pink-100/90 backdrop-blur-md shadow-sm fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-3">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl font-semibold text-pink-600 font-[Dancing Script] transition-all duration-500 group-hover:text-pink-700">
              🌸 NovaGlow 🌸
            </span>
            {/* Pequeña chispa decorativa */}
            <motion.span 
              className="absolute -top-1 -right-2 text-yellow-400"
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden md:flex space-x-6 items-center text-gray-700 font-medium">
            <Link to="/inicio" className="hover:text-pink-500 transition">Inicio</Link>
            <Link to="/productos" className="hover:text-pink-500 transition">Productos</Link>
            <BlogDropdown />
            <Link to="/contacto" className="hover:text-pink-500 transition">Contacto</Link>
          </div>

          {/* Carrito + Sesión */}
          <div className="flex items-center space-x-4">
            <CarritoIcon onLoginRequired={() => { mostrarCargando(); setShowCuenta(true); }} />

            {usuario ? (
              <div className="relative flex items-center space-x-3">

                {/* Foto */}
                {fotoNavbar ? (
                  <img
                    src={fotoNavbar}
                    alt="Perfil"
                    className="w-9 h-9 rounded-full border border-pink-400 shadow-sm object-cover cursor-pointer"
                    onClick={() => setMenuUsuario(!menuUsuario)}
                  />
                ) : (
                  <div
                    onClick={() => setMenuUsuario(!menuUsuario)}
                    className="w-9 h-9 rounded-full bg-pink-300 flex items-center justify-center text-white font-bold cursor-pointer"
                  >
                    {usuario.displayName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}

                <span
                  className="text-pink-700 font-semibold cursor-pointer select-none"
                  onClick={() => setMenuUsuario(!menuUsuario)}
                >
                  Hola, {usuario.displayName?.split(" ")[0]} ✨
                </span>

                <button
                    onClick={async () => { await logout(); setMenuUsuario(false); }}
                    title="Cerrar Sesión"
                    className="hidden md:flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                >
                    <LogOut size={18} />
                </button>
                {/* Menú Desplegable */}
                <AnimatePresence>
                  {menuUsuario && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute right-0 top-12 bg-white shadow-lg border border-pink-200 rounded-2xl w-64 max-h-96 overflow-y-auto z-50 p-4"
                    >
                      <div className="flex justify-end mb-2">
                        <X size={20} className="text-gray-500 cursor-pointer hover:text-pink-600" onClick={() => setMenuUsuario(false)} />
                      </div>

                      <div className="flex flex-col items-center mb-3">
                        {previewFoto || fotoNavbar ? (
                          <img
                            src={previewFoto || fotoNavbar}
                            alt="Perfil"
                            className="w-20 h-20 rounded-full border border-pink-400 shadow-sm object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-pink-300 flex items-center justify-center text-white text-2xl font-bold">
                            {usuario.displayName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                        <p className="text-pink-700 font-semibold mt-2">{usuario.displayName}</p>
                        <p className="text-gray-600 text-sm">{usuario.email}</p>
                      </div>

                      {/* Cambiar Nombre */}
                      <button
                        onClick={() => setEditandoNombre(!editandoNombre)}
                        className="w-full text-left px-4 py-2 hover:bg-pink-50 text-pink-700 font-medium rounded-lg mb-2"
                      >
                        {editandoNombre ? "Cancelar edición" : "Cambiar nombre"}
                      </button>
                      {editandoNombre && (
                        <div className="flex flex-col gap-2 mb-3">
                          <input
                            type="text"
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                            className="border px-3 py-2 rounded-xl text-center w-full"
                          />
                          <button
                            onClick={guardarNombre}
                            disabled={subiendo}
                            className="bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600"
                          >
                            Guardar nombre
                          </button>
                        </div>
                      )}

                      {/* Cambiar Foto */}
                      <button
                        onClick={() => setPreviewFoto(previewFoto ? null : fotoNavbar)}
                        className="w-full text-left px-4 py-2 hover:bg-pink-50 text-pink-700 font-medium rounded-lg mb-2"
                      >
                        Cambiar foto
                      </button>
                      {previewFoto && (
                        <div className="flex flex-col gap-2 mb-3">
                          <input
                            type="text"
                            placeholder="Pega URL de foto"
                            value={nuevaFotoURL}
                            onChange={(e) => { setNuevaFotoURL(e.target.value); setPreviewFoto(e.target.value); }}
                            className="border px-3 py-2 rounded-xl text-center w-full"
                          />
                          <button
                            onClick={guardarFoto}
                            disabled={subiendo}
                            className="bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600"
                          >
                            Guardar foto
                          </button>
                        </div>
                      )}

                      {/* Mis Pedidos */}
                      <button
                        onClick={() => { setShowMisPedidos(true); setMenuUsuario(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-pink-50 text-pink-700 font-medium rounded-lg mb-2"
                      >
                        Mis Pedidos
                      </button>

                      {/* Editar Datos */}
                      <button
                        onClick={() => { setShowEditarDatos(true); setMenuUsuario(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-pink-50 text-pink-700 font-medium rounded-lg mb-2"
                      >
                        Editar Datos
                      </button>

                      {/* Cerrar Sesión */}
                      <button
                        onClick={async () => { await logout(); setMenuUsuario(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-pink-100 font-semibold text-pink-600 rounded-lg"
                      >
                        Cerrar Sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowCuenta(true)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105"
              >
                Mi Cuenta
              </button>
            )}


            {/* Botón menú móvil */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              {menuAbierto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {menuAbierto && (
            <>
              {/* Backdrop oscuro */}
              <motion.div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuAbierto(false)}
              />
              
              {/* Drawer */}
              <motion.div
                className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-2xl z-50 p-6 flex flex-col"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <span className="text-2xl font-bold font-[Dancing Script] text-pink-600">NovaGlow</span>
                  <button onClick={() => setMenuAbierto(false)} className="p-2 bg-gray-100 rounded-full hover:bg-pink-100 transition">
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>
                <ul className="flex flex-col gap-4 text-gray-700 font-medium">
                  <Link to="/inicio" onClick={() => setMenuAbierto(false)}>Inicio</Link>
                  <Link to="/productos" onClick={() => setMenuAbierto(false)}>Productos</Link>
                  <BlogDropdownMobile closeMenu={() => setMenuAbierto(false)} />
                  <Link to="/contacto" onClick={() => setMenuAbierto(false)}>Contacto</Link>
                  {usuario && (
                    <li
                      className="cursor-pointer hover:text-pink-600 transition"
                      onClick={() => setMenuUsuario(true)}
                    >
                      Ver Perfil
                    </li>
                  )}
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Modales */}
      {showCuenta && <MiCuenta cerrar={() => setShowCuenta(false)} />}
      {showEditarDatos && <EditarDatosModal isOpen={showEditarDatos} onClose={() => setShowEditarDatos(false)} />}
      {showMisPedidos && <MisPedidosModal isOpen={showMisPedidos} onClose={() => setShowMisPedidos(false)} />}

      {/* Loader global */}
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
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
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
