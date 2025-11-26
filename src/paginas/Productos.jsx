import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../componentes/Sidebar";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, auth, ADMIN_EMAILS } from "../lib/firebase";
import { FaSearch, FaPlus, FaTimes, FaFire, FaStar, FaBolt, FaArrowDown } from "react-icons/fa"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { motion, AnimatePresence } from "framer-motion";

// Asegúrate de que esta ruta sea correcta. Si falla, usará un array vacío.
import { productosData as datosLocales } from "../assets/productosData"; 

export default function Productos() {
  const [user] = useAuthState(auth);
  const esAdmin = user && ADMIN_EMAILS.includes(user.email);

  // Estados de datos
  const [originalProducts, setOriginalProducts] = useState([]);
  const [productos, setProductos] = useState([]); 
  const [visibleProducts, setVisibleProducts] = useState([]); 
  const [visibleCount, setVisibleCount] = useState(10); 

  // Estados de UI
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Estados del Formulario
  const [modalAgregar, setModalAgregar] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    name: "", description: "", price: "", category: "", image: "",
  });

  // --- 1. CARGA DE DATOS ROBUSTA ---
  const cargarProductos = async () => {
    setLoading(true);
    try {
      console.log("🔄 Iniciando carga de productos...");
      
      let firebaseList = [];
      try {
        // Intentamos leer de Firebase
        const snapshot = await getDocs(collection(db, "productos"));
        firebaseList = snapshot.docs.map((doc) => ({
          id: doc.id,
          fromFirebase: true,
          ...doc.data(),
        }));
        console.log("✅ Firebase cargado:", firebaseList.length);
      } catch (fbError) {
        console.warn("⚠️ No se pudo conectar a Firebase (o colección vacía):", fbError);
        // Si falla Firebase, seguimos con lista vacía, no rompemos todo.
      }

      // Aseguramos que datosLocales sea un array
      const localesSeguros = Array.isArray(datosLocales) ? datosLocales : [];

      // Filtramos locales que ya estén en Firebase (por ID)
      const idsFirebase = new Set(firebaseList.map((f) => String(f.id)));
      const soloLocales = localesSeguros.filter(
        (p) => !idsFirebase.has(String(p.id))
      );

      // Combinamos todo
      const combinado = [...firebaseList, ...soloLocales].map(p => ({
        ...p,
        // Asignamos valores por defecto si faltan para evitar errores visuales
        price: p.price ? Number(p.price) : 0,
        isTrend: p.isTrend ?? (Math.random() > 0.8), 
        isBestSeller: p.isBestSeller ?? (Math.random() > 0.85), 
        rating: p.rating ?? (Math.random() * (5 - 4) + 4).toFixed(1)
      }));

      console.log("📦 Total productos combinados:", combinado.length);

      setOriginalProducts(combinado);
      setProductos(combinado);
      
      // IMPORTANTE: Inicializamos visibleProducts aquí mismo para evitar retrasos
      setVisibleProducts(combinado.slice(0, 10));

    } catch (error) {
      console.error("❌ Error CRÍTICO cargando productos:", error);
      // Fallback de emergencia
      setOriginalProducts([]); 
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // --- 2. EFECTO DE PAGINACIÓN ---
  useEffect(() => {
    if (productos.length > 0) {
        setVisibleProducts(productos.slice(0, visibleCount));
    } else {
        setVisibleProducts([]);
    }
  }, [productos, visibleCount]);

  // --- 3. FILTROS ---
  const filtrarProductos = (filtros = {}) => {
    let filtrados = [...originalProducts];

    if (filtros.categoria && filtros.categoria !== "Todas") // Agregué validación de "Todas"
      filtrados = filtrados.filter((p) => String(p.category) === String(filtros.categoria));
    
    if (filtros.precioMin)
      filtrados = filtrados.filter((p) => p.price >= parseFloat(filtros.precioMin));
    
    if (filtros.precioMax)
      filtrados = filtrados.filter((p) => p.price <= parseFloat(filtros.precioMax));
    
    if (filtros.nombre)
      filtrados = filtrados.filter((p) =>
        String(p.name).toLowerCase().includes(String(filtros.nombre).toLowerCase())
      );

    if (filtros.orden === "asc")
      filtrados.sort((a, b) => a.price - b.price);
    else if (filtros.orden === "desc")
      filtrados.sort((a, b) => b.price - a.price);

    setProductos(filtrados);
    setVisibleCount(10); 
  };

  const handleCargarMas = async () => {
    setLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setVisibleCount((prev) => prev + 10);
    setLoadingMore(false);
  };

  const agregarProductoFirebase = async () => {
    if (!esAdmin) return;
    if (!nuevoProducto.name || !nuevoProducto.image) {
      alert("Faltan datos básicos"); return;
    }
    try {
        const docRef = await addDoc(collection(db, "productos"), { ...nuevoProducto, price: parseFloat(nuevoProducto.price) || 0, creador: user.email });
        const nuevo = { id: docRef.id, fromFirebase: true, ...nuevoProducto, price: parseFloat(nuevoProducto.price) || 0, isTrend: true };
        
        const nuevaLista = [nuevo, ...originalProducts];
        setOriginalProducts(nuevaLista);
        setProductos(nuevaLista); // Esto disparará la actualización visual
        
        setModalAgregar(false);
        setNuevoProducto({ name: "", description: "", price: "", category: "", image: "" });
    } catch(e) { console.error(e); }
  };

  return (
    <div className="relative min-h-screen bg-[#FDFBFD] text-gray-800 font-sans selection:bg-pink-200 selection:text-pink-900">
      
      {/* Fondo Decorativo */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-[120px] mix-blend-multiply"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row p-4 md:p-8 gap-8 max-w-7xl mx-auto pt-24">
        
        {/* SIDEBAR */}
        <aside className="md:w-64 shrink-0 z-20">
          <div className="sticky top-28">
            <Sidebar
              categorias={["Ropa", "Maquillaje", "Accesorios"]}
              onFilter={filtrarProductos}
              className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-4xl p-6 shadow-xl shadow-pink-100/50"
            />
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 min-h-[50vh]"> {/* min-h evita colapso si está vacío */}
          <div className="mb-8">
             <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Explora el <span className="text-pink-500 italic font-serif">Glow</span>
             </h1>
             <p className="text-gray-500 mt-2">
                {loading ? "Cargando tesoros..." : `Mostrando ${visibleProducts.length} productos`}
             </p>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white h-96 rounded-4xl animate-pulse border border-gray-100 shadow-sm"></div>
                ))}
             </div>
          ) : (
            <>
                {/* --- GRID DE PRODUCTOS --- */}
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <AnimatePresence mode="popLayout">
                    {visibleProducts.map((p) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        key={p.id}
                        className="group bg-white rounded-4xl p-3 shadow-sm hover:shadow-2xl hover:shadow-pink-100/60 transition-all duration-500 border border-transparent hover:border-pink-100 flex flex-col relative"
                      >
                        {/* IMAGEN CARD */}
                        <div className="relative overflow-hidden rounded-3xl aspect-4/5 bg-gray-100">
                          <Link to={`/producto/${p.id}`}>
                            <img
                              src={p.image || "https://via.placeholder.com/300?text=No+Image"} // Fallback imagen
                              alt={p.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Error"; }} // Si falla la imagen
                            />
                          </Link>

                          {/* LABELS */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2 items-start z-10 pointer-events-none">
                             {p.isTrend && (
                                <span className="bg-linear-to-r from-orange-400 to-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                                    <FaFire className="text-yellow-200" /> TRENDING
                                </span>
                             )}
                             {p.isBestSeller && (
                                <span className="bg-black/80 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md border border-white/20">
                                    <FaStar className="text-yellow-400" /> TOP
                                </span>
                             )}
                          </div>

                          <button onClick={() => setProductoSeleccionado(p)} className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-pink-600 p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-pink-500 hover:text-white z-10 cursor-pointer">
                            <FaSearch size={16} />
                          </button>
                        </div>

                        {/* INFO CARD */}
                        <div className="p-3 flex flex-col flex-1">
                          <div className="flex justify-between items-start mb-1 mt-1">
                             <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-pink-600 transition-colors cursor-pointer truncate pr-2">
                               <Link to={`/producto/${p.id}`}>{p.name}</Link>
                             </h3>
                             <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                                <FaStar className="text-yellow-400 mb-px" /> {p.rating}
                             </div>
                          </div>
                          
                          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{p.description}</p>

                          <div className="flex items-center justify-between mt-auto">
                              <span className="font-black text-xl text-gray-900">S/{Number(p.price).toFixed(2)}</span>
                              <Link to={`/producto/${p.id}`} className="bg-gray-100 hover:bg-black hover:text-white text-gray-900 font-bold px-4 py-2 rounded-xl text-sm transition-all duration-300">
                                Ver
                              </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* --- BOTÓN CARGAR MÁS --- */}
                {productos.length > visibleCount && (
                    <div className="flex justify-center mt-12 pb-10">
                        <button 
                            onClick={handleCargarMas}
                            disabled={loadingMore}
                            className="group flex flex-col items-center gap-2 text-gray-400 hover:text-pink-600 transition-colors disabled:opacity-50"
                        >
                            {loadingMore ? (
                                <div className="w-8 h-8 rounded-full border-2 border-pink-300 border-t-pink-600 animate-spin" />
                            ) : (
                                <>
                                    <span className="text-sm font-bold tracking-widest uppercase">Cargar más estilos</span>
                                    <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center group-hover:bg-pink-50 transition-all">
                                        <FaArrowDown />
                                    </div>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </>
          )}

          {/* MENSAJE SI NO HAY PRODUCTOS */}
          {!loading && visibleProducts.length === 0 && (
             <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-gray-100 mt-4">
                <p className="text-4xl mb-4">🫠</p>
                <p className="text-xl text-gray-400 font-medium">Ups, no encontramos nada.</p>
                <p className="text-sm text-gray-400 mt-2">(Revisa tu conexión o los filtros)</p>
                <button onClick={() => window.location.reload()} className="text-pink-500 font-bold mt-4 underline hover:text-pink-700">Recargar Página</button>
             </div>
          )}
        </main>
      </div>

      {esAdmin && (
        <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setModalAgregar(true)} className="fixed bottom-8 right-8 bg-linear-to-r from-pink-500 to-rose-600 text-white p-5 rounded-full shadow-lg shadow-pink-500/40 hover:shadow-pink-500/60 z-50 flex items-center justify-center text-2xl"><FaPlus /></motion.button>
      )}

      {/* MODAL DETALLE */}
      <AnimatePresence>
        {productoSeleccionado && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProductoSeleccionado(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }} className="bg-white rounded-[2.5rem] overflow-hidden max-w-4xl w-full relative shadow-2xl z-10 flex flex-col md:flex-row">
                    <button onClick={() => setProductoSeleccionado(null)} className="absolute top-4 right-4 z-20 bg-white/50 hover:bg-white p-2 rounded-full transition"><FaTimes size={20} /></button>
                    <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
                        <img src={productoSeleccionado.image} alt={productoSeleccionado.name} className="w-full h-full object-cover"/>
                    </div>
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <h2 className="text-3xl font-black text-gray-900 mb-4">{productoSeleccionado.name}</h2>
                        <p className="text-gray-600 text-lg mb-6">{productoSeleccionado.description}</p>
                        <span className="text-3xl font-bold text-gray-900 mb-6 block">S/{Number(productoSeleccionado.price).toFixed(2)}</span>
                        <Link to={`/producto/${productoSeleccionado.id}`} className="bg-black text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-pink-600 transition-colors shadow-lg flex items-center justify-center gap-2">Ver Detalles Completos <FaBolt /></Link>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

       {/* MODAL AGREGAR */}
      <AnimatePresence>
        {esAdmin && modalAgregar && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalAgregar(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div className="bg-white p-8 rounded-2rem w-full max-w-lg relative shadow-2xl z-10" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-900">Agregar Producto</h2><button onClick={() => setModalAgregar(false)} className="text-gray-400 hover:text-red-500"><FaTimes size={24} /></button></div>
                <div className="space-y-4">
                    <input type="text" placeholder="Nombre" className="w-full bg-gray-50 border p-4 rounded-xl" value={nuevoProducto.name} onChange={(e) => setNuevoProducto({ ...nuevoProducto, name: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4"><input type="number" placeholder="Precio" className="bg-gray-50 border p-4 rounded-xl" value={nuevoProducto.price} onChange={(e) => setNuevoProducto({ ...nuevoProducto, price: e.target.value })} /><input type="text" placeholder="Categoría" className="bg-gray-50 border p-4 rounded-xl" value={nuevoProducto.category} onChange={(e) => setNuevoProducto({ ...nuevoProducto, category: e.target.value })} /></div>
                    <textarea placeholder="Descripción" rows="3" className="w-full bg-gray-50 border p-4 rounded-xl resize-none" value={nuevoProducto.description} onChange={(e) => setNuevoProducto({ ...nuevoProducto, description: e.target.value })} />
                    <input type="text" placeholder="URL Imagen" className="w-full bg-gray-50 border p-4 rounded-xl" value={nuevoProducto.image} onChange={(e) => setNuevoProducto({ ...nuevoProducto, image: e.target.value })} />
                    <button onClick={agregarProductoFirebase} className="w-full bg-linear-to-r from-pink-500 to-rose-600 text-white py-4 rounded-xl font-bold mt-4">Publicar</button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}