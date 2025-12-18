import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle, ArrowLeft, Heart } from "lucide-react";
import FavoritosModal from "../paginas/FavoritosModal";
import { useAuth } from "../context/AuthContext";

export default function Confirmacion() {
  const { usuario } = useAuth();

  const nombreUsuario = usuario?.displayName?.split(" ")[0] || "Bella";

  // 🔥 ESTADO QUE FALTABA
  const [showFavoritos, setShowFavoritos] = useState(false);

  useEffect(() => {
  // 🔥 FUERZA LIBERACIÓN TOTAL DEL SCROLL
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";

  return () => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  };
}, []);

  useEffect(() => {
  document.body.style.overflow = "auto";
}, []);


  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#fb7185", "#f43f5e", "#e11d48"]
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#fb7185", "#f43f5e", "#e11d48"]
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  }, []);

  return (
     <div className="min-h-screen relative flex items-center justify-center p-4 font-sans bg-white selection:text-rose-900">

      {/* Fondo animado */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse delay-1000"></div>
        <div className="absolute top-[20%] right-[20%] w-[200px] h-[200px] bg-pink-100 rounded-full mix-blend-multiply filter blur-[60px] opacity-50 hidden md:block"></div>
      </div>

      {/* Tarjeta */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/50 text-center overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-rose-400 via-pink-500 to-purple-500"></div>

        <div className="p-10 md:p-14 flex flex-col items-center">

          {/* Icono */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 shadow-inner"
          >
            <CheckCircle size={48} className="text-green-500" strokeWidth={2.5} />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-4 leading-none">
            YAY! <br />
            <span className="text-rose-500 font-serif italic">ORDEN REALIZADA</span>
          </h2>

          <p className="text-gray-600 text-lg font-medium mb-2">
            ¡Gracias por tu compra,{' '}
            <span className="font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-rose-600 drop-shadow-sm">
              {nombreUsuario}
            </span>! 💖
          </p>

          <div className="text-gray-400 text-sm max-w-xs mx-auto mb-10 space-y-2">
  <p>
    Tu pedido está siendo procesado con mucho amor. Te enviaremos los detalles a tu correo pronto.
  </p>
  <p>
    <span className="font-bold text-red-500">¡YA ESTÁS PARTICIPANDO!</span> en el sorteo. ¡Mucha suerte!
  </p>
</div>

          {/* Botones */}
          <div className="flex flex-col gap-3 w-full">
            <Link
              to="/"
              className="group relative w-full py-4 bg-gray-900 text-white font-bold rounded-full text-lg shadow-xl hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Volver a la tienda
              </span>
            </Link>

            {/* 🔥 BOTÓN DE FAVORITOS FUNCIONAL */}
            <button
              onClick={() => setShowFavoritos(true)}
              className="w-full py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-full hover:bg-gray-50 flex items-center justify-center gap-2 text-sm"
            >
              <Heart size={16} className="text-pink-500" /> Ver mis favoritos
            </button>
          </div>

          {/* 🔥 MODAL DE FAVORITOS */}
          <FavoritosModal
            isOpen={showFavoritos}
            onClose={() => setShowFavoritos(false)}
          />

          <div className="mt-8 flex items-center gap-2 text-rose-300 text-xs font-bold tracking-widest uppercase opacity-80">
            <Heart size={12} fill="currentColor" /> NovaGlow Style
          </div>

        </div>
      </motion.div>
    </div>
  );
}
