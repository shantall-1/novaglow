import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Trash2, ShoppingBag } from "lucide-react";
import { useFavoritos } from "../context/FavoriteContext";
import { useCarrito } from "../context/CarritoContext";

export default function FavoritosModal({ isOpen, onClose }) {
  const { favoritos, quitarFavorito } = useFavoritos();
  const { agregarAlCarrito } = useCarrito();

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [talla, setTalla] = useState("");

  const tallasDisponibles = ["XS", "S", "M", "L", "XL"];

  const agregarConTalla = () => {
    if (!talla || !productoSeleccionado) return;
    agregarAlCarrito({ ...productoSeleccionado, talla });
    setProductoSeleccionado(null);
    setTalla("");
  };

  // Bloquear scroll de forma segura
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo oscuro */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel lateral - AÑADIDO 'relative' para evitar advertencia de Framer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-[90%] sm:w-[450px] bg-white z-[9999] shadow-2xl border-l border-pink-100 p-6 overflow-y-auto relative"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          >
            {/* Título */}
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 z-[10]">
              <h2 className="text-xl font-extrabold text-pink-600 flex items-center gap-2">
                <Heart size={22} className="text-pink-500" /> Mis Favoritos
              </h2>
              <button
                className="p-2 rounded-full hover:bg-pink-50 transition"
                onClick={onClose}
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Lista */}
            {favoritos.length === 0 ? (
              <p className="text-gray-500 text-center mt-20">
                No tienes productos en favoritos.
              </p>
            ) : (
              <div className="space-y-5 pb-8 relative">
                {favoritos.map((item) => (
                  <motion.div
                    key={item.id}
                    layout // Añadido para animaciones suaves al borrar
                    className="flex gap-4 p-3 bg-white rounded-xl shadow-sm border border-pink-100 hover:shadow-md transition cursor-pointer relative"
                    whileHover={{ scale: 1.015 }}
                    onClick={() =>
                      item.category === "ropa" && setProductoSeleccionado(item)
                    }
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover border border-white shadow"
                    />

                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-pink-600 font-bold text-sm">S/ {item.price}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <button
                          className="flex items-center gap-2 text-sm bg-pink-500 text-white px-3 py-1.5 rounded-lg hover:bg-pink-600 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.category === "ropa") return setProductoSeleccionado(item);
                            agregarAlCarrito(item);
                          }}
                        >
                          <ShoppingBag size={16} /> Agregar
                        </button>

                        <button
                          className="text-gray-400 hover:text-rose-500 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            quitarFavorito(item.idProducto || item.id);
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* MODAL DE TALLAS */}
          <AnimatePresence>
            {productoSeleccionado && (
              <motion.div
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md border border-pink-100 relative"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.85 }}
                >
                  <h3 className="text-xl font-bold text-pink-600 mb-3 text-center">
                    Seleccionar talla
                  </h3>
                  <div className="flex gap-2 flex-wrap justify-center mb-4">
                    {tallasDisponibles.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTalla(t)}
                        className={`px-4 py-2 rounded-full border text-sm transition ${
                          talla === t
                            ? "bg-pink-500 text-white border-pink-500"
                            : "border-gray-300 text-gray-600 hover:bg-pink-50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={agregarConTalla}
                    className="w-full bg-pink-500 text-white py-3 rounded-lg font-bold hover:bg-pink-600 transition"
                  >
                    Agregar al carrito
                  </button>
                  <button
                    onClick={() => {
                      setProductoSeleccionado(null);
                      setTalla("");
                    }}
                    className="mt-3 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancelar
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}