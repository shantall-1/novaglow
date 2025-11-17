import React from "react";
import { Link } from "react-router-dom";

export default function RelatedCarousel({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Artículos relacionados</h2>
      <div className="flex overflow-x-auto gap-4 py-2">
        {items.map((art) => (
          <Link key={art.id} to={`/inspiracion/${art.slug}`} className="min-w-[200px] flex-strikretch">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <img src={art.imagenUrl} alt={art.titulo} className="w-full h-32 object-cover" />
              <div className="p-3">
                <h3 className="font-bold text-gray-800">{art.titulo}</h3>
                <p className="text-sm text-gray-600">{art.categoria}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
