import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase"; 
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function CouponNovaGlow({
  items = ["Chaqueta acolchada", "Suéter de punto", "Pantalón cargo", "Vestido midi"],
  onClaim = () => {},
  onClose = () => {}, // Función para cerrar el modal (viene del padre)
  delay = 2500 
}) {
  const { usuario: user, cargando: loading } = useAuth();
  const navigate = useNavigate();

  const [showCinematic, setShowCinematic] = useState(true);
  const [showCoupon, setShowCoupon] = useState(false);
  const [yaReclamado, setYaReclamado] = useState(false); 
  
  // Eliminamos mensaje, esError, y showResult
  
  const [selectedItem, setSelectedItem] = useState(null); 
  const [errorSeleccion, setErrorSeleccion] = useState("");

  const CUPON_ID = "PRIMERA20"; 

  useEffect(() => {
    if (loading) return;

    // --- 1. Lógica de Firebase (Asíncrona) ---
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

    // --- 2. Lógica de Transición (Temporizador) ---
    let t;
    
    t = setTimeout(() => {
        if (showCinematic) {
            setShowCinematic(false);
            
            if (!yaReclamado) {
                 setShowCoupon(true);
            }
        }
    }, delay);


    return () => {
        if (t) clearTimeout(t);
    };
  }, [user, delay, loading, showCinematic, yaReclamado]);


const handleReclamar = async () => {
  if (!selectedItem) {
    setErrorSeleccion("Por favor, selecciona un producto para aplicar el descuento.");
    return;
  }
  setErrorSeleccion("");

  if (loading) {
    alert("Estamos verificando tu sesión. Inténtalo de nuevo en un momento.");
    return; 
  }
  
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

    // 🏆 Éxito: Muestra un alert y luego cierra el modal
    const successMessage = 
      `🎉 ¡Cupón Reclamado con Éxito! 🎉\n\n` +
      `Código: ${CUPON_ID}\n` +
      `El descuento del 20% aplica para la prenda: "${selectedItem}".\n\n` +
      `Revisa tu correo (${user.email}) para más detalles.`;
      
    alert(successMessage);
    
    setYaReclamado(true); 
    onClaim();
    onClose();

  } catch (error) {

    const errorMessage = 
      `❌ Hubo un error al reclamar el cupón.\n\n` + 
      `Verifica tu conexión e intenta de nuevo. (Detalles: ${error.message})`;
    
    alert(errorMessage);
  
  }
};

  
  const handleSelect = (item) => {
      setSelectedItem(item);
      setErrorSeleccion("");
  };

  // 1. Bloqueo de Carga
  if (loading) { 
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
        <div className="text-white text-xl font-bold">Cargando...</div>
      </div>
    );
  }
  
  if (yaReclamado) { 
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/90 p-8 rounded-2xl shadow-xl max-w-md text-center border border-pink-200"
        >
          <h2 className="text-3xl font-bold text-pink-600 mb-3">
            ¡Cupón ya reclamado!
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Revisa tu correo para más detalles o explora nuestra tienda para más ofertas exclusivas.
          </p>
          <button
            onClick={onClose}
            className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-xl shadow font-medium"
          >
            Cerrar
          </button>
        </motion.div>
      </div>
    );
  }

  // 3. Renderizado principal (Cinemática o Cupón/Formulario)
  return (
    <AnimatePresence>
      <motion.div
        key="modal-overlay" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-50 bg-linear-to-br from-pink-700/90 via-purple-900/90 to-black/90 backdrop-blur-md flex items-center justify-center"
      >
        {/* -------- CINEMÁTICA -------- */}
        {showCinematic && (
          <motion.div
            key="cinematic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0">
              <div className="nova-bg absolute inset-0" />
              <div className="nova-ring absolute -top-24 -left-24 w-240 h-240" />
              <div className="absolute inset-0 pointer-events-none">
                <div className="spark" style={{ top: "20%", left: "10%" }} />
                <div className="spark" style={{ top: "40%", left: "80%" }} />
                <div className="spark" style={{ top: "70%", left: "50%" }} />
                <div className="spark" style={{ top: "25%", left: "60%" }} />
                <div className="spark" style={{ top: "55%", left: "20%" }} />
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: "anticipate" }}
              className="relative z-10 text-center px-6"
            >
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
                ✨ NOVAGLOW ✨
              </h2>
              <p className="mt-3 text-sm md:text-base text-pink-100/90">
                Un brillo especial para tu primera compra...
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* -------- CUPÓN / FORMULARIO -------- */}
        {showCoupon && (
          <motion.div
            key="coupon"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-20 w-full max-w-2xl mx-4"
          >
            <div className="mx-auto bg-linear-to-br from-white/95 to-pink-50/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100/60 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">
                    ¡Felicidades!
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                    Cupón por primera compra
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-baseline space-x-2">
                    <span className="text-3xl md:text-4xl font-extrabold text-pink-600">
                      20%
                    </span>
                    <span className="text-sm text-gray-500">descuento</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 md:py-8 text-center">
                
                <AnimatePresence mode="wait">
                  {/* Aquí solo mostramos el formulario, ya que el resultado es un alert */}
                  <motion.div 
                      key="coupon-form" 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                  >
                      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                        OBTUVO UN DESCUENTO DEL{" "}
                        <span className="font-semibold">20%</span> EN PRENDAS
                        SELECCIONADAS POR SU PRIMERA COMPRA.
                        <br/>
                        **¡Selecciona una prenda para activar tu descuento!**
                      </p>

                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {items.map((it, i) => {
                          const isSelected = selectedItem === it;
                          const itemClass = isSelected 
                            ? "bg-pink-100/90 border-pink-500 ring-2 ring-pink-500 scale-[1.02]" 
                            : "bg-white/80 border-gray-100 hover:bg-pink-50/70";

                          return (
                            <button
                              key={i}
                              onClick={() => handleSelect(it)}
                              className={`flex items-center space-x-3 rounded-xl p-3 border shadow-sm transition transform text-left w-full ${itemClass}`}
                            >
                              <div className={`w-10 h-10 rounded-md bg-linear-to-br flex items-center justify-center font-semibold text-sm ${isSelected ? 'from-pink-500 to-pink-600 text-white' : 'from-pink-100 to-pink-50 text-pink-600'}`}>
                                {i + 1}
                              </div>
                              <div className="text-sm text-gray-800">{it}</div>
                            </button>
                          );
                        })}
                      </div>
                      
                      {errorSeleccion && (
                          <p className="mt-3 text-sm font-medium text-red-600 animate-pulse">
                              {errorSeleccion}
                          </p>
                      )}

                      <p className="mt-1 text-xs text-gray-500">
                        Aplica solo en la prenda seleccionada. Ver términos en la tienda.
                      </p>

                      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex gap-3 justify-center sm:justify-start">
                          <button
                            onClick={handleReclamar}
                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-medium shadow-md transition"
                          >
                            Reclamar descuento
                          </button>
                          <button
                            onClick={onClose}
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl font-medium transition shadow-sm"
                          >
                            Cerrar
                          </button>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <div>
                            Código:{" "}
                            <span className="font-semibold text-gray-700">
                              {CUPON_ID}
                            </span>
                          </div>
                          <div className="mt-1">Válido: 30 días desde la recepción</div>
                        </div>
                      </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      {/* --- Estilos NovaGlow --- */}
      <style key="styles">{` 
        .nova-bg {
          background:
            radial-gradient(20rem 20rem at 10% 30%, rgba(255,182,193,0.25), transparent 15%),
            radial-gradient(18rem 18rem at 80% 70%, rgba(255,105,180,0.18), transparent 12%),
            linear-gradient(135deg, rgba(255,240,245,0.05), rgba(255,230,240,0.02));
          animation: nova-shift 3.2s ease-in-out infinite alternate;
          filter: blur(18px) contrast(1.05);
        }
        .nova-ring {
          background: conic-gradient(from 90deg at 50% 50%, rgba(255,105,180,0.06), rgba(99,102,241,0.06), rgba(59,130,246,0.06));
          transform: rotate(12deg);
          filter: blur(28px) saturate(120%);
          animation: ring-rotate 5s linear infinite;
          opacity: 0.95;
          border-radius: 50%;
        }
        @keyframes nova-shift {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-10px) scale(1.02); opacity: 0.95; }
        }
        @keyframes ring-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spark {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          box-shadow: 0 0 18px 6px rgba(255, 182, 193, 0.6);
          background: radial-gradient(circle at 40% 30%, white 0%, rgba(255,255,255,0.9) 10%, rgba(255,192,203,0.6) 45%, transparent 60%);
          opacity: 0;
          animation: sparkle 1.6s linear infinite;
          transform: translate(-50%, -50%) scale(0.8);
        }
        .spark:nth-child(1) { animation-delay: 0.05s; }
        .spark:nth-child(2) { animation-delay: 0.35s; }
        .spark:nth-child(3) { animation-delay: 0.7s; }
        .spark:nth-child(4) { animation-delay: 1.0s; }
        .spark:nth-child(5) { animation-delay: 1.4s; }
        @keyframes sparkle {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5) rotate(0deg); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2) rotate(10deg); }
          60% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.9) rotate(40deg); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.4) rotate(80deg); }
        }
      `}</style>
    </AnimatePresence>
  );
}