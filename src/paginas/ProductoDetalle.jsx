import { useState } from "react";
// Usaremos elementos nativos en lugar de framer-motion para evitar dependencias externas.
// Las importaciones de router y context se simulan o se eliminan para que el archivo sea ejecutable.

// --- 1. SIMULACIÓN DE DATOS (PRODUCTOS Y RECOMENDACIONES) ---

// Mock Data de un producto completo (simulando productosData)
const productosData = [
  {
    id: 1,
    name: "Vestido de Noche 'NovaGlow'",
    description: "Un elegante vestido de corte A con encaje delicado y un brillo sutil. Perfecto para eventos formales o una salida especial. Te hará sentir poderosa y glamurosa.",
    price: 129.99,
    discount: 15,
    rating: 4.5,
    image: "https://placehold.co/800x1200/f06c9b/fff?text=Vestido+Rosa+Frente",
    gallery: [
      "https://placehold.co/800x1200/ffb9b6/000?text=Vestido+Lateral",
      "https://placehold.co/800x1200/feeae9/000?text=Detalle+Encaje",
      "https://placehold.co/800x1200/fec8d8/000?text=Vestido+Espalda",
    ],
    colors: ["Rosa", "Negro", "Dorado"],
    sizes: ["S", "M", "L", "XL"],
    stock: 50,
  },
  { id: 2, name: "Producto Mock", price: 50, image: "https://placehold.co/800x1200/cccccc/000?text=Mock" }
];

// Mock Data de recomendaciones (faltaba en el código original)
const maquillaje = [
  { id: 1, nombre: "Labial rosa nude", imagen: "https://placehold.co/100x100/f7799e/fff?text=Labial", link: "#" },
  { id: 2, nombre: "Sombras tonos cálidos", imagen: "https://placehold.co/100x100/f06c9b/fff?text=Sombras", link: "#" },
  { id: 3, nombre: "Iluminador dorado", imagen: "https://placehold.co/100x100/ffb9b6/000?text=Iluminador", link: "#" },
  { id: 4, nombre: "Rímel volumen total", imagen: "https://placehold.co/100x100/e06b8b/fff?text=Rimel", link: "#" },
];

const accesorios = [
  { id: 101, nombre: "Collar minimalista dorado", imagen: "https://placehold.co/100x100/fff/f06c9b?text=Collar", link: "#" },
  { id: 102, nombre: "Aretes en forma de corazón", imagen: "https://placehold.co/100x100/fff/f7799e?text=Aretes", link: "#" },
  { id: 103, nombre: "Bolso pequeño beige", imagen: "https://placehold.co/100x100/feeae9/f06c9b?text=Bolso", link: "#" },
  { id: 104, nombre: "Pulsera con charms", imagen: "https://placehold.co/100x100/fec8d8/f06c9b?text=Pulsera", link: "#" },
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

// --- 2. COMPONENTES SVG PARA ÍCONOS DE ESTRELLAS ---

// Iconos Star de Lucide (in-line SVG)
const Star = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const StarHalf = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z" />
  </svg>
);

const StarEmpty = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// --- 3. COMPONENTE PRINCIPAL ---

export default function ProductoDetalles({ productId = 1 }) {
  // SIMULACIÓN DE HOOKS QUE FALTABAN
  const agregarAlCarrito = (item) => {
    alert(`Agregado al carrito: ${item.name} x ${item.cantidad}`);
  };

  const producto = productosData.find((p) => p.id === productId) || productosData[0];

  // --- ESTADOS ---
  const [imagenPrincipal, setImagenPrincipal] = useState(
    producto.gallery?.[0] || producto.image || ""
  );
  const [colorSeleccionado, setColorSeleccionado] = useState(
    producto.colors ? producto.colors[0] : null
  );
  const [cantidad, setCantidad] = useState(1); // ESTADO FALTANTE
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([
    // Reviews de ejemplo (reemplazo de localStorage)
    { id: 1, texto: "Excelente calidad y bonito diseño.", fecha: "15/07/2024" },
    { id: 2, texto: "Se ve igual que en las fotos, muy recomendado.", fecha: "15/07/2024" }
  ]);
  const [sizeSeleccionado, setSizeSeleccionado] = useState(
    producto.sizes ? producto.sizes[0] : null
  );

  // --- CÁLCULOS ---
  const precioDescuento = (
    producto.price -
    producto.price * (producto.discount / 100)
  ).toFixed(2);

  // --- FUNCIONES FALTANTES ---
  const handleAgregar = () => {
    if (!sizeSeleccionado) {
      alert("Por favor, selecciona una talla antes de agregar al carrito.");
      return;
    }
    agregarAlCarrito({ 
        ...producto, 
        cantidad, 
        color: colorSeleccionado, 
        size: sizeSeleccionado 
    });
    // navigate("/carrito"); // Simulación de navegación
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (review.trim()) {
      const nuevas = [
        {
          id: Date.now(),
          texto: review.trim(),
          fecha: new Date().toLocaleDateString("es-ES", {
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

  // Si el producto no existe (aunque debería existir por el mock), muestra error.
  if (!producto) {
    return (
      <div className="text-center text-red-500 py-20 font-bold text-xl">
        Producto no encontrado.
      </div>
    );
  }

  // --- RENDER DEL COMPONENTE ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* --- SECCIÓN PRINCIPAL DEL PRODUCTO --- */}
        <div className="bg-white rounded-3xl shadow-xl p-6 grid md:grid-cols-2 gap-10">
          
          {/* --- GALERÍA DE IMÁGENES --- */}
          <div className="flex flex-col items-center space-y-4">
            <img
              key={imagenPrincipal}
              src={imagenPrincipal}
              alt={producto.name}
              onError={(e) =>
                (e.target.src =
                  "https://placehold.co/800x1200/cccccc/000?text=Imagen+No+Disp")
              }
              className="w-full rounded-2xl shadow-lg object-cover h-[450px] transition-transform duration-300 hover:scale-[1.02]"
            />

            <div className="flex space-x-3 overflow-x-auto pb-2 w-full justify-center">
              {(producto.gallery || []).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${producto.name} ${index + 1}`}
                  onClick={() => setImagenPrincipal(img)}
                  className={`w-20 h-24 object-cover rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                    imagenPrincipal === img
                      ? "border-pink-500 scale-110 shadow-lg"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* --- INFORMACIÓN --- */}
          <div className="flex flex-col space-y-5 pt-4">
            <h1 className="text-4xl font-extrabold text-gray-800">
              {producto.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(producto.rating)}</div>
              <span className="text-sm text-gray-500">
                ({producto.rating} / 5, {reviews.length} reseñas)
              </span>
            </div>

            {/* Precio */}
            <div className="flex items-baseline space-x-3">
              {producto.discount > 0 && (
                <span className="text-lg text-gray-500 line-through">
                  ${producto.price.toFixed(2)}
                </span>
              )}
              <span className="text-4xl font-bold text-pink-600">
                ${precioDescuento}
              </span>
              {producto.discount > 0 && (
                <span className="text-base font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full">
                  {producto.discount}% OFF
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed border-b pb-5">
                {producto.description}
            </p>

            {/* Opciones (Colores) */}
            {producto.colors && producto.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  Color: <span className="font-normal">{colorSeleccionado}</span>
                </h3>
                <div className="flex space-x-3">
                  {producto.colors.map((color) => (
                    <div
                      key={color}
                      onClick={() => setColorSeleccionado(color)}
                      className={`w-8 h-8 rounded-full border-4 cursor-pointer transition-all duration-200 ${
                        colorSeleccionado === color
                          ? "border-pink-500 scale-110 shadow-md"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                      style={{ 
                          backgroundColor: color === 'Rosa' ? '#F472B6' : (color === 'Negro' ? '#111827' : (color === 'Dorado' ? '#EAB308' : '#D1D5DB'))
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Opciones (Tallas) */}
            {producto.sizes && producto.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  Talla: <span className="font-normal">{sizeSeleccionado}</span>
                </h3>
                <div className="flex space-x-3">
                  {producto.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSizeSeleccionado(size)}
                      className={`px-4 py-2 border rounded-xl font-medium transition-all duration-200 ${
                        sizeSeleccionado === size
                          ? "bg-pink-500 text-white shadow-md border-pink-500"
                          : "bg-white text-gray-700 hover:bg-pink-50 border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}


            {/* Control de Cantidad y Agregar */}
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  −
                </button>
                <span className="text-lg font-medium w-6 text-center">{cantidad}</span>
                <button
                  onClick={() => setCantidad(cantidad + 1)}
                  className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAgregar}
                className="flex-1 bg-pink-500 text-white font-extrabold text-lg py-3 rounded-xl hover:bg-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.005]"
              >
                🛒 Agregar al carrito
              </button>
            </div>
            
            <p className="text-sm text-gray-500 italic">
                Solo quedan **{producto.stock}** unidades disponibles.
            </p>
          </div>
        </div>

        {/* --- SECCIÓN DE RESEÑAS --- */}
        <div className="mt-12 p-8 bg-white rounded-3xl shadow-xl">
          <h2 className="text-3xl font-extrabold text-pink-700 mb-6 border-b pb-3">
            💬 Opiniones de Clientes ({reviews.length})
          </h2>

          {/* Formulario de Reseñas */}
          <div className="mb-8 p-6 bg-pink-50 rounded-xl border border-pink-100">
            <h3 className="text-xl font-semibold text-pink-700 mb-3">
                Deja tu opinión:
            </h3>
            <form onSubmit={handleReviewSubmit} className="flex flex-col space-y-3">
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Comparte tu experiencia con el producto..."
                className="border-2 border-pink-300 rounded-lg p-3 focus:ring-4 focus:ring-pink-400 resize-none outline-none"
                rows="3"
              />
              <button
                type="submit"
                className="self-start px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition shadow-md"
              >
                Enviar
              </button>
            </form>
          </div>

          {/* Lista de Reseñas */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div 
                  key={r.id} 
                  className="bg-gray-50 p-4 rounded-xl shadow-sm border-l-4 border-pink-400"
                >
                  <p className="text-gray-800 italic mb-2">"{r.texto}"</p>
                  <p className="text-xs text-gray-500 font-semibold mt-2 text-right">
                    Compradora anónima - {r.fecha}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-center py-5">Sé la primera en dejar una reseña.</p>
            )}
          </div>
        </div>
      
        {/* --- MAQUILLAJE Y ACCESORIOS (Recomendaciones) --- */}
        <section className="mt-12">
            <h2 className="text-3xl font-extrabold text-pink-700 mb-8 text-center">
              ✨ Recomendaciones para completar tu look ✨
            </h2>

            {/* 💄 Maquillaje */}
            <div className="mb-10 p-6 bg-white rounded-2xl shadow-lg">
              <h3 className="text-xl font-medium mb-4 text-gray-800 border-b pb-2">
                💄 Maquillaje sugerido
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {maquillaje.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] cursor-pointer"
                  >
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-3 text-center">
                      <p className="text-gray-700 font-medium">{item.nombre}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 💍 Accesorios */}
            <div className="mb-16 p-6 bg-white rounded-2xl shadow-lg">
              <h3 className="text-xl font-medium mb-4 text-gray-800 border-b pb-2">
                💍 Accesorios recomendados
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {accesorios.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] cursor-pointer"
                  >
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-3 text-center">
                      <p className="text-gray-700 font-medium">{item.nombre}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </section>

        {/* 💬 MENSAJES POSITIVOS + 🎵 CANCIONES */}
        <section className="bg-pink-100 py-10 rounded-3xl text-center shadow-inner">
          <h2 className="text-3xl font-extrabold text-pink-700 mb-8">
            💖 Inspírate y siéntete poderosa
          </h2>

          {/* Frases positivas */}
          <div className="flex flex-wrap justify-center gap-6 px-4">
            {frasesPositivas.map((frase, index) => (
              <div
                key={index}
                className="bg-white text-gray-700 px-6 py-3 rounded-xl shadow-md hover:shadow-lg max-w-sm transition-all duration-300 hover:scale-[1.05] font-medium italic"
              >
                {frase}
              </div>
            ))}
          </div>

          {/* Canciones */}
          <div className="mt-10">
            <h3 className="text-xl font-medium text-gray-800 mb-4">
              🎧 Canciones para acompañarte
            </h3>
            <div className="flex flex-wrap justify-center gap-4 px-4">
              {canciones.map((c) => (
                <a
                  key={c.id}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white px-5 py-2 rounded-full text-pink-600 shadow-lg hover:bg-pink-200 transition-all font-bold hover:scale-[1.05]"
                >
                  {c.nombre}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}