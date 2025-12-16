import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function RelatedSidebar({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-5 border border-gray-200">
      
      <h2 className="text-xl font-extrabold mb-4 text-gray-800">
        Artículos relacionados
      </h2>

      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {items.map((art, index) => (
          <motion.div
            key={art.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/inspiracion/${art.slug}`}
              className="group block rounded-2xl overflow-hidden bg-white shadow hover:shadow-lg transition"
            >
              {/* IMAGEN */}
              {art.imagenUrl && (
                <img
                  src={art.imagenUrl}
                  alt={art.titulo}
                  className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}

              {/* TEXTO */}
              <div className="p-3">
                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                  {art.titulo}
                </h3>

                <p className="text-xs text-fuchsia-600 mt-1">
                  {art.categoria}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
  