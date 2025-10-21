import React, { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { productosData } from "../assets/productosData";
import { useCarrito } from "../context/CarritoContext";

<<<<<<< HEAD
const ProductoDetalles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();

  const producto = productosData.find((p) => p.id === parseInt(id));
  const [imagenPrincipal, setImagenPrincipal] = useState(producto?.imagen);
  const [cantidad, setCantidad] = useState(1);

  if (!producto) {
    return (
      <div className="text-center text-pink-600 mt-10 text-xl font-semibold">
        Producto no encontrado 💔
      </div>
    );
  }

  const handleAgregar = () => {
    agregarAlCarrito({ ...producto, cantidad });
    navigate("/carrito");
  };

  // --- Arreglos manuales de recomendaciones ---
  const maquillaje = [
    {
      id: 1,
      nombre: "Labial rosa nude",
      imagen:
        "https://i.pinimg.com/736x/a5/09/b9/a509b992fdc8a44ce6cb9d8e7ab59b29.jpg",
    },
    {
      id: 2,
      nombre: "Sombras tonos cálidos",
      imagen:
        "https://i.pinimg.com/736x/44/36/88/4436881f91a87a6046b64b7531f81694.jpg",
    },
    {
      id: 3,
      nombre: "Iluminador dorado",
      imagen:
        "https://i.pinimg.com/736x/26/fd/0b/26fd0b09f7723cb16aef1e7ee873ec56.jpg",
    },
    {
      id: 4,
      nombre: "Rímel volumen total",
      imagen:
        "https://i.pinimg.com/736x/4b/84/2c/4b842cf6b62d5a3189b4446f6f25861d.jpg",
    },
  ];

  const accesorios = [
    {
      id: 1,
      nombre: "Collar minimalista dorado",
      imagen:
        "https://i.pinimg.com/736x/a2/f2/4c/a2f24c7d10cfce8a1cbcf7d62d841a6c.jpg",
    },
    {
      id: 2,
      nombre: "Aretes en forma de corazón",
      imagen:
        "https://i.pinimg.com/736x/ff/b2/87/ffb2875276de64cde1c83d02d39b84e2.jpg",
    },
    {
      id: 3,
      nombre: "Bolso pequeño beige",
      imagen:
        "https://i.pinimg.com/736x/61/2c/dc/612cdc169ad8d8930b6d2d5b6dd82307.jpg",
    },
    {
      id: 4,
      nombre: "Pulsera con charms",
      imagen:
        "https://i.pinimg.com/736x/6c/aa/fb/6caafb0b3e896e4c4542b9b46dc4ef56.jpg",
    },
  ];

  const frasesPositivas = [
    "✨ Eres más fuerte de lo que crees.",
    "💖 La moda no te define, tu actitud sí.",
    "🌸 Amarte es el primer paso para brillar.",
    "💫 Cada día es una nueva oportunidad para florecer.",
  ];

  const canciones = [
    { id: 1, nombre: "Confident - Demi Lovato", url: "#" },
    { id: 2, nombre: "Run the World (Girls) - Beyoncé", url: "#" },
    { id: 3, nombre: "Flowers - Miley Cyrus", url: "#" },
  ];

=======
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
>>>>>>> 4646b6da98543d9e9494612955fcd0810aa96f82
  return (
    <div className="flex flex-col">
      {/* --- SECCIÓN PRINCIPAL DEL PRODUCTO --- */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
        {/* --- GALERÍA DE IMÁGENES --- */}
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
                "https://i.pinimg.com/736x/0b/fa/d5/0bfad514897937aab83bbf84e85339a5.jpg")
            }
            className="w-full rounded-2xl shadow-lg object-cover h-[420px] transition-transform duration-300 hover:scale-105"
          />

          <div className="flex space-x-3 overflow-x-auto pb-2">
            {(producto.gallery || []).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${producto.name} ${index + 1}`}
                onClick={() => setImagenPrincipal(img)}
                className={`w-20 h-24 object-cover rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                  imagenPrincipal === img
                    ? "border-pink-500 scale-110 shadow-lg"
                    : "border-transparent hover:scale-105"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* --- INFORMACIÓN --- */}
        <motion.div
          className="flex flex-col space-y-5"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-semibold text-gray-800">
            {producto.name}
          </h1>
          <p className="text-gray-600">{producto.description}</p>
          <p className="text-2xl font-bold text-pink-600">
            ${producto.price.toFixed(2)}
          </p>

<<<<<<< HEAD
          <div className="flex items-center space-x-4">
=======
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
>>>>>>> 4646b6da98543d9e9494612955fcd0810aa96f82
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="px-3 py-1 border rounded-lg text-lg"
            >
              -
            </button>
            <span className="text-lg">{cantidad}</span>
            <button
              onClick={() => setCantidad(cantidad + 1)}
              className="px-3 py-1 border rounded-lg text-lg"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAgregar}
            className="mt-4 bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-all shadow-lg"
          >
            🛒 Agregar al carrito
          </button>
        </motion.div>
      </div>

      {/* 💄 MAQUILLAJE Y ACCESORIOS */}
      <section className="mt-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center text-pink-600">
          ✨ Recomendaciones para completar tu look ✨
        </h2>

        {/* 💄 Maquillaje */}
        <div className="mb-10">
          <h3 className="text-xl font-medium mb-4 text-gray-800">
            💄 Maquillaje sugerido
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {maquillaje.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-full h-44 object-cover"
                />
                <div className="p-3 text-center">
                  <p className="text-gray-700 font-medium">{item.nombre}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 💍 Accesorios */}
        <div className="mb-16">
          <h3 className="text-xl font-medium mb-4 text-gray-800">
            💍 Accesorios recomendados
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {accesorios.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-full h-44 object-cover"
                />
                <div className="p-3 text-center">
                  <p className="text-gray-700 font-medium">{item.nombre}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 💬 MENSAJES POSITIVOS + 🎵 CANCIONES */}
      <section className="bg-pink-50 py-10 text-center">
        <h2 className="text-2xl font-semibold text-pink-600 mb-6">
          💖 Inspírate y siéntete poderosa
        </h2>

        {/* Frases positivas */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 px-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {frasesPositivas.map((frase, index) => (
            <motion.div
              key={index}
              className="bg-white text-gray-700 px-6 py-3 rounded-xl shadow-md hover:shadow-lg max-w-sm"
              whileHover={{ scale: 1.05 }}
            >
              {frase}
            </motion.div>
          ))}
        </motion.div>

        {/* Canciones */}
        <div className="mt-10">
          <h3 className="text-xl font-medium text-gray-800 mb-4">
            🎧 Canciones para acompañarte
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {canciones.map((c) => (
              <motion.a
                key={c.id}
                href={c.url}
                className="bg-white px-5 py-2 rounded-full text-pink-600 shadow hover:bg-pink-100 transition-all"
                whileHover={{ scale: 1.05 }}
              >
                {c.nombre}
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
<<<<<<< HEAD
};

export default ProductoDetalles;
=======
}
>>>>>>> 4646b6da98543d9e9494612955fcd0810aa96f82
