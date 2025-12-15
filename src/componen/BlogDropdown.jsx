import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BlogDropdown() {
  const [open, setOpen] = useState(false);
  const { usuario: user } = useAuth();

  const allowedEmails = [
    "fundadora@novaglow.com",
    "hylromeroduran@crackthecode.la",
    "editor@novaglow.com"
  ];

  const closeMenu = () => setOpen(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {/* Botón principal */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-gray-700 font-semibold hover:text-pink-500 transition text-md"
      >
        <Link to="/nosotros" onClick={(e) => e.stopPropagation()} className="hover:text-pink-500 transition">
          Nosotros
        </Link>
        <ChevronDown className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Menú con animación */}
      <div
        className={`absolute right-0 mt-3 bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl border border-pink-200/40 w-60 z-50 overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Link
          to="/inspiracion"
          onClick={closeMenu}
          className="block px-4 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50/80 transition rounded-xl"
        >
          Ver Blog & Galería
        </Link>

        {user && allowedEmails.includes(user.email) && (
          <Link
            to="/adminblog"
            onClick={closeMenu}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50/80 transition rounded-xl"
          >
            Panel de Administración
          </Link>
        )}
      </div>
    </div>
  );
}
