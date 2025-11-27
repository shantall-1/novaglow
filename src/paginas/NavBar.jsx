import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Shield, LogOut, ChevronRight, User, ShoppingBag, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Componentes y Contextos
import CarritoIcon from "../componentes/CarritoIcon";
import { useAuth } from "../context/AuthContext";
import { useUserData } from "../componentes/useUserData";
import BlogDropdown from "../componen/BlogDropdown";
import BlogDropdownMobile from "../componen/BlogDropdownMobile";

// Modales
import MiCuenta from "../paginas/MiCuentaModal";
import EditarDatosModal from "../componentes/EditarDatosModal";
import MisPedidosModal from "../componentes/MisPedidosModal";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { usuario, logout, cargando, updateUserProfile } = useAuth();
  const { userData } = useUserData();

  // Estados visuales
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  // Estados de Modales y Menús
  const [menuUsuario, setMenuUsuario] = useState(false);
  const [showCuenta, setShowCuenta] = useState(false); // Modal de Login/Registro
  const [showEditarDatos, setShowEditarDatos] = useState(false);
  const [showMisPedidos, setShowMisPedidos] = useState(false);

  // Estados para edición
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState(usuario?.displayName || "");
  const [nuevaFotoURL, setNuevaFotoURL] = useState("");
  const [previewFoto, setPreviewFoto] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const puedeVerIntranet = userData?.rol === 'admin' || userData?.rol === 'editor';
  const fotoNavbar = usuario?.foto || usuario?.photoURL || null;

  // --- EFECTOS ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (usuario?.displayName) setNuevoNombre(usuario.displayName);
  }, [usuario]);

  const mostrarCargando = () => {
    setGlobalLoading(true);
    setTimeout(() => setGlobalLoading(false), 1500);
  };

  const handleLogout = async () => {
    await logout();
    setMenuUsuario(false);
    navigate("/");
  };

  // --- CONFETI Y GUARDADO ---
  const dispararConfeti = () => {
    const canvas = document.createElement("canvas");
    Object.assign(canvas.style, {
      position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh",
      pointerEvents: "none", zIndex: "999999"
    });
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

  // Helper Link
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

          {/* 🌸 Logo */}
          <Link to="/" className="flex items-center group relative">
            <span className="text-3xl md:text-4xl font-bold font-[Dancing Script] bg-linear-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent drop-shadow-sm transition-all group-hover:scale-105">
              NovaGlow
            </span>
            <motion.span 
              className="absolute -top-1 -right-2 text-yellow-400"
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
          </Link>

          {/* 🔗 Menú Central */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/inicio">Inicio</NavLink>
            <NavLink to="/productos">Productos</NavLink>
            <BlogDropdown />
            <NavLink to="/contacto">Contacto</NavLink>
          
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

          {/* 🛒 Acciones Derecha */}
          <div className="flex items-center space-x-5">
            <CarritoIcon
              onLoginRequired={() => {
                mostrarCargando();
                setShowCuenta(true);
              }}
            />

            {/* Separador */}
            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

            {/* LÓGICA DE USUARIO / INVITADO */}
            {usuario ? (
              // 🟢 USUARIO LOGUEADO
              <div className="relative flex items-center space-x-3">
                <div 
                  onClick={() => setMenuUsuario(!menuUsuario)}
                  className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-pink-50 transition-colors border border-transparent hover:border-pink-100 group select-none"
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

                {/* Dropdown del Usuario */}
                <AnimatePresence>
                  {menuUsuario && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-3 bg-white/95 backdrop-blur-xl shadow-2xl border border-pink-100 rounded-2xl w-72 max-h-[85vh] overflow-y-auto z-50 p-5 scrollbar-hide"
                    >
                      {/* ... (Contenido del Dropdown igual al anterior) ... */}
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Mi Perfil</h3>
                        <button onClick={() => setMenuUsuario(false)} className="text-gray-400 hover:text-pink-600">
                           <X size={18} />
                        </button>
                      </div>

                      <div className="flex flex-col items-center mb-5">
                        <div className="relative group">
                            <img src={previewFoto || fotoNavbar} alt="Perfil" className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"/>
                            {!previewFoto && (
                                <button onClick={() => setPreviewFoto(fotoNavbar)} className="absolute bottom-0 right-0 bg-pink-500 text-white p-1.5 rounded-full shadow-sm hover:scale-110 transition">
                                    <Edit2 size={12} />
                                </button>
                            )}
                        </div>
                        <p className="text-lg font-bold text-gray-800 mt-2">{usuario.displayName}</p>
                        <p className="text-xs text-gray-500">{usuario.email}</p>
                      </div>

                      <div className="space-y-2">
                        {/* Editar Nombre */}
                        <div className="bg-pink-50/50 rounded-xl p-3 transition-all">
                            <button onClick={() => setEditandoNombre(!editandoNombre)} className="w-full flex items-center justify-between text-pink-700 font-medium text-sm hover:text-pink-800">
                                <span className="flex items-center gap-2"><User size={16}/> Cambiar Nombre</span>
                                <ChevronRight size={14} className={`transform transition ${editandoNombre ? 'rotate-90' : ''}`}/>
                            </button>
                            <AnimatePresence>
                                {editandoNombre && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="mt-3 flex flex-col gap-2">
                                    <input type="text" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white" placeholder="Nuevo nombre"/>
                                    <button onClick={guardarNombre} disabled={subiendo} className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-2 rounded-lg transition">{subiendo ? "Guardando..." : "Guardar Cambios"}</button>
                                    </div>
                                </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        {/* Editar Foto */}
                        <div className="bg-pink-50/50 rounded-xl p-3 transition-all">
                             <button onClick={() => setPreviewFoto(previewFoto ? null : fotoNavbar)} className="w-full flex items-center justify-between text-pink-700 font-medium text-sm hover:text-pink-800">
                                <span className="flex items-center gap-2"><Edit2 size={16}/> Cambiar Foto (URL)</span>
                                <ChevronRight size={14} className={`transform transition ${previewFoto && !editandoNombre ? 'rotate-90' : ''}`}/>
                            </button>
                            <AnimatePresence>
                                {previewFoto && !editandoNombre && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="mt-3 flex flex-col gap-2">
                                            <input type="text" placeholder="Pega URL de la imagen" value={nuevaFotoURL} onChange={(e) => { setNuevaFotoURL(e.target.value); if(e.target.value) setPreviewFoto(e.target.value); }} className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"/>
                                            <button onClick={guardarFoto} disabled={subiendo} className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-2 rounded-lg transition">Actualizar Foto</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button onClick={() => { setShowMisPedidos(true); setMenuUsuario(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition font-medium text-sm">
                            <ShoppingBag size={18} /> Mis Pedidos
                        </button>
                        <button onClick={() => { setShowEditarDatos(true); setMenuUsuario(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition font-medium text-sm">
                            <Shield size={18} /> Datos de Cuenta
                        </button>
                        <div className="h-px bg-gray-100 my-2"></div>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-rose-500 hover:bg-rose-50 rounded-lg transition font-bold text-sm">
                            <LogOut size={18} /> Cerrar Sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            ) : (
              // ⚪ MODO INVITADO (AQUÍ ESTÁ EL CAMBIO)
              <button
                onClick={() => setShowCuenta(true)}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-all border border-transparent hover:border-pink-200"
                title="Iniciar Sesión / Registrarse"
              >
                <User size={24} />
              </button>
            )}

            {/* 📱 Botón Menú Móvil */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              {menuAbierto ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>

        {/* 🚪 Menú móvil (Sin cambios mayores) */}
        <AnimatePresence>
          {menuAbierto && (
            <>
              <motion.div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuAbierto(false)} />
              <motion.div className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-2xl z-50 p-6 flex flex-col" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
                <div className="flex justify-between items-center mb-8">
                  <span className="text-2xl font-bold font-[Dancing Script] text-pink-600">NovaGlow</span>
                  <button onClick={() => setMenuAbierto(false)} className="p-2 bg-gray-100 rounded-full hover:bg-pink-100 transition"><X size={20} className="text-gray-600" /></button>
                </div>

                <div className="flex flex-col space-y-2 overflow-y-auto flex-1">
                  <MobileLink to="/inicio" onClick={() => setMenuAbierto(false)}>Inicio</MobileLink>
                  <MobileLink to="/productos" onClick={() => setMenuAbierto(false)}>Productos</MobileLink>
                  <div className="py-2 border-b border-gray-50"><BlogDropdownMobile closeMenu={() => setMenuAbierto(false)} /></div>
                  <MobileLink to="/contacto" onClick={() => setMenuAbierto(false)}>Contacto</MobileLink>
                  {puedeVerIntranet && (<Link to="/intranet" onClick={() => setMenuAbierto(false)} className="flex items-center justify-between p-3 mt-2 bg-pink-50 rounded-xl text-pink-700 font-bold border border-pink-100"><span className="flex items-center gap-2"><Shield size={16}/> Intranet</span><ChevronRight size={16} /></Link>)}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100">
                  {usuario ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            {fotoNavbar ? <img src={fotoNavbar} alt="User" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">{usuario.displayName?.charAt(0)}</div>}
                            <div><p className="font-bold text-gray-800">{usuario.displayName}</p><p className="text-xs text-gray-500">Sesión iniciada</p></div>
                        </div>
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-rose-500 font-semibold p-3 hover:bg-rose-50 rounded-xl transition"><LogOut size={18} /> Cerrar Sesión</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link to="/login" onClick={() => setMenuAbierto(false)} className="flex justify-center py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50">Ingresar</Link>
                      <Link to="/registro" onClick={() => setMenuAbierto(false)} className="flex justify-center py-3 rounded-xl bg-pink-600 text-white font-bold shadow-lg shadow-pink-200">Registrarme</Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* MODALES */}
      {showCuenta && <MiCuenta cerrar={() => setShowCuenta(false)} />}
      <EditarDatosModal isOpen={showEditarDatos} onClose={() => setShowEditarDatos(false)} />
      <MisPedidosModal isOpen={showMisPedidos} onClose={() => setShowMisPedidos(false)} />

      {/* LOADER */}
      <AnimatePresence>
        {(cargando || globalLoading) && (
          <motion.div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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

const MobileLink = ({ to, onClick, children }) => (
  <Link to={to} onClick={onClick} className="flex items-center justify-between p-3 text-lg font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50/50 rounded-xl transition-all">
    {children} <ChevronRight size={16} className="text-gray-300" />
  </Link>
);

export default Navbar;