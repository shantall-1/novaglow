import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Link } from "react-router-dom";
import { X, Mail, Lock, User, Camera, Eye, EyeOff, LogOut, ShoppingBag, Edit, ArrowRight, ShieldCheck } from "lucide-react";

export default function MiCuentaModal({ cerrar }) {
  const { 
    loginConEmail, 
    registrarUsuario, 
    loginConGoogle, 
    usuario,
    cerrarSesion 
  } = useAuth();

  const [modo, setModo] = useState("login");
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    fotoBase64: "",
  });

  const [mostrarPass, setMostrarPass] = useState(false);
  const [terminos, setTerminos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- LÓGICA ORIGINAL CONSERVADA ---
  const convertirABase64 = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(file);
    });

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      if (!files?.[0]) return;
      const base64 = await convertirABase64(files[0]);
      setForm((prev) => ({ ...prev, fotoBase64: base64 }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!terminos) return setError("Debes aceptar los términos y condiciones.");
    
    setLoading(true);
    try {
      await loginConEmail(form.email.toLowerCase(), form.password);
      confetti({ particleCount: 150, spread: 70, colors: ["#fb7185", "#f43f5e"] });
      cerrar();
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus datos.");
    }
    setLoading(false);
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError("");
    if (!terminos) return setError("Debes aceptar los términos y condiciones.");
    if (!form.nombre || !form.email || !form.password) return setError("Completa todos los campos.");

    setLoading(true);
    try {
      await registrarUsuario(
        form.email.toLowerCase(),
        form.password,
        form.nombre,
        form.fotoBase64 || ""
      );
      confetti({ particleCount: 200, spread: 80, colors: ["#fb7185", "#f43f5e"] });
      setModo("login");
    } catch (err) {
      setError("Error al registrarte. Intenta con otro correo.");
    }
    setLoading(false);
  };

  const loginGoogle = async () => {
    try {
      await loginConGoogle();
      confetti({ particleCount: 180, spread: 80, colors: ["#fb7185", "#f43f5e"] });
      cerrar();
    } catch (err) {
      setError("No pudimos conectar con Google.");
    }
  };

  // --- RENDERIZADO CON PORTAL Y NUEVA ESTÉTICA ---
  return ReactDOM.createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-sans">
        
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={cerrar}
        />

        <motion.div
          className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50 z-50 flex flex-col max-h-[90vh]"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
           {/* === FONDO ESTÉTICO === */}
           <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute top-[-20%] left-[-20%] w-[350px] h-[350px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-rose-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse delay-700"></div>
            </div>

            {/* BOTÓN CERRAR */}
            <button
                className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/50 hover:bg-rose-50 text-gray-500 hover:text-rose-600 transition shadow-sm backdrop-blur-md cursor-pointer"
                onClick={cerrar}
            >
                <X size={20} />
            </button>

            {/* --- CONTENIDO --- */}
            <div className="relative z-10 p-8 pt-10 overflow-y-auto custom-scrollbar">

                {usuario ? (
                    // 🌸 VISTA USUARIO LOGUEADO
                    <div className="flex flex-col items-center">
                        <span className="inline-block py-1 px-3 rounded-full border border-rose-200 bg-white/60 text-rose-600 text-[10px] font-bold tracking-widest uppercase mb-6 shadow-sm">
                            Mi Cuenta
                        </span>

                        <div className="relative mb-6">
                            <div className="w-28 h-28 rounded-full p-1 bg-linear-to-tr from-rose-400 to-purple-400">
                                <img
                                    src={usuario.foto || usuario.photoURL || `https://ui-avatars.com/api/?name=${usuario.displayName}&background=random`}
                                    className="w-full h-full object-cover rounded-full border-4 border-white"
                                    alt="Perfil"
                                />
                            </div>
                            <div className="absolute bottom-1 right-1 bg-gray-900 text-white p-2 rounded-full shadow-lg">
                                <User size={14} />
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 mb-1 text-center">
                            {usuario.displayName || "Usuario"}
                        </h2>
                        <p className="text-gray-500 text-sm font-medium mb-8">{usuario.email}</p>

                        <div className="w-full space-y-3">
                            <Link to="/perfil" onClick={cerrar} className="flex items-center gap-4 p-4 bg-white/60 hover:bg-white border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                                    <User size={20} />
                                </div>
                                <span className="font-bold text-gray-700 flex-1">Ver Perfil</span>
                                <ArrowRight size={18} className="text-gray-300 group-hover:text-rose-500" />
                            </Link>

                            <Link to="/mis-pedidos" onClick={cerrar} className="flex items-center gap-4 p-4 bg-white/60 hover:bg-white border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                    <ShoppingBag size={20} />
                                </div>
                                <span className="font-bold text-gray-700 flex-1">Mis Pedidos</span>
                                <ArrowRight size={18} className="text-gray-300 group-hover:text-purple-500" />
                            </Link>

                             <Link to="/editar-cuenta" onClick={cerrar} className="flex items-center gap-4 p-4 bg-white/60 hover:bg-white border border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <Edit size={20} />
                                </div>
                                <span className="font-bold text-gray-700 flex-1">Editar Datos</span>
                                <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500" />
                            </Link>
                        </div>

                        <button
                            onClick={async () => { await cerrarSesion(); cerrar(); }}
                            className="mt-8 text-rose-500 font-black text-xs uppercase tracking-widest hover:text-rose-700 flex items-center gap-2"
                        >
                            <LogOut size={14} /> Cerrar Sesión
                        </button>
                    </div>

                ) : (
                    // 🌸 VISTA LOGIN / REGISTRO
                    <div className="flex flex-col items-center">
                         <div className="text-center mb-8">
                            <h2 className="text-4xl font-black tracking-tighter text-gray-900 leading-[0.9]">
                                {modo === "login" ? "HELLO" : "JOIN"} <br/>
                                <span className="font-serif italic text-rose-500">
                                     {modo === "login" ? "GORGEOUS" : "THE CLUB"}
                                </span>
                            </h2>
                            <p className="text-gray-500 text-xs mt-3 font-medium uppercase tracking-wide">
                                {modo === "login" ? "Ingresa para brillar" : "Crea tu cuenta gratis"}
                            </p>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-red-50 border border-red-100 text-red-500 p-3 rounded-xl text-xs font-bold text-center mb-4">
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={modo === "login" ? handleLogin : handleRegistro} className="w-full space-y-3">
                            
                            {/* CAMPO NOMBRE (Solo Registro) */}
                            {modo === "registro" && (
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                                    <input
                                        name="nombre"
                                        placeholder="Tu Nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 text-sm font-medium transition-all"
                                    />
                                </div>
                            )}

                            {/* CAMPO EMAIL */}
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="tu@email.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 text-sm font-medium transition-all"
                                />
                            </div>

                            {/* CAMPO PASSWORD */}
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                                <input
                                    type={mostrarPass ? "text" : "password"}
                                    name="password"
                                    placeholder="Contraseña"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-3.5 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 text-sm font-medium transition-all"
                                />
                                <button type="button" onClick={() => setMostrarPass(!mostrarPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500">
                                    {mostrarPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>

                            {/* CAMPO FOTO (Solo Registro) */}
                            {modo === "registro" && (
                                <div className="relative group">
                                    <label className="flex items-center gap-3 w-full px-4 py-3 bg-white/50 border border-gray-200 border-dashed rounded-2xl cursor-pointer hover:bg-white hover:border-rose-300 transition-colors">
                                        <Camera className="text-gray-400 group-hover:text-rose-500" size={18} />
                                        <span className="text-sm text-gray-500 font-medium truncate">
                                            {form.fotoBase64 ? "Foto cargada exitosamente ✨" : "Subir foto de perfil (Opcional)"}
                                        </span>
                                        <input type="file" name="foto" accept="image/*" onChange={handleChange} className="hidden" />
                                    </label>
                                </div>
                            )}

                            {/* CHECKBOX TÉRMINOS */}
                            <label className="flex items-center gap-3 px-1 py-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${terminos ? 'bg-rose-500 border-rose-500' : 'bg-white border-gray-300 group-hover:border-rose-400'}`}>
                                    {terminos && <ShieldCheck size={14} className="text-white" />}
                                </div>
                                <input type="checkbox" checked={terminos} onChange={(e) => setTerminos(e.target.checked)} className="hidden" />
                                <span className="text-xs text-gray-500">
                                    Acepto los <Link to="/terminos" onClick={cerrar} className="text-rose-500 font-bold hover:underline">términos y condiciones</Link>
                                </span>
                            </label>

                            {/* BOTÓN PRINCIPAL */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gray-900 text-white font-bold rounded-full text-sm shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                            >
                                {loading ? "Procesando..." : (modo === "login" ? "Iniciar Sesión" : "Crear Cuenta")}
                                {!loading && <ArrowRight size={16} />}
                            </button>

                        </form>

                        {/* SEPARADOR */}
                        <div className="flex items-center gap-3 w-full my-6 opacity-60">
                            <div className="h-px bg-gray-300 flex-1"></div>
                            <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">OR</span>
                            <div className="h-px bg-gray-300 flex-1"></div>
                        </div>

                        {/* GOOGLE */}
                        <button
                            onClick={loginGoogle}
                            disabled={loading}
                            className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 text-sm shadow-sm"
                        >
                             <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>

                         {/* TOGGLE MODO */}
                        <div className="mt-6 text-center text-sm text-gray-500 font-medium">
                            {modo === "login" ? (
                                <>¿Nueva aquí? <button onClick={() => setModo("registro")} className="text-rose-500 font-bold hover:underline ml-1">Regístrate</button></>
                            ) : (
                                <>¿Ya tienes cuenta? <button onClick={() => setModo("login")} className="text-rose-500 font-bold hover:underline ml-1">Inicia Sesión</button></>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}