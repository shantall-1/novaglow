import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { productosData } from "../assets/productosData";
import { useCarrito } from "../context/CarritoContext"; // <-- 1. IMPORTAR EL CONTEXTO

// --- Datos recomendados, frases y canciones ---
const maquillaje = [
  { id: 12, nombre: "Labial rosa nude", link: "https://i.pinimg.com/736x/ca/b8/29/cab8294334fe8a3d1bdcd72b3b57b25d.jpg" },
  { id: 13, nombre: "Sombras tonos cálidos", link: "https://i.pinimg.com/736x/7b/ca/82/7bca82b43809c4cb08e19748c7a64a92.jpg" },
  { id: 14, nombre: "Iluminador dorado", link: "https://i.pinimg.com/736x/72/76/9c/72769c8635a64eff714c4a5904c6cd4f.jpg" },
  { id: 15, nombre: "Rímel volumen total", link: "https://i.pinimg.com/736x/3f/f8/43/3ff843f98b18b7b4a84ad27889ec34b2.jpg" },
];

const accesorios = [
  { id: 16, nombre: "Collar minimalista dorado", link: "https://i.pinimg.com/736x/fe/eb/75/feeb75122196d09c7790e70ae0167d12.jpg" },
  { id: 17, nombre: "Argolla dorado", link: "https://i.pinimg.com/736x/80/cf/da/80cfda63ef970b64d57f177b371ace49.jpg" },
  { id: 18, nombre: "Bolso pequeño beige", link: "https://i.pinimg.com/736x/18/e0/49/18e0491791e065357f0637c97933b591.jpg" },
  { id: 19, nombre: "Pulsera con charms", link: "https://i.pinimg.com/736x/5f/f9/bc/5ff9bcbb5852580f4f5d67e624e5dd89.jpg" },
];

const frasesPositivas = [
  "Eres más fuerte de lo que crees.",
  "La moda no te define, tu actitud sí.",
  "Amarte es el primer paso para brillar.",
  "Cada día es una nueva oportunidad para florecer.",
];

const canciones = [
  { id: 1, nombre: "KATSEYE - Mean Girls", url: "https://youtu.be/QQpAtjmCdKQ?si=OlzjuBNIU5iySHhH" },
  { id: 2, nombre: "EASYKID - SHINY", url: "https://youtu.be/EHAEFXTntHI?si=zQmd2wsOYOY997tW" },
  { id: 3, nombre: "5SOS - Easier", url: "https://youtu.be/b1dFSWLJ9wY?si=nZHzHIM9lNsOM_oG" },
];

// --- SVG Star Icons ---
const Star = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const StarHalf = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z" />
  </svg>
);
const StarEmpty = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// --- Componente principal ---
export default function ProductoDetalles() {
  const { id } = useParams();
  const { agregarAlCarrito } = useCarrito();
  const producto = productosData.find((p) => String(p.id) === String(id)) || productosData[0];

  const [imagenPrincipal, setImagenPrincipal] = useState(producto.gallery?.[0] || producto.image || "");
  const [colorSeleccionado, setColorSeleccionado] = useState(producto.colors?.[0] || "");
  const [sizeSeleccionado, setSizeSeleccionado] = useState(producto.sizes?.[0] || "");
  const [cantidad, setCantidad] = useState(1);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  const precioDescuento = (producto.price - producto.price * (producto.discount / 100)).toFixed(2);

  const renderStars = (rating) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) estrellas.push(<Star key={i} className="text-yellow-400 fill-yellow-400" />);
      else if (rating >= i - 0.5) estrellas.push(<StarHalf key={i} className="text-yellow-400 fill-yellow-400" />);
      else estrellas.push(<StarEmpty key={i} className="text-gray-300" />);
    }
    return estrellas;
  };

  const handleAgregar = () => {
    if (!sizeSeleccionado) {
      alert("Por favor, selecciona una talla antes de agregar al carrito.");
      return;
    }

    const itemParaCarrito = {
      ...producto,
      price: parseFloat(precioDescuento),
      image: imagenPrincipal,
      size: sizeSeleccionado,
      color: colorSeleccionado,
    };

    agregarAlCarrito(itemParaCarrito, cantidad);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!review.trim()) return;
    setReviews([{ id: Date.now(), texto: review.trim(), fecha: new Date().toLocaleDateString("es-ES") }, ...reviews]);
    setReview("");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Producto */}
        <div className="bg-white rounded-3xl shadow-xl p-6 grid md:grid-cols-2 gap-10">
          {/* Galería */}
          <div className="flex flex-col items-center space-y-4">
            <img src={imagenPrincipal} alt={producto.name} className="w-full rounded-2xl shadow-lg object-cover h-[450px] transition-transform duration-500 hover:scale-[1.02]" />
            <div className="flex space-x-3 overflow-x-auto pb-2 w-full justify-center">
              {producto.gallery?.map((img, i) => (
                <img key={i} src={img} alt={i} onClick={() => setImagenPrincipal(img)}
                  className={`w-20 h-24 object-cover rounded-xl cursor-pointer border-2 transition-all duration-300 ${imagenPrincipal === img ? "border-pink-500 scale-110 shadow-lg" : "border-transparent opacity-70 hover:opacity-100"}`} />
              ))}
            </div>
          </div>

          {/* Info Producto */}
          <div className="flex flex-col space-y-5 pt-4">
            <h1 className="text-4xl font-extrabold text-gray-800">{producto.name}</h1>
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(producto.rating)}</div>
              <span className="text-sm text-gray-500">({producto.rating} / 5, {reviews.length} reseñas)</span>
            </div>
            <div className="flex items-baseline space-x-3">
              {producto.discount > 0 && <span className="text-lg text-gray-500 line-through">${producto.price.toFixed(2)}</span>}
              <span className="text-4xl font-bold text-pink-600">${precioDescuento}</span>
              {producto.discount > 0 && <span className="text-base font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full">{producto.discount}% OFF</span>}
            </div>
            <p className="text-gray-600 leading-relaxed border-b pb-5">{producto.description}</p>

            {/* Colores */}
            <div className="flex space-x-3 mb-3">
              {producto.colors?.map(c => (
                <div key={c} onClick={() => setColorSeleccionado(c)}
                  className={`w-8 h-8 rounded-full border-4 cursor-pointer transition-all duration-200 ${colorSeleccionado===c?"border-pink-500 scale-110 shadow-md":"border-gray-200 hover:border-pink-300"}`}
                  style={{ backgroundColor: c==="Rosa"?"#F472B6":c==="Negro"?"#111827":"#EAB308" }} title={c}></div>))}
            </div>

            {/* Tallas */}
            <div className="flex space-x-3 mb-3">
              {producto.sizes?.map(s => (
                <button key={s} onClick={() => setSizeSeleccionado(s)}
                  className={`px-4 py-2 border rounded-xl font-medium ${sizeSeleccionado===s?"bg-pink-500 text-white shadow-md border-pink-500":"bg-white text-gray-700 hover:bg-pink-50 border-gray-300"}`}>
                  {s}
                </button>
              ))}
            </div>

            {/* Cantidad y carrito */}
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
                <button onClick={()=>setCantidad(Math.max(1,cantidad-1))} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-lg transition">−</button>
                <span className="text-lg font-medium w-6 text-center">{cantidad}</span>
                <button onClick={()=>setCantidad(cantidad+1)} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-lg transition">+</button>
              </div>
              <button onClick={handleAgregar} className="flex-1 bg-pink-500 text-white font-extrabold text-lg py-3 rounded-xl hover:bg-pink-600 transition-all shadow-lg">🛒 Agregar al carrito</button>
              <button className="ml-3 px-3 py-2 bg-white border border-pink-300 text-pink-600 rounded-xl hover:bg-pink-50 transition">❤️</button>
            </div>
            <p className="text-sm text-gray-500 italic">Solo quedan {producto.stock} unidades disponibles.</p>
          </div>
        </div>

        {/* Recomendaciones y motivación */}
        <section className="mt-12">
          <h2 className="text-3xl font-extrabold text-pink-700 mb-8 text-center">✨ Recomendaciones para completar tu look ✨</h2>

          {/* Maquillaje */}
          <div className="mb-10 p-6 bg-white rounded-2xl shadow-lg">
            <h3 className="text-xl font-medium mb-4 text-gray-800 border-b pb-2">💄 Maquillaje sugerido</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {maquillaje.map(item => (
                <Link key={item.id} to={`/producto/${item.id}`} className="bg-gray-50 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] cursor-pointer block">
                  <img src={item.link} alt={item.nombre} className="w-full h-44 object-cover"/>
                  <div className="p-3 text-center"><p className="text-gray-700 font-medium">{item.nombre}</p></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Accesorios */}
          <div className="mb-16 p-6 bg-white rounded-2xl shadow-lg">
            <h3 className="text-xl font-medium mb-4 text-gray-800 border-b pb-2">👜 Accesorios recomendados</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {accesorios.map(item => (
                <Link key={item.id} to={`/producto/${item.id}`} className="bg-gray-50 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] cursor-pointer block">
                  <img src={item.link} alt={item.nombre} className="w-full h-44 object-cover"/>
                  <div className="p-3 text-center"><p className="text-gray-700 font-medium">{item.nombre}</p></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Frases y canciones */}
          <section className="bg-pink-100 py-10 rounded-3xl text-center shadow-inner mb-12">
            <h2 className="text-3xl font-extrabold text-pink-700 mb-8"> Inspírate y siéntete poderosa </h2>
            <div className="flex flex-wrap justify-center gap-6 px-4">
              {frasesPositivas.map((fr, i)=>(
                <div key={i} className="bg-white text-gray-700 px-6 py-3 rounded-xl shadow-md hover:shadow-lg max-w-sm transition-all duration-300 hover:scale-[1.05] font-medium italic">{fr}</div>
              ))}
            </div>
            <div className="mt-10">
              <h3 className="text-xl font-medium text-gray-800 mb-4">🎧 Canciones para acompañarte</h3>
              <div className="flex flex-wrap justify-center gap-4 px-4">
                {canciones.map(c=>(
                  <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" className="bg-white px-5 py-2 rounded-full text-pink-600 shadow-lg hover:bg-pink-200 transition-all font-bold hover:scale-[1.05]">{c.nombre}</a>
                ))}
              </div>
            </div>
          </section>
        </section>

        {/* Opiniones al final */}
        <div className="p-8 bg-white rounded-3xl shadow-xl">
          <h2 className="text-3xl font-extrabold text-pink-700 mb-6 border-b pb-3">💬 Opiniones de Clientes ({reviews.length})</h2>
          <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-pink-50 rounded-xl border border-pink-100 flex flex-col space-y-3">
            <textarea value={review} onChange={e=>setReview(e.target.value)} placeholder="Comparte tu experiencia..." className="border-2 border-pink-300 rounded-lg p-3 focus:ring-4 focus:ring-pink-400 resize-none outline-none" rows="3"/>
            <button type="submit" className="self-start px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition shadow-md">Enviar</button>
          </form>
          <div className="space-y-4">
            {reviews.length>0?reviews.map(r=>(
              <div key={r.id} className="bg-gray-50 p-4 rounded-xl shadow-sm border-l-4 border-pink-400">
                <p className="text-gray-800 italic mb-2">"{r.texto}"</p>
                <p className="text-xs text-gray-500 font-semibold mt-2 text-right">Compradora anónima - {r.fecha}</p>
              </div>
            )):<p className="text-gray-500 italic text-center py-5">Sé la primera en dejar una reseña.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
