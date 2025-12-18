import { Link } from "react-router-dom";

export default function ContentCard({ article }) {
 const { titulo, contenido, imagenUrl, categoria, slug } = article;

  const MAX_WORDS = 20;
  const palabras = contenido.split(" ");
  const descripcionCorta =
    palabras.length > MAX_WORDS
      ? palabras.slice(0, MAX_WORDS).join(" ") + "..."
      : contenido;

  return (
    <div className="bg-white/80 rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
      
      {/* Imagen */}
      <Link to={`/inspiracion/${slug}`}>
        <img
          src={imagenUrl}
          alt={titulo}
          className="w-full h-64 object-cover rounded-t-3xl"
        />
      </Link>

      {/* Contenido */}
      <div className="p-6 flex flex-col grow space-y-4">
        
        {categoria && (
          <span className="inline-block bg-fuchsia-100 text-pink-600 text-sm font-semibold px-3 py-1 rounded-full w-fit">
            {categoria}
          </span>
        )}

        <Link to={`/inspiracion/${slug}`}>
          <h2 className="text-2xl font-bold text-gray-800 hover:text-pink-800 transition">
            {titulo}
          </h2>
        </Link>

        <p className="text-gray-600 leading-relaxed">
          {descripcionCorta}
        </p>

        {/* Botón siempre abajo */}
        <div className="pt-4 mt-auto">
          <Link
            to={`/inspiracion/${slug}`}
            className="inline-block bg-linear-to-r from-pink-500 to-rose-600 text-white px-5 py-2 rounded-full font-medium hover:bg-fuchsia-700 transition-all shadow-md"
          >
            Leer más
          </Link>
        </div>
      </div>
    </div>
  );
}