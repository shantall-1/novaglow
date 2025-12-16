import { useState } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PropositoMisionVision() {
  const [active, setActive] = useState("mision");

  return (
    <section className="w-full min-h-screen flex flex-col gap-20 ">
      {/* PROPÓSITO FULL SCREEN */}
      <div className="relative w-full h-screen rounded-2xl overflow-hidden shadow-xl">
        <img
          src="https://i.gifer.com/3KiU.gif"
          alt="GIF Propósito"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center p-6">
          <h2 className="text-5xl md:text-7xl font-extrabold uppercase text-white drop-shadow-xl mb-6 animate-fade-in">
            Nuestro Propósito
          </h2>

          <p className="text-2xl md:text-3xl text-white max-w-4xl mx-auto leading-relaxed font-light drop-shadow-xl animate-fade-in-delay">
            Empoderamos a cada mujer para que brille sin pedir permiso, redefiniendo la moda de noche como una experiencia emocional y responsable.
          </p>
        </div>
      </div>

      {/* MISIÓN Y VISIÓN – PANTALLA COMPLETA + DESLIZANTE */}
      <div className="w-full">
        <div className="flex justify-center gap-6 mb-10">
          <button onClick={() => setActive("mision")} className={`px-8 py-3 rounded-full border-2 text-lg font-semibold transition ${active === "mision" ? "bg-pink-600 text-white border-pink-600" : "bg-white text-pink-600 border-pink-400"}`}>Misión</button>
          <button onClick={() => setActive("vision")} className={`px-8 py-3 rounded-full border-2 text-lg font-semibold transition ${active === "vision" ? "bg-pink-600 text-white border-pink-600" : "bg-white text-pink-600 border-pink-400"}`}>Visión</button>
        </div>

        <div className="relative w-full h-screen overflow-hidden rounded-2xl shadow-2xl">
          <AnimatePresence mode="wait">
            {active === "mision" && (
              <motion.div key="mision" initial={{ x: "-100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} transition={{ duration: 0.7, ease: "easeInOut" }} className="absolute inset-0 grid md:grid-cols-2 h-full">
                <div className="flex flex-col justify-center p-10 bg-white/80 backdrop-blur-lg">
                  <h2 className="text-5xl font-bold text-gray-900 mb-6">Nuestra Misión</h2>
                  <p className="text-gray-700 text-xl leading-relaxed mb-4">Buscamos empoderar a cada mujer a través de prendas que celebran autenticidad, calidad y confianza.</p>
                  <p className="text-gray-900 font-semibold text-2xl">En Nova Glow, tú eres la protagonista.</p>
                </div>

                <div className="relative overflow-hidden">
                  <img src="https://i.gifer.com/VLaV.gif" alt="Misión" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                </div>
              </motion.div>
            )}

            {active === "vision" && (
              <motion.div key="vision" initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "-100%", opacity: 0 }} transition={{ duration: 0.7, ease: "easeInOut" }} className="absolute inset-0 grid md:grid-cols-2 h-full">
                <div className="flex flex-col justify-center p-10 bg-white/80 backdrop-blur-lg">
                  <h2 className="text-5xl font-bold text-gray-900 mb-6">Nuestra Visión</h2>
                  <p className="text-gray-700 text-xl leading-relaxed mb-4">Ser un referente global de moda ética y emocional, inspirando a mujeres a expresar su poder personal.</p>
                  <p className="text-gray-900 font-semibold text-2xl">Un futuro donde cada prenda cuente una historia.</p>
                </div>

                <div className="relative overflow-hidden">
                  <img src="https://i.gifer.com/Uf1g.gif" alt="Visión" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}
