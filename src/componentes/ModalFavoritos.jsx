import React from "react";
import ReactDOM from "react-dom";
import { useFavoritos } from "../context/FavoriteContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Trash2, ArrowRight } from "lucide-react";

export default function ModalFavoritos({ abierto, cerrar }) {
  const { favoritos, quitarFavorito } = useFavoritos();

  if (!abierto) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {abierto && (
        <div className="fixed inset-0 z-[9999] flex justify-end font-sans">
          
          {/* BACKDROP */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
          />

          {/* PANEL */}
          <motion.div
            className="
              relative z-10
              h-full w-full
              md:max-w-md
              bg-white
              shadow-2xl
              flex flex-col
            "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >

            {/* HEADER */}
            <div className="p-6 border-b relative">
              <button
                onClick={cerrar}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-rose-50 text-gray-500 hover:text-rose-500 transition"
              >
                <X size={22} />
              </button>

              <h2 className="text-2xl font-black tracking-tight text-gray-900">
                TUS <span className="text-rose-500 font-serif italic">FAVORITOS</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Guarda lo que te enamora ✨
              </p>
            </div>

            {/* CONTENIDO */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {favoritos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-6">
                    <Heart size={32} className="text-rose-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Tu lista está vacía
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 mb-6">
                    Guarda tus productos favoritos para verlos aquí.
                  </p>
                  <button
                    onClick={cerrar}
                    className="px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:scale-105 transition"
                  >
                    Explorar tienda
                  </button>
                </div>
              ) : (
                favoritos.map((f) => (
                  <motion.div
                    key={f.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-4 items-center bg-white border rounded-2xl p-3 shadow-sm"
                  >
                    {/* Imagen */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={f.image}
                        alt={f.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">
                        {f.name}
                      </h4>
                      <p className="text-rose-500 font-black">
                        {f.price ? `S/${Number(f.price).toFixed(2)}` : "S/0.00"}
                      </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => quitarFavorito(f.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-400 hover:text-red-500 hover:border-red-200 transition"
                      >
                        <Trash2 size={14} />
                      </button>

                      <Link
                        to={`/producto/${f.idProducto}`}
                        onClick={cerrar}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-rose-500 transition"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* FOOTER (solo desktop) */}
            <div className="hidden md:block p-4 border-t text-center text-xs text-gray-400">
              NovaGlow ✨
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
