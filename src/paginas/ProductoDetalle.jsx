import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { productosData } from "../assets/productosData";
import { useCarrito } from "../context/CarritoContext";
import { motion, AnimatePresence } from "framer-motion"; // Animaciones

// Contexts y componentes
import { useFavoritos } from "../context/FavoriteContext";
import { useComentarios } from "../context/ComentariosContext";
import ModalFavoritos from "../componentes/ModalFavoritos";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { Star, Heart, ShoppingBag, Send, Play, Pause, X, Music, Disc } from "lucide-react"; // Iconos Lucide nuevos

// --- Datos recomendados (Sin cambios) ---
const maquillaje = [
  { id: 16, nombre: "Labial rosa nude", link: "https://i.pinimg.com/736x/ca/b8/29/cab8294334fe8a3d1bdcd72b3b57b25d.jpg" },
  { id: 17, nombre: "Sombras tonos cálidos", link: "https://i.pinimg.com/736x/7b/ca/82/7bca82b43809c4cb08e19748c7a64a92.jpg" },
  { id: 18, nombre: "Iluminador dorado", link: "https://i.pinimg.com/736x/72/76/9c/72769c8635a64eff714c4a5904c6cd4f.jpg" },
  { id: 19, nombre: "Rímel volumen total", link: "https://i.pinimg.com/736x/3f/f8/43/3ff843f98b18b7b4a84ad27889ec34b2.jpg" },
];

const accesorios = [
  { id: 20, nombre: "Collar minimalista", link: "https://i.pinimg.com/736x/fe/eb/75/feeb75122196d09c7790e70ae0167d12.jpg" },
  { id: 21, nombre: "Argolla dorado", link: "https://i.pinimg.com/736x/80/cf/da/80cfda63ef970b64d57f177b371ace49.jpg" },
  { id: 22, nombre: "Bolso pequeño beige", link: "https://i.pinimg.com/736x/18/e0/49/18e0491791e065357f0637c97933b591.jpg" },
  { id: 23, nombre: "Pulsera con charms", link: "https://i.pinimg.com/736x/5f/f9/bc/5ff9bcbb5852580f4f5d67e624e5dd89.jpg" },
];

const frasesPositivas = [
  "Eres más fuerte de lo que crees.",
  "La moda no te define, tu actitud sí.",
  "Amarte es el primer paso para brillar.",
  "Cada día es una nueva oportunidad para florecer.",
];

const canciones = [
  { id: 1, nombre: "KATSEYE - Mean Girls", url: "https://youtu.be/QQpAtjmCdKQ?si=OlzjuBNIU5iySHhH" },
  { id: 2, nombre: "EASYKID - SHINY", url: "https://youtu.be/EHAEFXTntHI?si=zQmd2wsOYOY997tW" },
  { id: 3, nombre: "5SOS - Easier", url: "https://youtu.be/b1dFSWLJ9wY?si=nZHzHIM9lNsOM_oG" },
];

// Helper para obtener ID de YouTube
const getYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Variantes de animación para listas escalonadas
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

export default function ProductoDetalles() {
  const { id } = useParams();
  const { agregarAlCarrito } = useCarrito();
  const producto = productosData.find((p) => String(p.id) === String(id)) || productosData[0];

  const [imagenPrincipal, setImagenPrincipal] = useState(producto.gallery?.[0] || producto.image || "");
  const [colorSeleccionado, setColorSeleccionado] = useState(producto.colors?.[0] || "");
  const [sizeSeleccionado, setSizeSeleccionado] = useState(producto.sizes?.[0] || "");
  const [cantidad, setCantidad] = useState(1);

  // Estados para el reproductor de música flotante
  const [activeSong, setActiveSong] = useState(null); // Guarda el objeto canción activo
  const [playerOpen, setPlayerOpen] = useState(false);

  const { favoritos, agregarFavorito, quitarFavorito, estaEnFavoritos, user, loginConPopup } = useFavoritos();
  const [favoritosModal, setFavoritosModal] = useState(false);
  const { suscribirseAComentarios, comentariosPorProducto, agregarComentario } = useComentarios();
  const [review, setReview] = useState("");
  const reviews = comentariosPorProducto[id] || [];

  const precioDescuento = (producto.price - producto.price * (producto.discount / 100)).toFixed(2);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={`${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-100"}`} 
      />
    ));
  };

  const handleAgregar = () => {
    if (!sizeSeleccionado) {
      alert("Por favor, selecciona una talla antes de agregar al carrito.");
      return;
    }
    const itemParaCarrito = {
      ...producto,
      price: parseFloat(precioDescuento),
      image: imagenPrincipal,
      size: sizeSeleccionado,
      color: colorSeleccionado,
    };
    agregarAlCarrito(itemParaCarrito, cantidad);
  };

  useEffect(() => {
    const unsub = suscribirseAComentarios(id);
    return () => unsub && unsub();
  }, [id]);

  const toggleFavoritoYAbrirModal = async () => {
    try {
      let currentUser = user;
      if (!currentUser) {
        if (typeof loginConPopup === "function") {
          currentUser = await loginConPopup();
        } else {
          const res = await signInWithPopup(auth, googleProvider);
          currentUser = res.user;
        }
      }
      if (estaEnFavoritos(producto.id)) {
        await quitarFavorito(producto.id);
      } else {
        await agregarFavorito(producto);
      }
      setFavoritosModal(true);
    } catch (err) {
      console.error("Error toggle favorito:", err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) return;
    try {
      await agregarComentario(id, review.trim());
      setReview("");
    } catch (err) {
      console.error("Error guardando comentario:", err);
    }
  };

  const handlePlaySong = (cancion) => {
    setActiveSong(cancion);
    setPlayerOpen(true);
  };

  const formatDate = (item) => {
    const ts = item.createdAt || item.fecha;
    try {
      if (ts && typeof ts.toDate === "function") return ts.toDate().toLocaleString();
      if (typeof ts === "string") return new Date(ts).toLocaleString();
      return "";
    } catch { return ""; }
  };

  return (
    <div className="min-h-screen relative font-sans overflow-x-hidden bg-white selection:bg-rose-200 selection:text-rose-900 pb-20 pt-24">
      
      {/* === FONDO ANIMADO === */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse delay-700"></div>
          <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-pink-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 hidden md:block"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* === TARJETA PRINCIPAL DEL PRODUCTO (Animada al cargar) === */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/60 p-6 md:p-10 grid md:grid-cols-2 gap-12"
        >
          {/* GALERÍA */}
          <div className="flex flex-col gap-6">
            <motion.div 
                className="relative w-full h-[500px] rounded-[2rem] overflow-hidden bg-gray-100 shadow-inner group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
            >
                <img 
                    src={imagenPrincipal} 
                    alt={producto.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                {producto.discount > 0 && (
                    <span className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        -{producto.discount}% OFF
                    </span>
                )}
            </motion.div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar justify-center">
              {producto.gallery?.map((img, i) => (
                <motion.div 
                    key={i}
                    onClick={() => setImagenPrincipal(img)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${imagenPrincipal === img ? "ring-2 ring-rose-500 ring-offset-2 scale-105" : "opacity-70 hover:opacity-100"}`}
                >
                    <img src={img} alt={`view ${i}`} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* INFO PRODUCTO */}
          <div className="flex flex-col justify-center space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black tracking-widest text-rose-500 uppercase">New Collection</span>
                    <div className="flex text-yellow-400">{renderStars(producto.rating)}</div>
                    <span className="text-xs text-gray-400 font-bold">({reviews.length} reviews)</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-tight">
                    {producto.name}
                </h1>
            </motion.div>

            <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.3 }}
                className="text-gray-600 leading-relaxed font-medium"
            >
                {producto.description}
            </motion.p>

            <motion.div 
                className="flex items-baseline gap-4"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.4 }}
            >
              <span className="text-5xl font-black text-gray-900 tracking-tight">S/{precioDescuento}</span>
              {producto.discount > 0 && (
                  <span className="text-xl text-gray-400 line-through font-bold">S/{producto.price.toFixed(2)}</span>
              )}
            </motion.div>

            <div className="h-px bg-gray-200/50 w-full my-2"></div>

            {/* Selectores */}
            <div className="space-y-5">
                {/* Color */}
                <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Color</span>
                    <div className="flex gap-3">
                        {producto.colors?.map(c => (
                            <motion.div
                                key={c}
                                onClick={() => setColorSeleccionado(c)}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center shadow-sm ${colorSeleccionado === c ? "ring-2 ring-gray-900 ring-offset-2 scale-110" : ""}`}
                                style={{ backgroundColor: c === "Rosa" ? "#F472B6" : c === "Negro" ? "#111827" : "#EAB308" }}
                                title={c}
                            >
                                {colorSeleccionado === c && <Check size={16} className="text-white mix-blend-difference" />}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Talla */}
                <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Talla</span>
                    <div className="flex flex-wrap gap-3">
                        {producto.sizes?.map(s => (
                            <motion.button 
                                key={s} 
                                onClick={() => setSizeSeleccionado(s)} 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${sizeSeleccionado === s ? "bg-gray-900 text-white shadow-lg" : "bg-white text-gray-600 border border-gray-200 hover:border-rose-300"}`}
                            >
                                {s}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {/* Contador */}
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm w-full sm:w-auto min-w-[120px]">
                    <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="text-xl text-gray-400 hover:text-gray-900 transition">-</button>
                    <span className="text-lg font-black text-gray-900">{cantidad}</span>
                    <button onClick={() => setCantidad(cantidad + 1)} className="text-xl text-gray-400 hover:text-gray-900 transition">+</button>
                </div>

                {/* Botón Agregar */}
                <motion.button 
                    onClick={handleAgregar} 
                    whileHover={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(244, 63, 94, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gray-900 text-white font-bold text-lg py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 group"
                >
                    <ShoppingBag size={20} className="group-hover:-translate-y-1 transition-transform" />
                    Agregar al Carrito
                </motion.button>

                {/* Favorito */}
                <motion.button 
                    onClick={toggleFavoritoYAbrirModal} 
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-full border-2 transition-all ${estaEnFavoritos(producto.id) ? "border-rose-500 bg-rose-50 text-rose-500" : "border-gray-200 bg-white text-gray-400 hover:border-rose-300 hover:text-rose-400"}`}
                >
                    <Heart size={24} fill={estaEnFavoritos(producto.id) ? "currentColor" : "none"} />
                </motion.button>
            </div>
            <p className="text-xs text-gray-400 font-medium text-center sm:text-left">
                Stock disponible: <span className="text-gray-900 font-bold">{producto.stock}</span> unidades
            </p>
          </div>
        </motion.div>

        {/* === SECCIÓN DE INSPIRACIÓN Y PRODUCTOS COMPLEMENTARIOS (ANIMADA) === */}
        <div className="mt-20">
            <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-12 tracking-tighter">
                COMPLETE THE <span className="font-serif italic text-rose-500">LOOK</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
                
                {/* Maquillaje */}
                <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/50 shadow-lg">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-2xl">💄</span> Maquillaje Sugerido
                    </h3>
                    <motion.div 
                        className="grid grid-cols-2 gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {maquillaje.map(item => (
                            <motion.div key={item.id} variants={itemVariants}>
                                <Link to={`/producto/${item.id}`} className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all block">
                                    <div className="overflow-hidden rounded-2xl">
                                        <img src={item.link} alt={item.nombre} className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-xs font-bold text-center px-2">{item.nombre}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Accesorios */}
                <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/50 shadow-lg">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-2xl">👜</span> Accesorios Perfectos
                    </h3>
                    <motion.div 
                        className="grid grid-cols-2 gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {accesorios.map(item => (
                            <motion.div key={item.id} variants={itemVariants}>
                                <Link to={`/producto/${item.id}`} className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all block">
                                    <div className="overflow-hidden rounded-2xl">
                                        <img src={item.link} alt={item.nombre} className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-xs font-bold text-center px-2">{item.nombre}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Frases & Playlist */}
            <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-[3rem] p-10 md:p-16 text-center shadow-inner relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-gray-900 mb-8">MOOD BOOSTER ✨</h2>
                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        {frasesPositivas.map((fr, i) => (
                            <motion.span 
                                key={i} 
                                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                                className="bg-white px-6 py-3 rounded-full shadow-sm text-sm font-bold text-gray-600 cursor-default border border-white/50"
                            >
                                {fr}
                            </motion.span>
                        ))}
                    </div>
                    
                    <div className="inline-flex flex-col items-center bg-white/50 p-6 rounded-[2rem] backdrop-blur-sm border border-white">
                        <span className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                            <Music size={14} /> Now Playing
                        </span>
                        <div className="flex flex-wrap justify-center gap-4">
                            {canciones.map(c => (
                                <motion.button 
                                    key={c.id} 
                                    onClick={() => handlePlaySong(c)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all shadow-lg ${activeSong?.id === c.id ? "bg-rose-500 text-white shadow-rose-500/30" : "bg-gray-900 text-white hover:bg-gray-800"}`}
                                >
                                    {activeSong?.id === c.id ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                    {c.nombre}
                                    {activeSong?.id === c.id && (
                                        <motion.div 
                                            className="w-2 h-2 bg-white rounded-full ml-1"
                                            animate={{ scale: [1, 1.5, 1] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Decoración fondo */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.4),transparent_50%)]"></div>
            </div>
        </div>

        {/* === SECCIÓN DE RESEÑAS === */}
        <div className="mt-20">
            <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-xl p-8 md:p-12 border border-white">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    LOVED BY YOU <span className="bg-rose-100 text-rose-600 text-sm px-3 py-1 rounded-full font-bold">{reviews.length}</span>
                </h2>

                {/* Formulario */}
                <form onSubmit={handleReviewSubmit} className="mb-10 relative">
                    <textarea 
                        value={review} 
                        onChange={e => setReview(e.target.value)} 
                        placeholder="Cuéntanos, ¿qué tal te pareció? ✨" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-3xl p-6 pr-16 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white transition-all resize-none shadow-inner text-gray-700 placeholder:text-gray-400" 
                        rows="3" 
                    />
                    <motion.button 
                        type="submit" 
                        whileHover={{ scale: 1.1, rotate: -10 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute bottom-4 right-4 bg-gray-900 text-white p-3 rounded-full hover:bg-rose-500 transition-colors shadow-lg"
                    >
                        <Send size={18} className="ml-0.5" />
                    </motion.button>
                </form>

                {/* Lista Reviews */}
                <div className="space-y-6">
                    {reviews.length > 0 ? reviews.map(r => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            key={r.id} 
                            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-4"
                        >
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-rose-200 to-purple-200 flex items-center justify-center font-bold text-gray-700 shrink-0">
                                {r.userName ? r.userName.charAt(0).toUpperCase() : "A"}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">
                                    {r.userName || "Anónimo"} 
                                    <span className="text-gray-400 font-normal ml-2 text-xs">{formatDate(r)}</span>
                                </h4>
                                <p className="text-gray-600 mt-2 italic">"{r.texto}"</p>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="text-center py-10 opacity-50">
                            <p className="text-gray-400 font-bold">Sé la primera en dejar una reseña 💖</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>

      {/* === REPRODUCTOR FLOTANTE (Picture-in-Picture) === */}
      <AnimatePresence>
        {activeSong && playerOpen && (
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-3xl shadow-2xl flex flex-col gap-3 w-80 border border-gray-800"
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center animate-spin-slow">
                            <Disc size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Now Playing</span>
                            <span className="font-bold text-sm truncate w-48">{activeSong.nombre}</span>
                        </div>
                    </div>
                    <button onClick={() => setPlayerOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>
                
                {/* Iframe de YouTube Oculto/Pequeño */}
                <div className="rounded-xl overflow-hidden shadow-inner bg-gray-900 h-40">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${getYouTubeID(activeSong.url)}?autoplay=1&controls=0&modestbranding=1`}
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL FAVORITOS */}
      <ModalFavoritos abierto={favoritosModal} cerrar={() => setFavoritosModal(false)} />
    </div>
  );
}