import { useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import { Link, useNavigate } from "react-router-dom";

export default function Carrito() {
  const { carrito, eliminarDelCarrito, actualizarCantidad, total, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    tarjeta: "",
    direccion: "",
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const manejarPago = (e) => {
    e.preventDefault();
    vaciarCarrito();
    navigate("/confirmacion");
  };

  if (carrito.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío 🛒</h2>
        <Link to="/" className="text-pink-500 underline">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Tu carrito de compras</h2>

      {/* LISTA DE PRODUCTOS */}
      <div className="space-y-4">
        {carrito.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-24 rounded-lg object-cover" />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                <p className="text-sm text-gray-400">{item.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{item.cantidad}</span>
              <button
                onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-4">
              <p className="font-semibold text-pink-600">
                ${(item.price * item.cantidad).toFixed(2)}
              </p>
              <button
                onClick={() => eliminarDelCarrito(item.id)}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL Y BOTÓN PAGAR */}
      <div className="mt-6 text-right">
        <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
        {!mostrarFormulario ? (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-pink-600"
          >
            Pagar
          </button>
        ) : null}
      </div>

      {/* FORMULARIO DE PAGO */}
      {mostrarFormulario && (
        <form
          onSubmit={manejarPago}
          className="mt-6 bg-white p-6 rounded-xl shadow space-y-4 max-w-md mx-auto"
        >
          <h3 className="text-xl font-bold text-pink-600 mb-2">Datos de pago 💳</h3>

          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={manejarCambio}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={manejarCambio}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          <input
            type="text"
            name="tarjeta"
            placeholder="Número de tarjeta"
            value={formData.tarjeta}
            onChange={manejarCambio}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          <input
            type="text"
            name="direccion"
            placeholder="Dirección de envío"
            value={formData.direccion}
            onChange={manejarCambio}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600"
          >
            Confirmar pago
          </button>
        </form>
      )}
    </div>
  );
}
