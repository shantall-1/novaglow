import { useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Carrito() {
  const { carrito, eliminarDelCarrito, actualizarCantidad, total, vaciarCarrito } = useCarrito();
  const { usuario, guardarDatosPedido } = useAuth();
  const navigate = useNavigate();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    direccion: "",
    metodoPago: "",
    numeroTarjeta: "",
    numeroTelefono: "",
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const manejarPago = async (e) => {
    e.preventDefault();
    if (!usuario) return;

    try {
      console.log("DEBUG - FORM DATA:", formData);

      await guardarDatosPedido({
        nombre: formData.nombre,
        email: formData.email,
        direccion: formData.direccion,
        metodoPago: formData.metodoPago,
        numeroTarjeta: formData.metodoPago === "Tarjeta" ? formData.numeroTarjeta : null,
        numeroTelefono: formData.metodoPago === "Yape" ? formData.numeroTelefono : null,
        productos: carrito,
        total,
      });

      // Limpia el carrito después del pago exitoso
      vaciarCarrito();
      navigate("/perfil");

    } catch (error) {
      console.log(error);
    }
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
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-pink-600"
          >
            Pagar
          </button>
        )}
      </div>

      {/* FORMULARIO DE PAGO */}
      {mostrarFormulario && (
        <form
          onSubmit={manejarPago}
          className="mt-6 bg-white p-6 rounded-xl shadow space-y-4 max-w-md mx-auto"
        >
          <h3 className="text-xl font-bold text-pink-600 mb-2">Método de pago 💳</h3>

          {/* SELECCIONADOR DE MÉTODO */}
          <select
  name="metodoPago"
  value={formData.metodoPago}
  onChange={manejarCambio}
  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white appearance-none"
  required
>
  <option value="">Seleccionar método</option>
  <option value="Tarjeta">Tarjeta</option>
  <option value="Efectivo">Efectivo</option>
  <option value="Yape">Yape</option>
</select>


          {/* CAMPOS SOLO SI TARJETA */}
          {formData.metodoPago === "Tarjeta" && (
            <input
              type="text"
              name="numeroTarjeta"
              placeholder="Número de tarjeta"
              value={formData.numeroTarjeta}
              onChange={manejarCambio}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          )}

          {/* CAMPOS SOLO SI YAPE */}
          {formData.metodoPago === "Yape" && (
            <div className="space-y-3">
              <input
                type="text"
                name="numeroTelefono"
                placeholder="Número de teléfono"
                value={formData.numeroTelefono}
                onChange={manejarCambio}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <div className="text-center">
                <p className="font-semibold text-gray-700 mb-2">Escanea el QR para pagar:</p>
                <img
                  src="/qr-yape.jpeg"
                  alt="QR Yape"
                  className="w-40 h-40 mx-auto rounded-lg shadow"
                />
              </div>
            </div>
          )}

          {/* MENSAJE SOLO SI EFECTIVO */}
          {formData.metodoPago === "Efectivo" && (
            <p className="text-center text-gray-700 font-medium">
              Pagarás al recibir tu pedido 💵
            </p>
          )}

          {/* CAMPOS GENERALES */}
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
