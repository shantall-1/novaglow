import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, Shield, LogOut, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CarritoIcon from "../componentes/CarritoIcon";
import PerfilModal from "../componentes/PerfilModal";
import { useAuth } from "../context/AuthContext";
import BlogDropdown from "../componen/BlogDropdown";
import BlogDropdownMobile from "../componen/BlogDropdownMobile";
import { useUserData } from "../componentes/useUserData";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout, cargando } = useAuth();
  const { userData } = useUserData();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  // Detectar scroll para cambiar la densidad del navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mostrarCargando = () => {
    setGlobalLoading(true);
    setTimeout(() => setGlobalLoading(false), 1500);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const puedeVerIntranet = userData?.rol === 'admin' || userData?.rol === 'editor';
  const fotoNavbar = usuario?.foto || usuario?.photoURL || null;

  // Componente interno para Links con animación hover
  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className="relative group px-1 py-2">
        <span className={`font-medium transition-colors duration-300 ${isActive ? 'text-pink-600' : 'text-gray-600 group-hover:text-pink-500'}`}>
          {children}
        </span>
        <span className={`absolute bottom-0 left-0 h-0.5 bg-pink-400 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
      </Link>
    );
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled 
            ? "bg-white/80 backdrop-blur-xl border-pink-100 py-2 shadow-sm" 
            : "bg-white/60 backdrop-blur-md border-transparent py-4"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-6">

          {/* 🌸 Logo con Efecto Glow */}
          <Link to="/" className="flex items-center group relative">
            <span className="text-3xl md:text-4xl font-bold font-[Dancing Script] bg-linear-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent drop-shadow-sm transition-all group-hover:scale-105">
              NovaGlow
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

          {/* 🔗 Navegación Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/inicio">Inicio</NavLink>
            <NavLink to="/productos">Productos</NavLink>
            <BlogDropdown />
            <NavLink to="/contacto">Contacto</NavLink>
          
            {/* 🛡️ Badge Intranet */}
            {puedeVerIntranet && (
                <Link 
                  to="/intranet" 
                  className="group flex items-center gap-2 bg-linear-to-r from-rose-50 to-pink-50 text-pink-700 text-xs font-bold px-4 py-1.5 rounded-full border border-pink-200 hover:border-pink-400 hover:shadow-md transition-all duration-300"
                >
                  <Shield size={14} className="group-hover:rotate-12 transition-transform" />
                  INTRANET
                </Link>
            )}
          </div>

          {/* 🛒 Acciones de Usuario */}
          <div className="flex items-center space-x-5">
            <CarritoIcon
              onLoginRequired={() => {
                mostrarCargando();
                navigate("/login");
              }}
            />

            {/* Separador vertical */}
            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

            {usuario ? (
              <div className="flex items-center space-x-3">
                {/* Chip de Usuario */}
                <div 
                  onClick={() => setShowPerfil(true)}
                  className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-pink-50 transition-colors border border-transparent hover:border-pink-100 group"
                >
                  {fotoNavbar ? (
                    <img
                      src={fotoNavbar}
                      alt="Perfil"
                      className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-pink-400 to-rose-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {usuario.displayName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  
                  <div className="hidden lg:flex flex-col items-start leading-none">
                    <span className="text-xs text-gray-400 font-medium">Hola,</span>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-pink-600 transition-colors">
                      {usuario.displayName?.split(" ")[0]}
                    </span>
                  </div>
                </div>

                <button
                    onClick={handleLogout}
                    title="Cerrar Sesión"
                    className="hidden md:flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                >
                    <LogOut size={18} />
                </button>
              </div>

            ) : (
              /* 🔓 Botones Invitado */
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login" className="text-gray-600 hover:text-pink-600 font-medium text-sm transition-colors">
                  Ingresar
                </Link>
                <Link
                  to="/registro"
                  className="bg-gray-900 hover:bg-pink-600 text-white text-sm font-bold py-2 px-5 rounded-full transition-all shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transform hover:-translate-y-0.5"
                >
                  Registrarme
                </Link>
              </div>
            )}

            {/* 📱 Toggle Menú Móvil */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              {menuAbierto ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>

        {/* 🚪 Menú móvil (Glassmorphism Overlay) */}
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

                {/* Lista de enlaces móvil */}
                <div className="flex flex-col space-y-2 overflow-y-auto flex-1">
                  <MobileLink to="/inicio" onClick={() => setMenuAbierto(false)}>Inicio</MobileLink>
                  <MobileLink to="/productos" onClick={() => setMenuAbierto(false)}>Productos</MobileLink>
                  
                  {/* Dropdown Blog Móvil integrado */}
                  <div className="py-2 border-b border-gray-50">
                     <BlogDropdownMobile closeMenu={() => setMenuAbierto(false)} />
                  </div>

                  <MobileLink to="/contacto" onClick={() => setMenuAbierto(false)}>Contacto</MobileLink>

                  {puedeVerIntranet && (
                    <Link 
                      to="/intranet" 
                      onClick={() => setMenuAbierto(false)}
                      className="flex items-center justify-between p-3 mt-2 bg-pink-50 rounded-xl text-pink-700 font-bold border border-pink-100"
                    >
                      <span className="flex items-center gap-2"><Shield size={16}/> Intranet Privada</span>
                      <ChevronRight size={16} />
                    </Link>
                  )}
                </div>

                {/* Footer del Menú Móvil */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                  {usuario ? (
                    <div className="space-y-3">
                        <div 
                            onClick={() => { setShowPerfil(true); setMenuAbierto(false); }}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer active:scale-95 transition"
                        >
                            {fotoNavbar ? (
                                <img src={fotoNavbar} alt="User" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                                    {usuario.displayName?.charAt(0)}
                                </div>
                            )}
                            <div>
                                <p className="font-bold text-gray-800">{usuario.displayName}</p>
                                <p className="text-xs text-gray-500">Ver mi perfil</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 text-rose-500 font-semibold p-3 hover:bg-rose-50 rounded-xl transition"
                        >
                            <LogOut size={18} /> Cerrar Sesión
                        </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link 
                        to="/login" 
                        onClick={() => setMenuAbierto(false)}
                        className="flex justify-center py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
                      >
                        Ingresar
                      </Link>
                      <Link 
                        to="/registro" 
                        onClick={() => setMenuAbierto(false)}
                        className="flex justify-center py-3 rounded-xl bg-pink-600 text-white font-bold shadow-lg shadow-pink-200"
                      >
                        Registrarme
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <PerfilModal isOpen={showPerfil} onClose={() => setShowPerfil(false)} />

      {/* Overlay de Carga Global */}
      <AnimatePresence>
        {(cargando || globalLoading) && (
          <motion.div
            className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
             <div className="relative">
                <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-[Dancing Script] text-pink-600 font-bold">N</div>
             </div>
             <p className="mt-4 text-gray-500 font-medium animate-pulse">Cargando...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Componente helper para links móviles
const MobileLink = ({ to, onClick, children }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center justify-between p-3 text-lg font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50/50 rounded-xl transition-all"
  >
    {children}
    <ChevronRight size={16} className="text-gray-300" />
  </Link>
);

export default Navbar;