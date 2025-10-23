import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../componentes/Sidebar";
import { productosData } from "../assets/productosData"; 
import { FaSearch } from "react-icons/fa";

export default function Productos() {
  const [productos, setProductos] = useState(productosData);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const filtrarProductos = (filtros = {}) => {
    let filtrados = [...productosData];

    if (filtros.categoria) 
      filtrados = filtrados.filter((p) => p.category === filtros.categoria);
    if (filtros.precioMin) 
      filtrados = filtrados.filter((p) => p.price >= parseFloat(filtros.precioMin));
    if (filtros.precioMax) 
      filtrados = filtrados.filter((p) => p.price <= parseFloat(filtros.precioMax));
    if (filtros.nombre) 
      filtrados = filtrados.filter((p) => p.name.toLowerCase().includes(filtros.nombre.toLowerCase()));

    if (filtros.orden === "asc") filtrados.sort((a, b) => a.price - b.price);
    else if (filtros.orden === "desc") filtrados.sort((a, b) => b.price - a.price);

    setProductos(filtrados);
  };

  return (
    <div className="flex p-6 gap-6 relative bg-pink-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar 
        categorias={[...new Set(productosData.map((p) => p.category || "Ropa"))]} 
        onFilter={filtrarProductos} 
        className="bg-white rounded-3xl p-6 shadow-lg w-64"
      />

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
        {productos.map((p) => (
          <div 
            key={p.id} 
            className="bg-white p-4 rounded-3xl shadow-md hover:shadow-xl transition-all relative flex flex-col"
          >
            <div className="overflow-hidden rounded-2xl relative">
              <img 
                src={p.image} 
                alt={p.name} 
                className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
              />
              <button 
                onClick={() => setProductoSeleccionado(p)} 
                className="absolute top-3 right-3 bg-white/80 p-3 rounded-full hover:bg-pink-200 transition"
              >
                <FaSearch className="text-pink-600 text-xl" />
              </button>
            </div>

            <h3 className="font-bold text-lg mt-4">{p.name}</h3>
            <p className="text-gray-600 text-sm mt-1 flex-1">{p.description}</p>

            <p className="text-pink-600 font-semibold mt-3">
              ${p.price.toFixed(2)}
              {p.discount > 0 && (
                <span className="text-gray-400 text-sm line-through ml-2">
                  ${(p.price / (1 - p.discount / 100)).toFixed(2)}
                </span>
              )}
            </p>

            <div className="flex gap-2 mt-4">
              <Link 
                to={`/producto/${p.id}`} 
                className="flex-1 text-center bg-pink-500 text-white py-2 rounded-2xl font-semibold hover:bg-pink-600 transition"
              >
                Ver detalles
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de producto rápido */}
      {productoSeleccionado && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full relative shadow-xl">
            <button 
              onClick={() => setProductoSeleccionado(null)} 
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-3xl"
            >
              ✖
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Imagen más grande */}
              <img 
                src={productoSeleccionado.image} 
                alt={productoSeleccionado.name} 
                className="rounded-2xl w-full lg:w-1/2 h-auto max-h-[600px] object-cover transition-transform hover:scale-105"
              />

              <div className="flex flex-col justify-between lg:w-1/2">
                <div>
                  <h2 className="text-3xl font-bold mb-4">{productoSeleccionado.name}</h2>
                  <p className="text-gray-600 mb-4">{productoSeleccionado.description}</p>
                </div>

                <div>
                  <p className="text-pink-600 font-semibold text-xl mb-4">
                    ${productoSeleccionado.price.toFixed(2)}
                  </p>
                  <Link 
                    to={`/producto/${productoSeleccionado.id}`} 
                    className="block text-center bg-pink-500 text-white py-3 rounded-2xl hover:bg-pink-600 transition font-semibold"
                  >
                    Ver producto completo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );  
}
