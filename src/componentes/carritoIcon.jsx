import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCarrito } from "../context/CarritoContext";

export default function CarritoIcon() {
  const { carrito } = useCarrito();
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <Link to="/carrito" className="relative">
      <ShoppingCart className="text-pink-500 w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
