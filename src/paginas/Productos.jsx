
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../componentes/Sidebar";
import { productosData } from "../assets/productosData";
import { FaSearch } from "react-icons/fa"; // ✅ Ícono

export default function Productos() {
  const [productos, setProductos] = useState(productosData);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null); // 👈 producto actual

  const filtrarProductos = (filtros = {}) => {
    let filtrados = [...productosData];

    if (filtros.categoria)
      filtrados = filtrados.filter(p => p.category === filtros.categoria);

    if (filtros.precioMin)
      filtrados = filtrados.filter(p => p.price >= parseFloat(filtros.precioMin));

    if (filtros.precioMax)
      filtrados = filtrados.filter(p => p.price <= parseFloat(filtros.precioMax));

    if (filtros.nombre)
      filtrados = filtrados.filter(p =>
        p.name.toLowerCase().includes(filtros.nombre.toLowerCase())
      );

    if (filtros.orden === "asc") filtrados.sort((a, b) => a.price - b.price);
    else if (filtros.orden === "desc") filtrados.sort((a, b) => b.price - a.price);

    setProductos(filtrados);
  };

  return (
    <div className="flex p-6 gap-6 relative">
      <Sidebar
        categorias={[...new Set(productosData.map(p => p.category))]}
        onFilter={filtrarProductos}
      />

      {/* LISTA DE PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {productos.map(p => (
          <div
            key={p.id}
            className="bg-white p-4 shadow rounded-2xl flex flex-col relative hover:shadow-lg transition-all"
          >
            <img
              src={p.image}
              alt={p.name}
              className="rounded-xl mb-2 object-cover h-56 w-full"
            />

            {/* Ícono de búsqueda sobre la imagen */}
            <button
              onClick={() => setProductoSeleccionado(p)}
              className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:bg-pink-200 transition"
            >
              <FaSearch className="text-pink-600 text-lg" />
            </button>

            <h3 className="font-bold text-lg mt-2">{p.name}</h3>
            <p className="text-gray-600 text-sm flex-1">{p.description1 || p.description}</p>
            <p className="text-pink-600 font-semibold mt-2">
              ${p.price.toFixed(2)}{" "}
              {p.discount && (
                <span className="text-gray-400 text-sm line-through ml-2">
                  ${(p.price / (1 - p.discount / 100)).toFixed(2)}
                </span>
              )}
            </p>
            <div className="flex gap-2 mt-4">
              <Link
                to={`/producto/${p.id}`}
                className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
              >
                Ver detalles
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE PRODUCTO */}
      {productoSeleccionado && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-lg">
            <button
              onClick={() => setProductoSeleccionado(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              ✖
            </button>

            <img
              src={}
              alt={productoSeleccionado.name}
              className="rounded-xl mb-4 w-full h-64 object-cover"
            />
            <h2 className="text-2xl font-bold mb-2">{productoSeleccionado.name}</h2>
            <p className="text-gray-600 mb-2">{productoSeleccionado.description}</p>
            <p className="text-pink-600 font-semibold mb-4">
              ${productoSeleccionado.price.toFixed(2)}
            </p>
            <Link
              to={`/producto/${productoSeleccionado.id}`}
              className="block text-center bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600 transition"
            >
              Ver producto completo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

