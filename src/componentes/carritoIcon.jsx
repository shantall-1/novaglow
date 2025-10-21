import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCarrito } from "../context/CarritoContext";

export default function CarritoIcon({ setPage }) {
  // --- 2. ICONO DEL CARRITO (carritoIcon.jsx) ---
function CarritoIcon({ setPage }) {
  const { carrito } = useCarrito();
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <button onClick={() => setPage('carrito')} className="relative p-2 rounded-full hover:bg-pink-100 transition">
      <ShoppingCart className="text-pink-600 w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
          {totalItems}
        </span>
      )}
    </button>
  );
}
 }
