import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Star, Instagram, Sparkles, Play } from 'lucide-react'; 
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import CuponNovaGlow from '../layouts/Cupon';

// 1. IMPORTACIONES DE FIREBASE
import { db } from "../lib/firebase"; 
import { collection, getDocs } from "firebase/firestore";

// Animaciones suaves
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const Inicio = () => {
  const [mostrarCupon, setMostrarCupon] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] });
  
  // Nuevo estado para almacenar los productos de Firebase
  const [productosTrending, setProductosTrending] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Parallax sutil
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // --- Lógica Countdown ---
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2); 
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Lógica de Carga de Productos de Firebase ---
  useEffect(() => {
    const fetchProductos = async () => {
      setLoadingProducts(true);
      try {
        // Referencia a la colección 'productos'
        const productosRef = collection(db, "productos"); 
        
        // Obtener los documentos
        const querySnapshot = await getDocs(productosRef);
        
        // Mapear los documentos para obtener los datos y el ID
        const productosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Usar los primeros 5 productos (o todos si son menos) para el carrusel
        setProductosTrending(productosData.slice(0, 5));
        
      } catch (error) {
        console.error("Error al obtener productos de Firebase:", error);
        // Opcional: mostrar un mensaje de error al usuario
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProductos();
  }, []);


  const handleAbrirCupon = () => setMostrarCupon(true);
  const handleCerrarCupon = () => setMostrarCupon(false);

  return (
    <div className="overflow-x-hidden bg-[#FFF5F7] selection:bg-pink-500 selection:text-white font-sans">
      
      {/* Textura de ruido sutil */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* ==========================================================================
          1. HERO SECTION: Pink & Clean
      ========================================================================== */}
       <div ref={targetRef} className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-linear-to-b from-white via-pink-50 to-white">
        
        {/* Fondos Ambientales (Solo Rosas y Blancos) */}
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-pink-200/40 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-300/20 rounded-full blur-[120px]"></div>
        </motion.div>

        <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative z-10 max-w-6xl space-y-8 pt-20"
        >
          
          {/* Badge */}
          <motion.div variants={fadeInUp} className="flex justify-center">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-200 bg-white/80 backdrop-blur-sm text-pink-600 text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm">
               <Sparkles size={14} className="text-pink-500" /> New Collection 2025
             </div>
          </motion.div>
          
          {/* Título Gigante (Degradado Solicitado) */}
          <motion.div variants={fadeInUp} className="relative">
             <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.85] select-none">
               <span className="text-gray-900">NOVA</span>{" "}
               <span className="italic font-serif text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-rose-600">
                   GLOW
               </span>
             </h1>
          </motion.div>

          {/* Subtítulo */}
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 max-w-lg mx-auto font-light leading-relaxed">
            Moda que no solo se viste, se <span className="text-rose-500 font-medium italic">siente</span>. <br/>
            Refleja tu luz interior con nuestra colección más fresca.
          </motion.p>

          {/* Botones Interactivos */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10">
            <Link
              to="/productos"
              className="group relative bg-black text-white text-lg font-bold py-4 px-12 rounded-full overflow-hidden shadow-lg hover:shadow-pink-200/50 hover:shadow-xl transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                  Ver Catálogo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
              </span>
            </Link>
            
            <button
              onClick={handleAbrirCupon}
              className="group flex items-center gap-2 bg-white text-rose-600 font-bold py-4 px-10 rounded-full shadow-md border border-rose-100 hover:bg-rose-50 transition-all"
            >
              <Play size={18} fill="currentColor" className="text-rose-500" /> 
              Oferta Secreta
            </button>
          </motion.div>
        </motion.div>
      </div>
      {/* ... (Fin de HERO SECTION) ... */}

      {/* ==========================================================================
          2. MARQUEE (Separador Rosa Intenso)
      ========================================================================== */}
      {/* ... (El código de MARQUEE permanece igual) ... */}
      <div className="relative py-4 bg-rose-600 scale-[1.01] z-20 overflow-hidden shadow-xl">
        <div className="flex animate-marquee gap-24 whitespace-nowrap items-center text-white">
          {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-24">
                <span className="text-3xl font-black tracking-tighter">NOVA GLOW</span>
                <span className="text-3xl font-serif italic opacity-80">est. 2025</span>
                <Star className="w-5 h-5 fill-white opacity-80" />
              </div>
          ))}
        </div>
      </div>

      {/* ==========================================================================
          3. EDITORIAL MANIFESTO
      ========================================================================== */}
      {/* ... (El código de EDITORIAL MANIFESTO permanece igual) ... */}
      <section className="py-32 px-6 bg-white text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
             <h2 className="text-4xl md:text-5xl font-serif italic text-gray-900 leading-tight mb-8">
                "Tu brillo. Nuestra <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-rose-600 not-italic font-sans font-black">inspiración</span>."
             </h2>
             <div className="w-16 h-1 bg-rose-100 mx-auto mb-8 rounded-full"></div>
             <p className="text-gray-500 text-lg font-light max-w-xl mx-auto">
                En Nova Glow creemos que la moda es más que vestir bien: es una forma de expresión, un lenguaje visual y una manera de iluminar cada espacio.
             </p>
          </motion.div>
      </section>

      {/* ==========================================================================
          4. BENTO GRID (Vibes)
      ========================================================================== */}
      {/* ... (El código de BENTO GRID permanece igual) ... */}
      <section className="py-20 px-4 bg-[#FFF5F7]">
        <div className="max-w-7xl mx-auto">
            <motion.div 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="flex justify-between items-end mb-12 px-2"
            >
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900">
                    PICK YOUR <span className="text-rose-500 italic font-serif">MOOD</span>
                </h2>
                <Link to="/productos" className="hidden md:flex items-center gap-2 font-bold text-sm uppercase tracking-widest border-b-2 border-black pb-1 hover:text-rose-600 hover:border-rose-600 transition group">
                    Explorar Todo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[500px]">
                
                {/* Card Grande 1 */}
                <div className="md:col-span-2 group relative rounded-[2.5rem] overflow-hidden cursor-pointer shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-pink-100">
                    <img src="img/conjunto3.jpg" alt="Party" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                    <div className="absolute bottom-10 left-10 text-white">
                        <h3 className="text-4xl font-black mb-2">Party Icons</h3>
                        <p className="font-medium opacity-90 text-lg">Brilla toda la noche.</p>
                    </div>
                </div>

                {/* Card Vertical 1 */}
                <div className="group relative rounded-[2.5rem] overflow-hidden cursor-pointer bg-white shadow-sm transition-all hover:shadow-xl hover:shadow-pink-100">
                    <img src="img/conjunto6.jpg" alt="Chic" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute bottom-6 left-6 right-6 text-center">
                        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-white/50">
                            <h3 className="text-lg font-bold text-gray-900">Chic & Classy</h3>
                        </div>
                    </div>
                </div>

                {/* Card Vertical 2 */}
                <div className="group relative rounded-[2.5rem] overflow-hidden cursor-pointer bg-white shadow-sm transition-all hover:shadow-xl hover:shadow-pink-100">
                    <img src="img/conjunto5.jpg" alt="Casual" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute bottom-6 left-6 right-6 text-center">
                        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-white/50">
                            <h3 className="text-lg font-bold text-gray-900">Urban Casual</h3>
                        </div>
                    </div>
                </div>

                {/* Card Grande 2 */}
                <div className="md:col-span-2 group relative rounded-[2.5rem] overflow-hidden cursor-pointer shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-pink-100">
                    <img src="img/accesorios.jpg" alt="Accesorios" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                    <div className="absolute bottom-10 left-10 text-white">
                        <h3 className="text-4xl font-black mb-2">Accesorios</h3>
                        <p className="font-medium opacity-90 text-lg">El toque final perfecto.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* ==========================================================================
          5. TRENDING CAROUSEL (Productos Limpios) - MODIFICADO
      ========================================================================== */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">Trending Now</h2>
          </div>
          
          {/* Indicador de carga */}
          {loadingProducts && (
            <div className="text-center text-gray-500 py-10">Cargando productos...</div>
          )}

          {/* Carrusel de Productos de Firebase */}
          {!loadingProducts && productosTrending.length > 0 && (
            <div className="flex overflow-x-auto gap-6 pb-10 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing">
              {productosTrending.map((producto, i) => (
                <Link 
                  key={producto.id} 
                  to={`/producto/${producto.id}`} // Enlace a la página de detalle del producto
                  className="min-w-[280px] snap-center group cursor-pointer"
                >
                  <div className="relative aspect-3/4 rounded-4xl overflow-hidden mb-4 bg-pink-50 shadow-sm transition-all duration-300 hover:shadow-md">
                    {/* Usar el campo 'image' de Firebase para la imagen */}
                    <img 
                      src={producto.image} 
                      alt={producto.name || "Producto Nova Glow"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      // Fallback por si 'image' no funciona o no carga, usar una imagen placeholder
                      onError={(e) => { e.target.onerror = null; e.target.src = "img/placeholder.jpg" }} 
                    />
                    {i === 0 && <div className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">Best Seller</div>}
                  </div>
                  {/* Usar los campos 'name' y 'price' de Firebase */}
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-rose-600 transition-colors">{producto.name || "Producto Desconocido"}</h3>
                  <div className="flex justify-between items-center mt-1">
                    {/* Usar otro campo para el detalle o descripción corta, si existe. Usamos 'category' como ejemplo. */}
                    <p className="text-gray-500 text-sm">{producto.category || "General"}</p>
                    <p className="font-bold text-rose-600">S/ {parseFloat(producto.price).toFixed(2) || '?.??'}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {!loadingProducts && productosTrending.length === 0 && (
            <div className="text-center text-gray-500 py-10">No se encontraron productos trending.</div>
          )}
        </div>
      </section>

      {/* ==========================================================================
          6. DROP COUNTDOWN (Fondo Negro Elegante)
      ========================================================================== */}
      {/* ... (Todo el resto de tu código permanece igual) ... */}
      <section className="py-32 bg-black text-white relative overflow-hidden">
           {/* Brillos rosados sutiles */}
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-600/20 rounded-full blur-[150px] pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none"></div>
           
           <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center relative z-10">
             <div>
                 <div className="inline-flex items-center gap-2 text-rose-500 font-bold tracking-widest uppercase text-xs mb-6">
                     <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> Limited Edition
                 </div>
                 <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
                     MIDNIGHT <br/> <span className="italic font-serif font-light text-white/40">VELVET</span>
                 </h2>
                 <p className="text-gray-400 text-lg mb-10 max-w-md leading-relaxed font-light">
                     Una colección cápsula para las noches inolvidables. Texturas suaves y elegancia oscura.
                 </p>
                 
                 {/* Timer Minimalista */}
                 <div className="flex gap-10 mb-12 border-t border-white/10 pt-8">
                     {Object.entries(timeLeft).map(([label, value]) => (
                         <div key={label} className="text-center">
                             <div className="text-3xl md:text-4xl font-black font-mono text-white tabular-nums">
                                 {String(value).padStart(2, '0')}
                             </div>
                             <span className="text-[9px] text-gray-500 uppercase tracking-[0.2em]">{label}</span>
                         </div>
                     ))}
                 </div>

                 <button className="bg-white text-black font-bold py-4 px-12 rounded-full hover:bg-rose-500 hover:text-white transition-all duration-300">
                     Unirme a la Lista
                 </button>
             </div>

             <div className="relative hidden md:block h-[600px]">
                 <div className="relative rounded-[10rem] overflow-hidden h-full w-full bg-gray-900 shadow-2xl group border border-white/5">
                     <img src="img/conjunto1.jpg" alt="Next Drop" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"></div>
                     <div className="absolute bottom-12 w-full text-center">
                         <p className="text-white font-serif italic text-2xl tracking-tight">Coming Soon...</p>
                     </div>
                 </div>
             </div>
           </div>
      </section>

      {/* ==========================================================================
          7. SOCIAL PROOF (Limpio)
      ========================================================================== */}
      {/* ... (El código de SOCIAL PROOF permanece igual) ... */}
      <section className="py-24 bg-white">
          <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight uppercase">
                  As Seen On You
              </h2>
              <p className="text-gray-500 font-medium flex items-center justify-center gap-2">
                <Instagram size={18} /> @NovaGlow
              </p>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px] md:h-[500px]">
              <div className="relative rounded-3xl overflow-hidden group cursor-pointer row-span-2">
                  <img src="img/conjunto4.jpg" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
                  <img src="img/conjunto2.jpg" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="relative rounded-3xl overflow-hidden group cursor-pointer row-span-2">
                  <img src="img/conjunto5.jpg" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
                  <img src="img/accesorios.jpg" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              
              {/* CTA Block */}
              <Link to="#" className="relative rounded-3xl overflow-hidden group cursor-pointer bg-rose-50 flex flex-col items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition-colors">
                  <p className="font-bold text-sm uppercase tracking-wider mb-2">Ver Galería</p>
                  <ArrowRight size={18} />
              </Link>
              
              <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
                   <img src="img/conjunto6.jpg" className="w-full h-full object-cover" />
              </div>
          </div>
      </section>

      {/* ==========================================================================
          8. NEWSLETTER FINAL (Elegante)
      ========================================================================= */}
      {/* ... (El código de NEWSLETTER FINAL permanece igual) ... */}
      <section className="py-32 bg-[#FFF5F7] text-center relative overflow-hidden border-t border-pink-100">
        <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter text-gray-900">
                JOIN THE <span className="italic font-serif text-rose-500">CLUB</span>
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg">
                Acceso anticipado, ofertas secretas y vibes exclusivas directamente en tu inbox.
            </p>
            
            <form className="max-w-md mx-auto bg-white p-1.5 rounded-full flex border border-pink-200 shadow-sm focus-within:ring-2 focus-within:ring-pink-200 focus-within:border-pink-300 transition-all group">
                <input 
                    type="email" 
                    placeholder="tu@email.com" 
                    className="bg-transparent w-full px-6 text-gray-900 outline-none placeholder:text-gray-400 font-medium text-sm" 
                />
                <button className="bg-rose-600 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
                    Suscribir
                </button>
            </form>
        </div>
      </section>

      {/* CUPÓN POPUP */}
      <AnimatePresence>
        {mostrarCupon && (
            <CuponNovaGlow onClose={handleCerrarCupon} onClaim={handleCerrarCupon} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inicio;