import { useState } from "react";

export default function Sidebar({ categorias, onFilter }) {
  const [filtros, setFiltros] = useState({
    categoria: "",
    precioMin: "",
    precioMax: "",
    nombre: "",
    orden: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevosFiltros = { ...filtros, [name]: value };
    setFiltros(nuevosFiltros);
    onFilter(nuevosFiltros);
  };

  return (
    <aside className="w-64 bg-white p-4 shadow rounded-2xl">
      <h2 className="text-lg font-bold mb-2 text-pink-600">Filtrar productos</h2>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold">Categoría</label>
          <select name="categoria" className="w-full border p-2 rounded" onChange={handleChange}>
            <option value="">Todas</option>
            {categorias.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold">Rango de precio</label>
          <div className="flex gap-2">
            <input name="precioMin" type="number" placeholder="Mín" className="w-1/2 border p-2 rounded" onChange={handleChange}/>
            <input name="precioMax" type="number" placeholder="Máx" className="w-1/2 border p-2 rounded" onChange={handleChange}/>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold">Buscar por nombre</label>
          <input name="nombre" type="text" placeholder="Buscar..." className="w-full border p-2 rounded" onChange={handleChange}/>
        </div>

        <div>
          <label className="block text-sm font-semibold">Ordenar por</label>
          <select name="orden" className="w-full border p-2 rounded" onChange={handleChange}>
            <option value="">Sin orden</option>
            <option value="asc">Precio: menor a mayor</option>
            <option value="desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
