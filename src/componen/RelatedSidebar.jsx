import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function RelatedSidebar({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <aside className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/60 overflow-hidden">

      {/* HEADER */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-fuchsia-600 mb-2">
          <Sparkles size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Descubre más
          </span>
        </div>

        <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
          Artículos relacionados
        </h2>
      </div>

      {/* LISTADO */}
      <div className="px-4 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
        {items.map((art, index) => (
          <motion.div
            key={art.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
          >
            <Link
              to={`/articulo/${art.slug}`}
              state={{ from: "related" }}
            >
              {/* IMAGEN */}
              {art.imagenUrl && (
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={art.imagenUrl}
                    alt={art.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* TEXTO */}
              <div className="flex flex-col min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-fuchsia-600 transition-colors">
                  {art.titulo}
                </h3>

                {art.categoria && (
                  <span className="text-xs font-medium text-gray-400 mt-1">
                    {art.categoria}
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
