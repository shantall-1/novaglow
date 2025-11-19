import { useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BlogDropdownMobile({ closeMenu }) {
  const [open, setOpen] = useState(false);
  const { usuario: user } = useAuth();


  const allowedEmails = ["fundadora@novaglow.com", "hylromeroduran@crackthecode.la"];

  return (
    <li className="flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-gray-700 font-medium hover:text-pink-500 transition"
      >
        <span>Nosotros</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-2 ml-3 flex flex-col gap-2">
          <Link
            to="/inspiracion"
            onClick={closeMenu}
            className="text-gray-700 hover:text-pink-600 transition"
          >
            💫 Ver Blog & Galería
          </Link>

          {user && allowedEmails.includes(user.email) && (
            <Link
              to="/adminblog"
              onClick={closeMenu}
              className="flex items-center gap-1 text-gray-700 hover:text-pink-600 transition"
            >
              <Lock className="w-4 h-4" /> Panel de Administración
            </Link>
          )}
        </div>
      )}
    </li>
  );
}
