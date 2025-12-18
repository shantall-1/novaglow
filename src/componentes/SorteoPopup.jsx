import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function SorteoPopup({ isOpen, onClose }) {
  const navigate = useNavigate();

  const irAlSorteo = () => {
  onClose();
  navigate("/");

  setTimeout(() => {
    document
      .getElementById("sorteo-bad-bunny")
      ?.scrollIntoView({ behavior: "smooth" });
  }, 300);
};


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full overflow-hidden grid md:grid-cols-2"
          >
            {/* 🖼 IMAGEN */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:block"
            >
              <img
                src="/bbticket.jpg"
                alt="Bad Bunny Tour"
                className="h-full w-full object-cover"
              />
            </motion.div>

            {/* 📝 TEXTO */}
            <div className="p-10 md:p-14 flex flex-col justify-center text-center md:text-left">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm font-bold tracking-widest text-rose-500 uppercase mb-3"
              >
                Sorteo exclusivo
              </motion.h3>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-black leading-tight mb-4"
              >
                Bad Bunny <br />
                <span className="text-rose-500 italic font-serif">
                  World Tour
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 mb-8 text-sm leading-relaxed"
              >
                Participa por una <strong>entrada doble</strong> para el concierto de Bad
                Bunny en Lima 2026. <br />
                <strong className="text-rose-500">COMPRA YA!</strong> Y estarás participando.
              </motion.p>

              {/* 🎯 CTA */}
              <motion.button
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.6 }}
  onClick={irAlSorteo}
  className="mx-auto md:mx-0 px-10 py-4 rounded-full bg-gray-900 text-white font-bold tracking-wide hover:bg-rose-600 transition-all shadow-lg hover:shadow-rose-300/40"
>
  Participar ahora ✨
</motion.button>

              <button
                onClick={onClose}
                className="mt-4 text-xs text-gray-400 hover:text-gray-600"
              >
                Tal vez luego
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
