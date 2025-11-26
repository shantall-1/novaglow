import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Send, MapPin, Clock, Bus, Car, Mail, User, MessageSquare } from "lucide-react"; // Nuevos iconos

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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Scroll suave al cargar si hay hash
    if (window.location.hash === "#contacto") {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
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
        title: "Ups...",
        text: "Necesitamos todos tus datos para responderte 💌",
        confirmButtonColor: "#ec4899",
        background: "#fff",
        iconColor: "#ec4899",
        customClass: { popup: 'rounded-[2rem]' }
      });
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "mensajesContacto"), {
        nombre: formData.nombre,
        email: formData.email,
        mensaje: formData.mensaje,
        fecha: serverTimestamp(),
      });

      Swal.fire({
        icon: "success",
        title: "¡Enviado! ✨",
        text: "Gracias por escribirnos. Te responderemos muy pronto.",
        confirmButtonColor: "#000",
        background: "#fff",
        customClass: { popup: 'rounded-[2rem]' }
      });

      setFormData({ nombre: "", email: "", mensaje: "" });
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Algo salió mal. Intenta de nuevo por favor.",
        confirmButtonColor: "#000",
        customClass: { popup: 'rounded-[2rem]' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
        ref={sectionRef} 
        id="contacto"
        className="relative min-h-screen bg-[#FDFBFD] text-gray-800 font-sans selection:bg-pink-200 selection:text-pink-900 overflow-hidden"
    >
      {/* --- FONDO ATMOSFÉRICO (Noise & Blobs) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink-200/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-200/30 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        
        {/* 1. HEADER EDITORIAL */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
        >
            <div className="inline-flex items-center gap-2 bg-white border border-pink-100 px-4 py-1.5 rounded-full mb-6 shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Estamos en línea</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] mb-6">
                LET'S <br/>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-rose-600 italic font-serif pr-4">TALK</span>
            </h1>

            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                ¿Dudas sobre tallas, envíos o simplemente quieres decir hola? <br/>
                Estamos aquí para ayudarte a brillar.
            </p>
        </motion.div>

        {/* 2. GRID PRINCIPAL (Split Screen) */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* --- COLUMNA IZQUIERDA: FORMULARIO --- */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-pink-100/50 border border-white"
            >
                <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    Envíanos un mensaje <Send className="text-pink-500" />
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wide ml-2">Tu Nombre</label>
                        <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                name="nombre" 
                                value={formData.nombre} 
                                onChange={handleChange}
                                placeholder="Ej. Camila Glow"
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-pink-200 focus:bg-white rounded-2xl py-4 pl-14 pr-4 text-gray-900 font-medium outline-none transition-all duration-300 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wide ml-2">Tu Email</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange}
                                placeholder="hola@ejemplo.com"
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-pink-200 focus:bg-white rounded-2xl py-4 pl-14 pr-4 text-gray-900 font-medium outline-none transition-all duration-300 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wide ml-2">Mensaje</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-5 top-6 text-gray-400" size={20} />
                            <textarea 
                                name="mensaje" 
                                value={formData.mensaje} 
                                onChange={handleChange}
                                placeholder="Cuéntanos, ¿cómo podemos ayudarte?"
                                rows="4"
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-pink-200 focus:bg-white rounded-2xl py-4 pl-14 pr-4 text-gray-900 font-medium outline-none transition-all duration-300 placeholder:text-gray-400 resize-none"
                            />
                        </div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        type="submit"
                        className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-gray-400/20 hover:bg-pink-600 hover:shadow-pink-500/30 transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? "Enviando..." : "Enviar Mensaje"}
                        {!loading && <Send size={18} />}
                    </motion.button>
                </form>
            </motion.div>

            {/* --- COLUMNA DERECHA: INFO & MAPA (Bento Grid) --- */}
            <div className="space-y-6">
                
                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ubicación */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-white p-6 rounded-4xlshadow-lg border border-gray-100 hover:border-pink-200 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-4 group-hover:scale-110 transition-transform">
                            <MapPin size={24} />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Ubicación</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Av. Perú 2456, <br/> San Martín de Porres,<br/> Lima, Perú.
                        </p>
                    </motion.div>

                    {/* Horarios */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="bg-white p-6 rounded-4xl shadow-lg border border-gray-100 hover:border-pink-200 transition-colors group"
                    >
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
                            <Clock size={24} />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Horarios</h4>
                        <ul className="text-gray-500 text-sm space-y-1">
                            <li>L-V: 09:00 - 20:00</li>
                            <li>Sáb: 10:00 - 18:00</li>
                            <li>Dom: 11:00 - 16:00</li>
                        </ul>
                    </motion.div>

                    {/* Transporte */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="md:col-span-2 bg-white p-6 rounded-4xl shadow-lg border border-gray-100 hover:border-pink-200 transition-colors flex flex-col md:flex-row gap-6 items-start"
                    >
                         <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Bus size={20} /></div>
                                <h4 className="font-bold text-gray-900">Transporte Público</h4>
                            </div>
                            <p className="text-gray-500 text-sm">Cualquier bus por Av. Perú. Bajada en paradero CETPRO SMP.</p>
                         </div>
                         <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600"><Car size={20} /></div>
                                <h4 className="font-bold text-gray-900">Auto Privado</h4>
                            </div>
                            <p className="text-gray-500 text-sm">Entrada directa por Av. Perú. Estacionamiento disponible cerca.</p>
                         </div>
                    </motion.div>
                </div>

                {/* Mapa Widget */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative h-64 md:h-80 w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white"
                >
                    <iframe
                        title="Ubicación NovaGlow"
                        // Enlace corregido a la dirección solicitada
                        src="https://maps.google.com/maps?q=Av.+Perú+2456,+San+Martín+de+Porres&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: "grayscale(20%) contrast(1.2) opacity(0.9)" }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                    
                    {/* Botón flotante "Cómo llegar" sobre el mapa */}
                    <a 
                        href="https://goo.gl/maps/genericPlaceholder" 
                        target="_blank" rel="noreferrer"
                        className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-xs shadow-lg flex items-center gap-2 hover:bg-gray-50 transition"
                    >
                        Abrir en Maps ↗
                    </a>
                </motion.div>

            </div>
        </div>

      </div>

      {/* Botón WhatsApp Flotante */}
      <motion.a
        href="https://wa.me/51941433000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] z-50 flex items-center justify-center hover:bg-[#20bd5a] transition-colors"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
      </motion.a>
    </div>
  );
}