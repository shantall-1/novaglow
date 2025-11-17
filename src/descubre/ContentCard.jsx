import React from "react";
import { Link } from "react-router-dom";

function ContentCard({ article }) {
  const { titulo, contenido, imagenUrl, categoria, slug } = article;

  // Limitar descripción a N palabras
  const MAX_WORDS = 20;
  const palabras = contenido.split(" ");
  const descripcionCorta =
    palabras.length > MAX_WORDS
      ? palabras.slice(0, MAX_WORDS).join(" ") + "..."
      : contenido;

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      {/* Imagen */}
      <Link to={`/inspiracion/${slug}`}>
        <img
          src={imagenUrl}
          alt={titulo}
          className="w-full h-64 object-cover rounded-t-3xl"
        />
      </Link>

      {/* Contenido */}
      <div className="p-6 space-y-4">
        {/* Categoría */}
        {categoria && (
          <span className="inline-block bg-fuchsia-100 text-fuchsia-600 text-sm font-semibold px-3 py-1 rounded-full">
            {categoria}
          </span>
        )}

        {/* Título */}
        <Link to={`/inspiracion/${slug}`}>
          <h2 className="text-2xl font-bold text-gray-800 hover:text-fuchsia-600 transition">
            {titulo}
          </h2>
        </Link>

        {/* Descripción resumida */}
        <p className="text-gray-600 leading-relaxed">{descripcionCorta}</p>

        {/* Botón */}
        <div className="pt-2">
          <Link
            to={`/inspiracion/${slug}`}
            className="inline-block bg-fuchsia-600 text-white px-5 py-2 rounded-full font-medium hover:bg-fuchsia-700 transition-all shadow-md"
          >
            Leer más
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ContentCard;
