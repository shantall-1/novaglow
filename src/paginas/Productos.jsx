import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../componentes/Sidebar";
import { productosData } from "../assets/productosData";

export default function Productos() {
  const [productos, setProductos] = useState(productosData);

  const filtrarProductos = (filtros) => {
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

    if (filtros.orden === "asc")
      filtrados.sort((a, b) => a.price - b.price);
    else if (filtros.orden === "desc")
      filtrados.sort((a, b) => b.price - a.price);

    setProductos(filtrados);
  };

  return (
    <div className="flex p-6 gap-6">
      <Sidebar
        categorias={[...new Set(productosData.map(p => p.category))]}
        onFilter={filtrarProductos}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {productos.map(p => (
          <div key={p.id} className="bg-white p-4 shadow rounded-2xl flex flex-col">
            <img src={p.image} alt={p.name} className="rounded-xl mb-2" />
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p className="text-gray-600 text-sm flex-1">{p.description1}</p>
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
    </div>
  );
}
