import { useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BlogDropdown() {
  const [open, setOpen] = useState(false);
  const { usuario: user } = useAuth();


  // ✉️ Correos con permisos de edición
  const allowedEmails = ["fundadora@novaglow.com", "hylromeroduran@crackthecode.la","editor@novaglow.com"];

  return (
    <div className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-gray-700 font-semibold hover:text-pink-500 transition text-md"
      >
        <Link
          to="/nosotros"
          onClick={(e) => e.stopPropagation()} // Evita que el link cierre/abra el menú
          className="hover:text-pink-500 transition"
        >
          Nosotros
        </Link>
        <ChevronDown
          className={`w-5 h-5 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menú desplegable */}
      {open && (
        <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-xl border border-gray-100 py-3 w-56 z-50 animate-fadeIn">
          <Link
            to="/inspiracion"
            className="block px-4 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition"
          >
            💫 Ver Blog & Galería
          </Link>

          {user && allowedEmails.includes(user.email) && (
            <Link
              to="/adminblog"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition"
            >
              <Lock className="w-4 h-4" /> Panel de Administración
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
