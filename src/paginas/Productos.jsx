import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../componentes/Sidebar";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FaSearch } from "react-icons/fa";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Modal para agregar producto
  const [modalAgregar, setModalAgregar] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  // CARGAR PRODUCTOS DESDE FIREBASE
  const cargarProductos = async () => {
    const snapshot = await getDocs(collection(db, "productos"));
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProductos(lista);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // FILTRAR PRODUCTOS
  const filtrarProductos = (filtros = {}) => {
    let filtrados = [...productos];

    if (filtros.categoria)
      filtrados = filtrados.filter((p) => p.category === filtros.categoria);
    if (filtros.precioMin)
      filtrados = filtrados.filter(
        (p) => p.price >= parseFloat(filtros.precioMin)
      );
    if (filtros.precioMax)
      filtrados = filtrados.filter(
        (p) => p.price <= parseFloat(filtros.precioMax)
      );
    if (filtros.nombre)
      filtrados = filtrados.filter((p) =>
        p.name.toLowerCase().includes(filtros.nombre.toLowerCase())
      );

    if (filtros.orden === "asc")
      filtrados.sort((a, b) => a.price - b.price);
    else if (filtros.orden === "desc")
      filtrados.sort((a, b) => b.price - a.price);

    setProductos(filtrados);
  };

  // AGREGAR NUEVO PRODUCTO A FIREBASE
  const agregarProductoFirebase = async () => {
    if (
      !nuevoProducto.name ||
      !nuevoProducto.description ||
      !nuevoProducto.category ||
      !nuevoProducto.image
    ) {
      alert("Completa todos los campos (el precio es opcional 😊)");
      return;
    }

    try {
      await addDoc(collection(db, "productos"), {
        ...nuevoProducto,
        price: nuevoProducto.price ? parseFloat(nuevoProducto.price) : null,
        discount: 0,
      });

      alert("Producto agregado con éxito 🎉");
      setModalAgregar(false);
      setNuevoProducto({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });

      cargarProductos();
    } catch (error) {
      console.error("Error agregando producto:", error);
    }
  };

  return (
    <div className="flex p-6 gap-6 relative bg-pink-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar
        categorias={["Ropa", "Maquillaje", "Accesorios"]}
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
              <Link to={`/producto/${p.id}`}>
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                />
              </Link>

              <button
                onClick={() => setProductoSeleccionado(p)}
                className="absolute top-3 right-3 bg-white/80 p-3 rounded-full hover:bg-pink-200 transition"
              >
                <FaSearch className="text-pink-600 text-xl" />
              </button>
            </div>

            <h3 className="font-bold text-lg mt-4">{p.name}</h3>
            <p className="text-gray-600 text-sm mt-1 flex-1">
              {p.description}
            </p>

            <p className="text-pink-600 font-semibold mt-3">
              {p.price ? `S/${p.price.toFixed(2)}` : "Precio no disponible"}
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

      {/* Modal producto seleccionado */}
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
              <Link
                to={`/producto/${productoSeleccionado.id}`}
                onClick={() => setProductoSeleccionado(null)}
              >
                <img
                  src={productoSeleccionado.image}
                  alt={productoSeleccionado.name}
                  className="rounded-2xl w-full lg:w-1/2 max-h-[600px] object-cover"
                />
              </Link>

              <div className="flex flex-col justify-between lg:w-1/2">
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    {productoSeleccionado.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {productoSeleccionado.description}
                  </p>
                </div>

                <div>
                  <p className="text-pink-600 font-semibold text-xl mb-4">
                    {productoSeleccionado.price
                      ? `S/${productoSeleccionado.price.toFixed(2)}`
                      : "Precio no disponible"}
                  </p>
                  <Link
                    to={`/producto/${productoSeleccionado.id}`}
                    onClick={() => setProductoSeleccionado(null)}
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

      {/* Botón para abrir modal agregar */}
      <button
        onClick={() => setModalAgregar(true)}
        className="fixed bottom-6 right-6 bg-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-700 transition font-bold z-50"
      >
        + Agregar producto
      </button>

      {/* Modal agregar producto */}
      {modalAgregar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-lg relative shadow-xl">
            <button
              onClick={() => setModalAgregar(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-3xl"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4">Agregar nuevo producto</h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nombre"
                className="border p-2 rounded-xl"
                value={nuevoProducto.name}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, name: e.target.value })
                }
              />

              <textarea
                placeholder="Descripción"
                className="border p-2 rounded-xl"
                value={nuevoProducto.description}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    description: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Precio (opcional)"
                className="border p-2 rounded-xl"
                value={nuevoProducto.price}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, price: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Categoría"
                className="border p-2 rounded-xl"
                value={nuevoProducto.category}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    category: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="URL de la imagen"
                className="border p-2 rounded-xl"
                value={nuevoProducto.image}
                onChange={(e) =>
                  setNuevoProducto({ ...nuevoProducto, image: e.target.value })
                }
              />

              <button
                onClick={agregarProductoFirebase}
                className="bg-pink-600 text-white py-2 rounded-xl font-bold hover:bg-pink-700 transition"
              >
                Guardar producto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
