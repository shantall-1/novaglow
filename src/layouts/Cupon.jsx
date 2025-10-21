import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CouponNovaGlow({
  items = ["Chaqueta acolchada", "Suéter de punto", "Pantalón cargo", "Vestido midi"],
  onClaim = () => {},
  onClose = () => {},
  delay = 2500, // duración de la cinemática antes del cupón
}) {
  const [showCinematic, setShowCinematic] = useState(true);
  const [showCoupon, setShowCoupon] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Revisar si hay usuario logueado
    const user = localStorage.getItem("usuarioNovaGlow");
    if (user) {
      setUsuario(JSON.parse(user));
    }

    // Temporizador de cinemática → mostrar cupón
    const t = setTimeout(() => {
      setShowCinematic(false);
      setShowCoupon(true);
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);

  const handleReclamar = () => {
    if (!usuario) {
      // No logueado → redirigir al login
      navigate("/login");
      return;
    }

    // Logueado → mostrar mensaje
    setMensaje(`💌 Te hemos enviado el cupón a tu correo registrado (${usuario.email}).`);
    onClaim();
  };

  return (
    <AnimatePresence>
      {/* Overlay oscuro degradado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-50 bg-linear-to-br from-pink-700/90 via-purple-900/90 to-black/90 backdrop-blur-md flex items-center justify-center"
      >
        {/* Cinemática NovaGlow */}
        {showCinematic && (
          <motion.div
            key="cinematic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            {/* Fondos y partículas */}
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

            {/* Texto central */}
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

        {/* Cupón */}
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
                {!mensaje ? (
                  <>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      OBTUVO UN DESCUENTO DEL{" "}
                      <span className="font-semibold">20%</span> EN PRENDAS
                      SELECCIONADAS POR SU PRIMERA COMPRA.
                    </p>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {items.map((it, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-3 bg-white/80 rounded-xl p-3 border border-gray-100 shadow-sm"
                        >
                          <div className="w-10 h-10 rounded-md bg-linear-to-br from-pink-100 to-pink-50 flex items-center justify-center text-pink-600 font-semibold text-sm">
                            {i + 1}
                          </div>
                          <div className="text-sm text-gray-800">{it}</div>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-xs text-gray-500">
                      *Aplica solo en prendas seleccionadas. Ver términos en la tienda.
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
                            PRIMERA20
                          </span>
                        </div>
                        <div className="mt-1">Válido: 30 días desde la recepción</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-pink-600 mb-4">
                      🎁 ¡Cupón Enviado!
                    </h2>
                    <p className="text-gray-700">{mensaje}</p>
                    <button
                      onClick={onClose}
                      className="mt-6 bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-xl font-medium transition"
                    >
                      Cerrar
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* --- Estilos NovaGlow --- */}
      <style>{`
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
