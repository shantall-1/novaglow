import React, { useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, MapPin, CreditCard, Save, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";

const EditarDatosModal = ({ isOpen, onClose }) => {
  const { usuario, updateEmail, updateDireccion, updateMetodoPago } = useAuth();

  // Estados locales inicializados con datos del usuario
  const [nuevoCorreo, setNuevoCorreo] = useState(usuario?.email || "");
  const [nuevaDireccion, setNuevaDireccion] = useState(usuario?.direccion || "");
  const [nuevoMetodoPago, setNuevoMetodoPago] = useState(usuario?.metodoPago || "");
  
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState(""); // 'success' o 'error'

  if (!usuario) return null;

  // --- CONFETI ---
  const dispararConfeti = () => {
    const canvas = document.createElement("canvas");
    Object.assign(canvas.style, {
      position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh",
      pointerEvents: "none", zIndex: "999999"
    });
    document.body.appendChild(canvas);
    
    const myConfetti = confetti.create(canvas, { resize: true });
    myConfetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#fb7185", "#f43f5e", "#e11d48"]
    });
    
    setTimeout(() => canvas.remove(), 1500);
  };

  // --- VALIDACIONES ---
  const validarCorreo = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // --- GUARDAR ---
  const guardarDatos = async () => {
    setMensaje(null);

    // Validaciones Locales
    if (!validarCorreo(nuevoCorreo)) {
      setTipoMensaje("error");
      setMensaje("El correo no es válido.");
      return;
    }
    if (!nuevaDireccion.trim()) {
        setTipoMensaje("error");
        setMensaje("La dirección es requerida.");
        return;
    }
    if (!nuevoMetodoPago.trim()) {
        setTipoMensaje("error");
        setMensaje("El método de pago es requerido.");
        return;
    }

    setSubiendo(true);
    try {
      // Actualizamos solo si hubo cambios
      if (nuevoCorreo !== usuario.email) await updateEmail(nuevoCorreo);
      if (nuevaDireccion !== usuario.direccion) await updateDireccion(nuevaDireccion);
      if (nuevoMetodoPago !== usuario.metodoPago) await updateMetodoPago(nuevoMetodoPago);

      dispararConfeti();
      setTipoMensaje("success");
      setMensaje("¡Datos actualizados correctamente!");
      
      setTimeout(() => {
        setMensaje(null);
        onClose();
      }, 1500);

    } catch (err) {
      console.error(err);
      setTipoMensaje("error");
      setMensaje("Error al actualizar: " + err.message);
    }
    setSubiendo(false);
  };

  // Usamos Portal para renderizar fuera del flujo normal (Z-Index fix)
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 font-sans">
          
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              onClick={onClose}
            >
              <X size={20} />
            </button>

            {/* --- CONTENIDO --- */}
            <div className="relative z-10 p-8 pt-10 overflow-y-auto custom-scrollbar">
                
                <div className="flex flex-col items-center mb-8">
                    {/* FOTO ACTUAL (Solo visual) */}
                    <div className="w-24 h-24 rounded-full p-1 bg-linear-to-tr from-rose-300 to-purple-300 mb-4 shadow-lg">
                        <img
                            src={usuario.foto || usuario.photoURL || `https://ui-avatars.com/api/?name=${usuario.displayName}`}
                            alt="Perfil"
                            className="w-full h-full object-cover rounded-full border-4 border-white"
                        />
                    </div>

                    <h2 className="text-3xl font-black tracking-tighter text-gray-900 leading-none text-center">
                        EDITAR <span className="text-rose-500 font-serif italic">DATOS</span>
                    </h2>
                    <p className="text-gray-500 text-xs mt-2 font-medium uppercase tracking-wide">
                        Mantén tu información al día
                    </p>
                </div>

                {/* MENSAJES DE ESTADO */}
                <AnimatePresence mode="wait">
                    {mensaje && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`w-full p-3 rounded-xl text-xs font-bold text-center mb-6 flex items-center justify-center gap-2 ${
                                tipoMensaje === 'success' 
                                    ? "bg-green-50 border border-green-100 text-green-600" 
                                    : "bg-red-50 border border-red-100 text-red-500"
                            }`}
                        >
                            {tipoMensaje === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                            {mensaje}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-4">
                    
                    {/* CAMPO: CORREO */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                            <input
                                type="email"
                                value={nuevoCorreo}
                                onChange={(e) => setNuevoCorreo(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 text-sm font-medium transition-all"
                                placeholder="tu@email.com"
                            />
                        </div>
                    </div>

                    {/* CAMPO: DIRECCIÓN */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Dirección de Envío</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                            <input
                                type="text"
                                value={nuevaDireccion}
                                onChange={(e) => setNuevaDireccion(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 text-sm font-medium transition-all"
                                placeholder="Ej: Av. Siempre Viva 123"
                            />
                        </div>
                    </div>

                    {/* CAMPO: MÉTODO DE PAGO */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Método de Pago Preferido</label>
                        <div className="relative group">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                            <input
                                type="text"
                                value={nuevoMetodoPago}
                                onChange={(e) => setNuevoMetodoPago(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 text-sm font-medium transition-all"
                                placeholder="Ej: Tarjeta Crédito / Yape"
                            />
                        </div>
                    </div>

                    {/* BOTÓN GUARDAR */}
                    <button
                        onClick={guardarDatos}
                        disabled={subiendo}
                        className="w-full mt-6 py-4 bg-gray-900 text-white font-bold rounded-full text-sm shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {subiendo ? (
                            "Guardando..."
                        ) : (
                            <>
                                <Save size={18} /> Guardar Cambios
                            </>
                        )}
                    </button>

                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default EditarDatosModal;