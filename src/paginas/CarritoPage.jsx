import { Link, useNavigate } from "react-router-dom";
import { productosData } from "../assets/productosData";

export default function CarritoPage() {
  const navigate = useNavigate();

  // 🛒 Usa la data real importada
  const carrito = productosData.map((producto) => ({
    id: producto.id,
    nombre: producto.name,
    cantidad: 1, // puedes cambiar luego según el contexto del carrito real
    precio: producto.price,
    imagen: producto.image,
  }));

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-pink-600">🛍️ Tu carrito</h2>

      {carrito.length === 0 ? (
        <p className="text-gray-600">No tienes productos en tu carrito.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {carrito.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-16 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">{item.nombre}</p>
                    <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                  </div>
                </div>
                <span className="font-semibold text-pink-600">
                  ${item.precio.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate("/confirmacion")}
            className="mt-6 w-full bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600"
          >
            Pagar ahora
          </button>
        </>
      )}

      <Link
        to="/"
        className="block mt-6 text-pink-500 hover:underline text-center"
      >
        ⬅️ Seguir comprando
      </Link>
    </div>
  );
}
