import React from "react";
import ReactDOM from "react-dom";
import { useFavoritos } from "../context/FavoriteContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function ModalFavoritos({ abierto, cerrar }) {
  const { favoritos, quitarFavorito } = useFavoritos();

  if (!abierto) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {abierto && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 font-sans">
          
          {/* Backdrop Blur */}
          <motion.div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
          />

          <motion.div
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50 z-50 flex flex-col max-h-[85vh]"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* === FONDO ESTÉTICO (Orbes y Ruido) === */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-rose-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse delay-700"></div>
            </div>

            {/* HEADER FIXED */}
            <div className="relative z-10 p-8 pb-4 shrink-0">
                <button
                    className="absolute top-6 right-6 p-2.5 rounded-full bg-white/50 hover:bg-rose-50 text-gray-500 hover:text-rose-600 transition shadow-sm backdrop-blur-md cursor-pointer"
                    onClick={cerrar}
                >
                    <X size={22} />
                </button>

                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 text-center leading-none">
                    TUS <span className="text-rose-500 font-serif italic">FAVORITOS</span>
                </h2>
                <p className="text-center text-gray-500 text-sm mt-2 font-medium">
                    Tu lista de deseos personal ✨
                </p>
            </div>

            {/* CONTENIDO SCROLLABLE */}
            <div className="relative z-10 p-6 pt-0 overflow-y-auto custom-scrollbar flex-1">
                
                {favoritos.length === 0 ? (
                    <div className="text-center py-16 flex flex-col items-center">
                        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <Heart size={32} className="text-rose-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Está un poco vacío aquí</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mb-8">
                            Guarda los artículos que te encantan para no perderlos de vista.
                        </p>
                        <button 
                            onClick={cerrar}
                            className="px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
                        >
                            Explorar tienda
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence>
                            {favoritos.map((f) => (
                                <motion.div
                                    key={f.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group relative bg-white/70 backdrop-blur-sm border border-white p-4 rounded-3xl shadow-sm hover:shadow-md transition-all flex gap-4 items-center"
                                >
                                    {/* Imagen */}
                                    <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-gray-100 relative">
                                        <img
                                            src={f.image}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            alt={f.name || ""}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate pr-8">{f.name}</h3>
                                        <p className="text-rose-500 font-black text-lg">
                                            {f.price ? `S/${Number(f.price).toFixed(2)}` : "S/0.00"}
                                        </p>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex flex-col gap-2 shrink-0">
                                        <button
                                            onClick={() => quitarFavorito(f.id)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-colors shadow-sm"
                                            title="Eliminar de favoritos"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        
                                        <Link
                                            to={`/producto/${f.idProducto}`}
                                            onClick={cerrar}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-rose-500 transition-colors shadow-lg hover:shadow-rose-500/30"
                                            title="Ver Producto"
                                        >
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
            
            {/* Footer decorativo (Gradient fade) */}
            <div className="h-8 bg-linear-to-t from-white to-transparent pointer-events-none absolute bottom-0 left-0 right-0 z-20 rounded-b-[2.5rem]"></div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}