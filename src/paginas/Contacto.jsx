import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import Swal from "sweetalert2";

// Firebase
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Contacto() {
  const sectionRef = useRef(null);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    if (window.location.hash === "#contacto") {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || !formData.mensaje) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor llena todos los campos 💌",
        confirmButtonColor: "#e06b8b",
      });
      return;
    }

    try {
      await addDoc(collection(db, "mensajesContacto"), {
        nombre: formData.nombre,
        email: formData.email,
        mensaje: formData.mensaje,
        fecha: serverTimestamp(),
      });

      Swal.fire({
        icon: "success",
        title: "¡Mensaje enviado!",
        text: "Gracias por contactarte con NovaGlow 🌸 Te responderemos pronto.",
        confirmButtonColor: "#e06b8b",
      });

      setFormData({ nombre: "", email: "", mensaje: "" });
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      Swal.fire({
        icon: "error",
        title: "Error al enviar",
        text: "Hubo un problema 😢 Intenta nuevamente.",
        confirmButtonColor: "#e06b8b",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center bg-pink-50 relative overflow-hidden"
      id="contacto"
    >
      {/* ✔ Header FIX - usando HEX, no okLCH */}
      <motion.header
        data-aos="fade-down"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          background:
            "linear-gradient(to right, #f9a8d4, #f472b6, #ec4899)", // pink-300 → pink-400 → pink-500
        }}
        className="w-full text-white shadow-md py-4 px-6 flex items-center justify-center space-x-3 rounded-b-3xl"
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdLs5Kjrl497ZOGYAMibYSX4tY-8HF8uM33Q&s"
          alt="Logo NovaGlow"
          className="w-12 h-12 rounded-full object-cover border-2 border-pink-400 shadow-md"
        />
        <h1 className="text-2xl text-white font-bold tracking-wide">
          NovaGlow ✨
        </h1>
      </motion.header>

      {/* ✔ Fondo animado FIX */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(255,192,203,0.25), transparent), radial-gradient(circle at 80% 70%, rgba(255,182,193,0.25), transparent)",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
      />

      {/* Contenido */}
      <motion.div
        data-aos="fade-up"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, ease: "easeOut" }}
        className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mt-12 w-full max-w-lg border border-pink-200 z-10"
      >
        <motion.h2
          className="text-3xl font-bold text-pink-700 mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          💌 Contáctanos
        </motion.h2>

        <p className="text-center text-pink-600 mb-6">
          ¿Tienes dudas sobre tallas, colores o envíos?  
          En <strong>NovaGlow</strong> queremos ayudarte a brillar con estilo ✨
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {["nombre", "email", "mensaje"].map((field, idx) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.5, duration: 0.6 }}
              whileHover={{ scale: 1.01 }}
            >
              <label className="block text-pink-700 font-semibold mb-2 capitalize">
                {field === "email" ? "Correo electrónico" : field}
              </label>

              {field === "mensaje" ? (
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:ring-2 focus:ring-pink-400 outline-none bg-white h-32 transition-all"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                />
              ) : (
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:ring-2 focus:ring-pink-400 outline-none bg-white transition-all"
                  placeholder={
                    field === "nombre" ? "Tu nombre" : "Tu correo electrónico"
                  }
                />
              )}
            </motion.div>
          ))}

          {/* Botón enviar */}
          <motion.button
            whileHover={{
              scale: 1.03,
              backgroundColor: "#ec7a9d",
              boxShadow: "0px 0px 12px rgba(224,107,139,0.5)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            type="submit"
            className="w-full bg-pink-500 text-white font-semibold py-3 rounded-lg transition-all duration-300"
          >
            Enviar mensaje 💬
          </motion.button>
        </form>

        {/* Info */}
        <motion.div
          data-aos="fade-up"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="bg-white rounded-2xl border border-pink-200 p-5 mt-10 text-pink-700 shadow-sm"
        >
          <h3 className="text-center text-2xl font-bold mb-3">
            💖 ¿Quieres visitarnos?
          </h3>
          <p className="text-center mb-4">
            Estamos ubicados en{" "}
            <strong>Av. Perú 2456, San Martín de Porres, Lima</strong>  
            (dentro del CETPRO San Martín de Porres).
          </p>

          <p className="font-semibold">🕒 Horario de atención:</p>
          <ul className="list-disc list-inside mb-3">
            <li>✨ Lunes a Viernes: 9:00am a 8:00pm</li>
            <li>✨ Sábados: 10:00am a 6:00pm</li>
            <li>✨ Domingos: 11:00am a 4:00pm</li>
          </ul>

          <p className="font-semibold">🚍 Transporte público:</p>
          <p className="mb-3">
            Puedes tomar cualquier bus o combi que recorra la Av. Perú.  
            Bájate en el paradero frente al CETPRO San Martín de Porres.
          </p>

          <p className="font-semibold">🚗 Transporte privado:</p>
          <p>
            Si vienes en auto, puedes ingresar por la Av. Perú.  
            Encuéntranos fácilmente en Google Maps como{" "}
            <strong>NovaGlow</strong> 
          </p>
        </motion.div>

        {/* Mapa */}
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center text-pink-700 font-semibold mt-10 mb-3 text-lg"
        >
          📍 ¿Dónde nos encontramos?
        </motion.h3>

        <motion.div
          data-aos="fade-up"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden border-4 border-pink-300 shadow-md"
        >
          <iframe
            title="Ubicación NovaGlow"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.34663617231!2d-77.06295722579449!3d-12.019640241394551!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105cede39f7dc47%3A0x73c5c016d20e66a3!2sCETPRO%20San%20Mart%C3%ADn%20de%20Porres!5e0!3m2!1ses!2spe!4v1761064346856!5m2!1ses!2spe"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </motion.div>

        <p className="text-center text-pink-600 mt-6 font-semibold">
           Visítanos en <span className="text-pink-700">NovaGlow</span> y
          brilla con estilo ✨
        </p>
      </motion.div>

      {/* Botón flotante */}
      <motion.a
        href="https://wa.me/51943461700"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg z-50"
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        whileHover={{
          scale: 1.15,
          boxShadow: "0 0 12px rgba(72, 187, 120, 0.6)",
        }}
      >
        💬
      </motion.a>
    </section>
  );
}
