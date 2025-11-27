import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Check } from "lucide-react";

export default function Suscripcion({ minimal = false }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      await addDoc(collection(db, "suscriptores"), {
        email,
        fecha: serverTimestamp(),
      });

      setStatus("success");
      setEmail("");
      
      if (!minimal) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ec4899', '#ffffff', '#f472b6']
        });
      }

      // Resetear estado después de unos segundos
      setTimeout(() => setStatus("idle"), 4000);

    } catch (err) {
      console.error("Error guardando suscripción:", err);
      setStatus("idle");
    }
  };

  // --- VARIANTE 1: MINIMALISTA (Para sidebars o footers claros) ---
  if (minimal) {
    return (
      <div className="w-full">
        <form onSubmit={handleSubmit} className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "success" || status === "loading"}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm py-3 pl-12 pr-12 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all"
          />
          <button
            type="submit"
            disabled={status === "success" || status === "loading"}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-lg text-pink-500 hover:bg-pink-50 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? (
              <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            ) : status === "success" ? (
              <Check size={18} className="text-green-500" />
            ) : (
              <ArrowRight size={18} />
            )}
          </button>
        </form>
        {status === "success" && (
          <motion.p 
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className="text-xs text-green-600 font-bold mt-2 text-center"
          >
            ¡Listo! Gracias por unirte. ✨
          </motion.p>
        )}
      </div>
    );
  }

  // --- VARIANTE 2: PREMIUM DARK CARD (Para secciones principales) ---
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-[3rem] bg-black text-white shadow-2xl shadow-pink-500/20"
    >
      {/* Fondo abstracto animado */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-600/30 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
        
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="py-10"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.6)]">
                <Check size={40} className="text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-2">¡Bienvenida al Club!</h3>
              <p className="text-gray-400 text-lg">Revisa tu bandeja de entrada para tu regalo de bienvenida.</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
                NO TE PIERDAS <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-rose-500 to-purple-500 italic font-serif pr-2">
                  EL GLOW
                </span>
              </h2>
              
              <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light">
                Únete a nuestra lista VIP. Sin spam, solo drops exclusivos, descuentos secretos y buenas vibras.
              </p>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto relative group">
                <div className="absolute inset-0 bg-linear-to-r from-pink-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-2 transition-all focus-within:border-pink-500/50 focus-within:bg-white/15">
                  <Mail className="ml-4 text-gray-400" size={24} />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading"}
                    className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-3 outline-none font-medium"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-white text-black hover:bg-pink-500 hover:text-white px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2"
                  >
                    {status === "loading" ? "..." : "Unirse"}
                  </button>
                </div>
              </form>
              
              <p className="mt-6 text-xs text-gray-600 uppercase tracking-widest">
                100% Gratis • Desuscríbete cuando quieras
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}