import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PerfilModal from "../componentes/PerfilModal"; // IMPORT CORRECTO
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [editando, setEditando] = useState(false);

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-pink-600 text-xl font-semibold">
          Debes iniciar sesión para ver tu perfil ✨
        </p>
      </div>
    );
  }

  const foto = usuario.foto || usuario.photoURL || null;
  const nombre = usuario.displayName || "Usuario";

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-pink-200"
      >
        <div className="flex flex-col items-center">
          {foto ? (
            <img
              src={foto}
              alt="Foto Perfil"
              className="w-32 h-32 rounded-full border-4 border-pink-300 shadow-md object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-pink-300 flex items-center justify-center text-white text-4xl font-bold shadow-md">
              {nombre.charAt(0).toUpperCase()}
            </div>
          )}

          <h2 className="text-3xl font-bold text-pink-600 mt-4">{nombre}</h2>
          <p className="text-gray-600">{usuario.email}</p>

          <div className="mt-6 flex flex-col w-full gap-3">
            <button
              onClick={() => setEditando(true)}
              className="bg-pink-500 text-white py-2 rounded-xl font-semibold shadow hover:bg-pink-600"
            >
              Editar Perfil
            </button>

            <button
              onClick={() => navigate("/pedidos")}
              className="bg-white border border-pink-300 py-2 rounded-xl font-semibold text-pink-600 hover:bg-pink-50"
            >
              Mis Pedidos
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editando && (
          <PerfilModal
            isOpen={editando}
            onClose={() => setEditando(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
