import { Link } from "react-router-dom";

export default function Confirmacion() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h2 className="text-3xl font-bold text-pink-600 mb-4">¡Pago exitoso! 💖</h2>
      <p className="text-gray-600 mb-6">Gracias por tu compra. Tu pedido está en proceso.</p>
      <Link
        to="/"
        className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
