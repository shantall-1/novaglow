import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

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

  const handleSubmit = (e) => {
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

    Swal.fire({
      icon: "success",
      title: "¡Mensaje enviado!",
      text: "Gracias por contactarte con NovaGlow 🌸 Te responderemos pronto.",
      confirmButtonColor: "#e06b8b",
    });

    setFormData({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center bg-pink-50 relative overflow-hidden"
      id="contacto"
    >
      {/* 🌸 Banner más pequeño, no fijo */}
      <header
        data-aos="fade-down"
        className="w-full bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500 text-white shadow-md py-4 px-6 flex items-center justify-center space-x-3 rounded-b-3xl"
      >
        <img
          src="https://instagram.flim28-2.fna.fbcdn.net/v/t51.2885-19/472336448_1352704565888446_6811578739214593275_n.jpg?stp=dst-jpg_s150x150_tt6"
          alt="Logo NovaGlow"
          className="w-12 h-12 rounded-full object-cover border-2 border-pink-100 shadow-md"
        />
        <h1 className="text-2xl font-bold tracking-wide">NovaGlow ✨</h1>
      </header>

      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,192,203,0.3),transparent),radial-gradient(circle_at_80%_70%,rgba(255,182,193,0.3),transparent)]"></div>

      {/* Contenedor principal */}
      <div
        data-aos="fade-up"
        className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mt-12 w-full max-w-lg border border-pink-200 z-10"
      >
        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">
          💌 Contáctanos
        </h2>
        <p className="text-center text-pink-600 mb-6">
          ¿Tienes dudas sobre tallas, colores o envíos?  
          En <strong>NovaGlow</strong> queremos ayudarte a brillar con estilo ✨
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-pink-700 font-semibold mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:ring-2 focus:ring-pink-400 outline-none bg-white"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-pink-700 font-semibold mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:ring-2 focus:ring-pink-400 outline-none bg-white"
              placeholder="Tu correo"
            />
          </div>

          <div>
            <label className="block text-pink-700 font-semibold mb-2">
              Mensaje
            </label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:ring-2 focus:ring-pink-400 outline-none bg-white h-32"
              placeholder="Cuéntanos en qué podemos ayudarte..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
          >
            Enviar mensaje 💬
          </button>
        </form>

        {/* 🩷 Sección de información: AHORA ANTES DEL MAPA */}
        <div
          data-aos="fade-up"
          className="bg-white rounded-2xl border border-pink-200 p-5 mt-10 text-pink-700 shadow-sm"
        >
          <h3 className="text-center text-2xl font-bold mb-3">
            💖 ¿Quieres visitarnos?
          </h3>
          <p className="text-center mb-4">
            Estamos ubicados en <strong>Av. Perú 2456, San Martín de Porres, Lima</strong>  
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
            Encuéntranos fácilmente en Google Maps como <strong>NovaGlow</strong> 💅
          </p>
        </div>

        {/* 📍 Mapa */}
        <h3 className="text-center text-pink-700 font-semibold mt-10 mb-3 text-lg">
          📍 ¿Dónde nos encontramos?
        </h3>
        <div
          data-aos="fade-up"
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
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <p className="text-center text-pink-600 mt-6 font-semibold">
          💗 Visítanos en <span className="text-pink-700">NovaGlow</span> y brilla con estilo ✨
        </p>
      </div>

      {/* 💬 Botón flotante de WhatsApp */}
      <a
        href="https://wa.me/51941433000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 z-50"
      >
        💬
      </a>
    </section>
  );
}
