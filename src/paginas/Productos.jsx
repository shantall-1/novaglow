import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../componentes/Sidebar";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, auth, ADMIN_EMAILS } from "../lib/firebase";
import { FaSearch, FaPlus, FaTimes, FaFire, FaStar, FaBolt, FaArrowDown } from "react-icons/fa"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function Productos() {
  const [user] = useAuthState(auth);
  const esAdmin = user && ADMIN_EMAILS.includes(user.email);

  // Estados de datos
  const [originalProducts, setOriginalProducts] = useState([]);
  const [productos, setProductos] = useState([]); 
  const [visibleProducts, setVisibleProducts] = useState([]); 
  const [visibleCount, setVisibleCount] = useState(10); 

  // Estados UI
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Formulario
  const [modalAgregar, setModalAgregar] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    name: "",
    category: "",
    price: "",
    discount: "",
    description: "",
    image: "",
    colors: "",
    rating: "",
    stock: "",
  });

  /* -----------------------------------------------------
     CARGA SOLO DESDE FIREBASE (productosData ELIMINADO)
  ------------------------------------------------------ */
  const cargarProductos = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "productos"));
      const firebaseList = snapshot.docs.map((doc) => ({
        id: doc.id,
        fromFirebase: true,
        ...doc.data(),
      }));

      const procesados = firebaseList.map((p) => ({
        ...p,
        price: Number(p.price) || 0,
        rating: p.rating ?? (Math.random() * (5 - 4) + 4).toFixed(1),
        isTrend: p.isTrend ?? (Math.random() > 0.8),
        isBestSeller: p.isBestSeller ?? (Math.random() > 0.85),
      }));

      setOriginalProducts(procesados);
      setProductos(procesados);
      setVisibleProducts(procesados.slice(0, 10));
    } catch (error) {
      console.error("❌ Error cargando productos:", error);
      setOriginalProducts([]);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  /* PAGINACIÓN */
  useEffect(() => {
    if (productos.length > 0) {
      setVisibleProducts(productos.slice(0, visibleCount));
    }
  }, [productos, visibleCount]);

  /* FILTROS */
  const filtrarProductos = (filtros = {}) => {
    let filtrados = [...originalProducts];

    if (filtros.categoria && filtros.categoria !== "Todas")
      filtrados = filtrados.filter((p) => p.category === filtros.categoria);

    if (filtros.precioMin)
      filtrados = filtrados.filter((p) => p.price >= parseFloat(filtros.precioMin));

    if (filtros.precioMax)
      filtrados = filtrados.filter((p) => p.price <= parseFloat(filtros.precioMax));

    if (filtros.nombre)
      filtrados = filtrados.filter((p) =>
        p.name.toLowerCase().includes(filtros.nombre.toLowerCase())
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
    await new Promise((r) => setTimeout(r, 500));
    setVisibleCount((prev) => prev + 10);
    setLoadingMore(false);
  };

  /* AGREGAR PRODUCTO */
  const agregarProductoFirebase = async () => {
    if (!esAdmin) return;

    if (!nuevoProducto.name || !nuevoProducto.image) {
      alert("Faltan datos obligatorios");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "productos"), {
        ...nuevoProducto,
        price: parseFloat(nuevoProducto.price) || 0,
        creador: user.email,
      });

      const nuevo = {
        id: docRef.id,
        ...nuevoProducto,
        fromFirebase: true,
        price: parseFloat(nuevoProducto.price) || 0,
      };

      const nuevaLista = [nuevo, ...originalProducts];

      setOriginalProducts(nuevaLista);
      setProductos(nuevaLista);

      setModalAgregar(false);
      setNuevoProducto({
        name: "",
        category: "",
        price: "",
        discount: "",
        description: "",
        image: "",
        colors: "",
        rating: "",
        stock: "",
      });
    } catch (e) {
      console.error("Error al agregar", e);
    }
  };

  /* -----------------------------------------------------
                    RENDER COMPLETO
  ------------------------------------------------------ */
  return (
    <div className="relative min-h-screen bg-[#FDFBFD] text-gray-800 font-sans selection:bg-pink-200 selection:text-pink-900">

      {/* FONDO */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-[100px]"></div>
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
        <main className="flex-1 min-h-[50vh]">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Explora el <span className="text-pink-500 italic font-serif">Glow</span>
            </h1>
            <p className="text-gray-500 mt-2">
              {loading ? "Cargando tesoros..." : `Mostrando ${visibleProducts.length} productos`}
            </p>
          </div>

          {/* SKELETON */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white h-96 rounded-4xl animate-pulse border border-gray-100 shadow-sm"></div>
              ))}
            </div>
          ) : (
            <>
              {/* GRID */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnimatePresence mode="popLayout">
                  {visibleProducts.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group bg-white rounded-4xl p-3 shadow-sm hover:shadow-2xl hover:shadow-pink-100/60 transition-all duration-500 border border-transparent hover:border-pink-100 flex flex-col relative"
                    >

                      {/* IMAGEN */}
                      <div className="relative overflow-hidden rounded-3xl aspect-4/5 bg-gray-100">
                        <Link to={`/producto/${p.id}`}>
                          <img
                            src={p.image || "https://via.placeholder.com/300?text=No+Image"}
                            alt={p.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Error"; }}
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
                            <span className="bg-black/80 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                              <FaStar className="text-yellow-400" /> TOP
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => setProductoSeleccionado(p)}
                          className="absolute bottom-4 right-4 bg-white/90 text-pink-600 p-3 rounded-full shadow-lg opacity-0 translate-y-12 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                        >
                          <FaSearch size={16} />
                        </button>
                      </div>

                      {/* INFO */}
                      <div className="p-3 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-1 mt-1">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">
                            <Link to={`/producto/${p.id}`}>{p.name}</Link>
                          </h3>

                          <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                            <FaStar className="text-yellow-400" /> {p.rating}
                          </div>
                        </div>

                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{p.description}</p>

                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-black text-xl text-gray-900">
                            S/{Number(p.price).toFixed(2)}
                          </span>

                          <Link
                            to={`/producto/${p.id}`}
                            className="bg-gray-100 hover:bg-black hover:text-white text-gray-900 font-bold px-4 py-2 rounded-xl text-sm transition-all"
                          >
                            Ver
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* BOTÓN CARGAR MÁS */}
              {productos.length > visibleCount && (
                <div className="flex justify-center mt-12 pb-10">
                  <button
                    onClick={handleCargarMas}
                    disabled={loadingMore}
                    className="group flex flex-col items-center gap-2 text-gray-400 hover:text-pink-600 transition-colors"
                  >
                    {loadingMore ? (
                      <div className="w-8 h-8 rounded-full border-2 border-pink-300 border-t-pink-600 animate-spin" />
                    ) : (
                      <>
                        <span className="text-sm font-bold tracking-widest uppercase">
                          Cargar más estilos
                        </span>
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

          {/* SI NO HAY PRODUCTOS */}
          {!loading && visibleProducts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-gray-100 mt-4">
              <p className="text-4xl mb-4">🫠</p>
              <p className="text-xl text-gray-400">Ups, no encontramos nada.</p>
              <p className="text-sm text-gray-400 mt-2">(Revisa tu conexión o filtros)</p>

              <button
                onClick={() => window.location.reload()}
                className="text-pink-500 font-bold mt-4 underline"
              >
                Recargar Página
              </button>
            </div>
          )}
        </main>
      </div>

      {/* BOTÓN AGREGAR (ADMIN) */}
      {esAdmin && (
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setModalAgregar(true)}
          className="fixed bottom-8 right-8 bg-linear-to-r from-pink-500 to-rose-600 text-white p-5 rounded-full shadow-lg shadow-pink-500/40 hover:shadow-pink-500/60 z-50 text-2xl"
        >
          <FaPlus />
        </motion.button>
      )}

      {/* MODAL DETALLE */}
      <AnimatePresence>
        {productoSeleccionado && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductoSeleccionado(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="bg-white rounded-[2.5rem] overflow-hidden max-w-4xl w-full relative shadow-2xl z-10 flex flex-col md:flex-row"
            >
              <button
                onClick={() => setProductoSeleccionado(null)}
                className="absolute top-4 right-4 bg-white/50 hover:bg-white p-2 rounded-full"
              >
                <FaTimes size={20} />
              </button>

              <div className="md:w-1/2 flex items-center justify-center bg-gray-100 p-4">
  <img
    src={productoSeleccionado.image}
    alt={productoSeleccionado.name}
    className="max-w-[400px] max-h-[400px] object-contain rounded-2xl shadow-lg"
  />
</div>


              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-3xl font-black text-gray-900 mb-4">
                  {productoSeleccionado.name}
                </h2>

                <p className="text-gray-600 text-lg mb-6">
                  {productoSeleccionado.description}
                </p>

                <span className="text-3xl font-bold text-gray-900 mb-6 block">
                  S/{Number(productoSeleccionado.price).toFixed(2)}
                </span>

                <Link
                  to={`/producto/${productoSeleccionado.id}`}
                  className="bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-600 flex items-center justify-center gap-2"
                >
                  Ver Detalles Completos <FaBolt />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL AGREGAR */}
      <AnimatePresence>
        {esAdmin && modalAgregar && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalAgregar(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 shadow-2xl relative z-10"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-3">
                <h2 className="text-2xl font-bold text-gray-900">Agregar Producto</h2>
                <button onClick={() => setModalAgregar(false)} className="text-gray-400 hover:text-red-500">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-8">

                {/* INFO BÁSICA */}
                <section>
                  <h3 className="text-lg font-bold text-gray-700 mb-3">Información Básica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nombre"
                      className="bg-gray-50 border p-3 rounded-xl"
                      value={nuevoProducto.name}
                      onChange={(e) => setNuevoProducto({ ...nuevoProducto, name: e.target.value })}
                    />

                    <input
                      type="text"
                      placeholder="Categoría"
                      className="bg-gray-50 border p-3 rounded-xl"
                      value={nuevoProducto.category}
                      onChange={(e) => setNuevoProducto({ ...nuevoProducto, category: e.target.value })}
                    />
                  </div>
                </section>

                {/* PRECIOS */}
                <section>
                  <h3 className="text-lg font-bold text-gray-700 mb-3">Precio y Descuento</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Precio"
                      className="bg-gray-50 border p-3 rounded-xl"
                      value={nuevoProducto.price}
                      onChange={(e) => setNuevoProducto({ ...nuevoProducto, price: e.target.value })}
                    />

                    <input
                      type="number"
                      placeholder="Descuento %"
                      className="bg-gray-50 border p-3 rounded-xl"
                      value={nuevoProducto.discount}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, discount: e.target.value })
                      }
                    />
                  </div>
                </section>

                {/* DESCRIPCIÓN */}
                <section>
                  <h3 className="text-lg font-bold text-gray-700 mb-3">Descripción</h3>
                  <textarea
                    rows="3"
                    placeholder="Descripción del producto..."
                    className="w-full bg-gray-50 border p-3 rounded-xl resize-none"
                    value={nuevoProducto.description}
                    onChange={(e) =>
                      setNuevoProducto({ ...nuevoProducto, description: e.target.value })
                    }
                  />
                </section>

                {/* IMAGEN */}
                <section>
                  <h3 className="text-lg font-bold text-gray-700 mb-3">Imagen</h3>
                  <input
                    type="text"
                    placeholder="URL de la Imagen"
                    className="w-full bg-gray-50 border p-3 rounded-xl"
                    value={nuevoProducto.image}
                    onChange={(e) =>
                      setNuevoProducto({ ...nuevoProducto, image: e.target.value })
                    }
                  />
                </section>

                {/* DETALLES ADICIONALES */}
                <section>
                  <h3 className="text-lg font-bold text-gray-700 mb-3">Detalles Adicionales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                      type="text"
                      placeholder="Colores (separados por comas)"
                      className="bg-gray-50 border p-3 rounded-xl"
                      value={nuevoProducto.colors}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, colors: e.target.value })
                      }
                    />

                    <input
                      type="number"
                      placeholder="Rating (0 - 5)"
                      className="bg-gray-50 border p-3 rounded-xl"
                      value={nuevoProducto.rating}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, rating: e.target.value })
                      }
                    />

                    <input
                      type="number"
                      placeholder="Stock disponible"
                      className="bg-gray-50 border p-3 rounded-xl"
                      value={nuevoProducto.stock}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, stock: e.target.value })
                      }
                    />
                  </div>
                </section>

                {/* BOTÓN PUBLICAR */}
                <button
                  onClick={agregarProductoFirebase}
                  className="w-full bg-linear-to-r from-pink-500 to-rose-600 text-white py-4 rounded-xl font-bold shadow-md hover:shadow-xl"
                >
                  Publicar Producto
                </button>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
