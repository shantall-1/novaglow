import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, StarHalf, Star as StarEmpty } from "lucide-react";
import { productosData } from "../assets/productosData";

export default function ProductoDetalles({ productId = 1 }) {
  const producto = productosData.find((p) => p.id === productId) || productosData[0];

  // --- ESTADOS ---
  const [imagenPrincipal, setImagenPrincipal] = useState(
    producto.gallery?.[0] || producto.image || ""
  );
  const [colorSeleccionado, setColorSeleccionado] = useState(
    producto.colors ? producto.colors[0] : null
  );
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  // --- CARGAR RESEÑAS DESDE localStorage ---
  useEffect(() => {
    const stored = localStorage.getItem(`reviews_${producto.id}`);
    if (stored) {
      setReviews(JSON.parse(stored));
    } else {
      setReviews([
        "Excelente calidad y bonito diseño.",
        "Llegó rápido y el empaque estaba impecable.",
        "Se ve igual que en las fotos, muy recomendado."
      ]);
    }
  }, [producto.id]);

  // --- GUARDAR RESEÑAS EN localStorage ---
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem(`reviews_${producto.id}`, JSON.stringify(reviews));
    }
  }, [producto.id, reviews]);

  // --- CALCULAR DESCUENTO ---
  const precioDescuento = (
    producto.price -
    producto.price * (producto.discount / 100)
  ).toFixed(2);

  // --- AÑADIR NUEVA RESEÑA ---
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (review.trim()) {
      const nuevas = [
        {
          id: Date.now(),
          texto: review.trim(),
          fecha: new Date().toLocaleString("es-ES", {
            dateStyle: "short",
            timeStyle: "short"
          })
        },
        ...reviews
      ];
      setReviews(nuevas);
      setReview("");
    }
  };

  // --- ESTRELLAS ---
  const renderStars = (rating) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        estrellas.push(<Star key={i} className="text-yellow-400 fill-yellow-400" />);
      else if (rating >= i - 0.5)
        estrellas.push(<StarHalf key={i} className="text-yellow-400 fill-yellow-400" />);
      else estrellas.push(<StarEmpty key={i} className="text-gray-300" />);
    }
    return estrellas;
  };

  // --- RENDER ---
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
      {/* GALERÍA */}
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.img
          key={imagenPrincipal}
          src={imagenPrincipal}
          alt={producto.name}
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/300x400.png?text=Imagen+no+disponible")
          }
          className="w-full rounded-2xl shadow-lg object-cover h-[400px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        <div className="flex space-x-3 overflow-x-auto pb-2">
          {producto.gallery?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${producto.name} ${index + 1}`}
              onClick={() => setImagenPrincipal(img)}
              className={`w-20 h-24 object-cover rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                imagenPrincipal === img
                  ? "border-pink-500 scale-110"
                  : "border-transparent hover:scale-105"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* INFORMACIÓN DEL PRODUCTO */}
      <motion.div
        className="flex flex-col space-y-5"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-800">{producto.name}</h2>
        <p className="text-gray-500 text-sm uppercase tracking-wide">
          {producto.brand} — {producto.category}
        </p>

        <div className="flex items-center space-x-2">
          {renderStars(producto.rating)}
          <span className="text-gray-600 text-sm ml-2">
            ({producto.reviews} reseñas)
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-pink-600">
            ${precioDescuento}
          </span>
          <span className="text-gray-400 line-through">${producto.price}</span>
          <span className="bg-pink-100 text-pink-600 text-sm font-semibold px-2 py-1 rounded-lg">
            -{producto.discount}%
          </span>
        </div>

        <p className="text-gray-700 leading-relaxed">{producto.description2}</p>

        {/* COLORES */}
        {producto.colors && (
          <div>
            <p className="font-semibold mb-2">Colores disponibles:</p>
            <div className="flex space-x-3">
              {producto.colors.map((color, i) => (
                <div
                  key={i}
                  onClick={() => setColorSeleccionado(color)}
                  title={color}
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer flex items-center justify-center transition-transform ${
                    colorSeleccionado === color
                      ? "border-pink-500 scale-110"
                      : "border-gray-300 hover:scale-105"
                  }`}
                  style={{
                    background:
                      color.toLowerCase().includes("blanco")
                        ? "#f0f0f0"
                        : color.toLowerCase().includes("negro")
                        ? "#000"
                        : color.toLowerCase().includes("marrón")
                        ? "#7b4b2a"
                        : color.toLowerCase().includes("rosa")
                        ? "pink"
                        : color.toLowerCase().includes("celeste")
                        ? "#87CEEB"
                        : color.toLowerCase().includes("beige")
                        ? "#f5f5dc"
                        : color.toLowerCase().includes("natural")
                        ? "tan"
                        : color
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* BOTÓN */}
        <button className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-3 rounded-xl shadow-md transition">
          Agregar al carrito
        </button>

        {/* RESEÑAS */}
        <div className="mt-8 border-t pt-5">
          <h3 className="text-xl font-semibold mb-3">Opiniones de clientes</h3>

          <div className="space-y-3 mb-5">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div key={r.id || r} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                  <p className="text-gray-800">{r.texto || r}</p>
                  {r.fecha && (
                    <p className="text-xs text-gray-500 mt-1">{r.fecha}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">Aún no hay reseñas.</p>
            )}
          </div>

          <form onSubmit={handleReviewSubmit} className="flex flex-col space-y-3">
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Escribe tu reseña..."
              className="border rounded-lg p-3 focus:ring-2 focus:ring-pink-400"
              rows="3"
            />
            <button
              type="submit"
              className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition"
            >
              Enviar reseña
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}