import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase"; 
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function CouponNovaGlow({
  items = ["Chaqueta acolchada", "Suéter de punto", "Pantalón cargo", "Vestido midi"],
  onClaim = () => {},
  onClose = () => {},
  delay = 2500 // Un poco más de tiempo para leer el "UNLOCKED"
}) {
  const { usuario: user, cargando: loading } = useAuth();
  const navigate = useNavigate();

  const [showCinematic, setShowCinematic] = useState(true);
  const [showCoupon, setShowCoupon] = useState(false);
  const [yaReclamado, setYaReclamado] = useState(false); 
  const [selectedItem, setSelectedItem] = useState(null); 
  const [errorSeleccion, setErrorSeleccion] = useState("");

  const CUPON_ID = "PRIMERA20"; 

  // --- LÓGICA ---
  useEffect(() => {
    if (loading) return;

    const verificarCupon = async () => {
      if (user) {
        try {
          const ref = doc(db, "cuponesReclamados", user.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setYaReclamado(true);
            setShowCinematic(false); 
          }
        } catch (error) {
          console.error("Error verificando cupón:", error);
        }
      } 
    };

    verificarCupon();

    let t = setTimeout(() => {
        if (showCinematic) {
            setShowCinematic(false);
            if (!yaReclamado) setShowCoupon(true);
        }
    }, delay);

    return () => { if (t) clearTimeout(t); };
  }, [user, delay, loading, showCinematic, yaReclamado]);


  const handleReclamar = async () => {
    if (!selectedItem) {
      setErrorSeleccion("⚠ Selecciona una prenda.");
      return;
    }
    setErrorSeleccion("");
    if (loading) return;
    
    if (!user) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate("/login");
      return;
    }

    try {
      await setDoc(doc(db, "cuponesReclamados", user.uid), {
        uid: user.uid,
        email: user.email,
        fecha: new Date().toISOString(),
        cupon: CUPON_ID,
        productoReclamado: selectedItem,
        estado: "reclamado"
      });

      alert(`✨ ¡LISTO! CUPÓN ACTIVADO PARA: ${selectedItem} ✨`);
      setYaReclamado(true); 
      onClaim();
      onClose();
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleSelect = (item) => {
      setSelectedItem(item);
      setErrorSeleccion("");
  };

  // --- RENDERIZADO: YA RECLAMADO ---
  if (yaReclamado) { 
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
        <div className="absolute inset-0" onClick={onClose}></div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 rounded-4xl max-w-sm w-full text-center shadow-2xl relative z-101"
        >
          <div className="text-4xl mb-2"></div>
          <h2 className="text-xl font-black text-gray-900 mb-1">Cupón Activado</h2>
          <p className="text-sm text-gray-500 mb-4">Ya reclamaste esta oferta.</p>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="w-full bg-black text-white py-3 rounded-xl font-bold cursor-pointer hover:scale-105 transition"
          >
            Entendido
          </button>
        </motion.div>
      </div>
    );
  }

  if (loading) return null;

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <AnimatePresence>
      <motion.div
        key="modal-overlay" 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-90 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      >
        <div className="absolute inset-0" onClick={onClose}></div>

        {/* FASE 1: CINEMÁTICA (Intro con Sticker UNLOCKED recuperado) */}
        {showCinematic && (
          <motion.div
            key="cinematic"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
            className="relative z-50 pointer-events-none flex flex-col items-center justify-center"
          >
             <div className="relative">
                 <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none drop-shadow-2xl">
                    OFERTA <br />
                    <span className="text-transparent text-outline-white">SECRETA</span>
                 </h2>
                 
                 {/* ¡AQUÍ ESTÁ EL BOTÓN ROSA (STICKER) QUE QUERÍAS! */}
                 <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 12 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                    className="absolute -top-4 -right-6 bg-rose-500 text-white font-bold px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.6)] border-2 border-white/20 text-sm md:text-base animate-pulse"
                 >
                    DESBLOQUEADO 🔓
                 </motion.div>
             </div>
          </motion.div>
        )}

        {/* FASE 2: CUPÓN COMPACTO (Grid 2x2) */}
        {showCoupon && (
          <motion.div
            key="coupon"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-lg bg-white rounded-2rem shadow-2xl overflow-hidden z-100"
          >
            {/* Header Compacto */}
            <div className="bg-black text-white px-6 py-4 relative flex justify-between items-center">
                <div>
                    <span className="bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded">First Order</span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-black tracking-tighter text-white">20%</span>
                        <span className="text-lg text-gray-400 font-bold italic">OFF</span>
                    </div>
                </div>
                <div className="text-right">
                    <h3 className="text-lg font-black italic tracking-tighter opacity-80">NOVA GLOW</h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white text-xl font-bold px-2 cursor-pointer">✕</button>
                </div>
            </div>

            {/* Cuerpo Compacto */}
            <div className="p-6 bg-white">
                <p className="text-sm text-gray-500 font-medium mb-4 text-center">
                    Selecciona tu prenda favorita:
                </p>

                {/* GRID 2 COLUMNAS (Estilo Compacto) */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {items.map((it, i) => {
                        const isSelected = selectedItem === it;
                        return (
                            <motion.button
                                key={i}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSelect(it)}
                                className={`group flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-200 cursor-pointer h-24 text-center ${
                                    isSelected 
                                    ? "border-black bg-gray-50 shadow-inner" 
                                    : "border-gray-100 hover:border-gray-300 bg-white"
                                }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 mb-2 flex items-center justify-center transition-colors ${
                                    isSelected ? "border-black bg-black" : "border-gray-300"
                                }`}>
                                    {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                                </div>
                                <span className={`text-xs font-bold leading-tight px-1 ${isSelected ? "text-black" : "text-gray-500 group-hover:text-black"}`}>
                                    {it}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>

                {errorSeleccion && (
                    <div className="mb-3 text-rose-500 text-xs font-bold text-center animate-pulse">
                        ⚠ {errorSeleccion}
                    </div>
                )}

                <button
                    onClick={handleReclamar}
                    className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold text-base shadow-lg hover:bg-rose-600 transition-colors active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                    RECLAMAR CUPÓN
                </button>

                <p className="mt-3 text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
                    Code: {CUPON_ID}
                </p>
            </div>
            
            {/* Decoración Ticket abajo */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[radial-gradient(circle,transparent_50%,#fff_55%)] bg-position-[10px_10px] rotate-180 translate-y-0.5"></div>

          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}