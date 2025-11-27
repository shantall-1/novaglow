
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";

const PerfilModal = ({ isOpen, onClose }) => {
  const { usuario, updateUserProfile, logout } = useAuth();

  const [preview, setPreview] = useState(null);
  const [nuevaFotoURL, setNuevaFotoURL] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState(usuario?.displayName || "");
  const [subiendo, setSubiendo] = useState(false);

  if (!usuario) return null;

  // 🎉 CONFETTI
  const dispararConfeti = () => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";

    document.body.appendChild(canvas);

    const myConfetti = confetti.create(canvas, { resize: true });
    myConfetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => canvas.remove(), 1500);
  };

  // 📸 GUARDAR NUEVA FOTO
  const guardarNuevaFoto = async () => {
    if (!nuevaFotoURL.trim()) {
      alert("Pega una URL de imagen válida");
      return;
    }

    setSubiendo(true);
    try {
      await updateUserProfile({
        nombre: nuevoNombre,
        foto: nuevaFotoURL,
      });

      setPreview(null);
      setNuevaFotoURL("");
      dispararConfeti();
      onClose();
    } catch (error) {
      alert("Error al actualizar foto");
    }
    setSubiendo(false);
  };

  // 📝 GUARDAR NUEVO NOMBRE
  const guardarNombre = async () => {
    setSubiendo(true);
    try {
      await updateUserProfile({
        nombre: nuevoNombre,
        foto: usuario.foto || usuario.photoURL || null,
      });
      dispararConfeti();
      onClose();
    } catch (error) {
      alert("No se pudo actualizar el nombre");
    }
    setSubiendo(false);
  };

  // ❌ ELIMINAR FOTO
  const eliminarFoto = async () => {
    if (!confirm("¿Seguro que quieres eliminar tu foto?")) return;

    setSubiendo(true);
    try {
      await updateUserProfile({
        nombre: nuevoNombre,
        foto: null,
      });
      onClose();
    } catch (err) {
      alert("No se pudo eliminar la foto");
    }
    setSubiendo(false);
  };

  const fotoVisible = preview || usuario.foto || usuario.photoURL;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-999"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-linear-to-br from-[#fdf2f8] via-[#fce7f3] to-[#fbcfe8] rounded-3xl shadow-2xl p-6 w-96 relative border-4 border-[#f9a8d4]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-pink-600"
              onClick={onClose}
            >
              <X size={22} />
            </button>

            <h2 className="text-3xl font-extrabold text-pink-600 mb-6 text-center">
              Mi Perfil
            </h2>

            <div className="flex flex-col items-center">

              {/* FOTO */}
              {fotoVisible ? (
                <div className="relative">
                  <img
                    src={fotoVisible}
                    className="w-28 h-28 rounded-full border-4 border-pink-400 shadow-xl object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-2">
                    <Camera className="text-white" size={18} />
                  </div>
                </div>
              ) : (
                <div className="w-28 h-28 rounded-full bg-pink-300 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {nuevoNombre.charAt(0).toUpperCase()}
                </div>
              )}

              {/* NOMBRE */}
              <div className="mt-4 w-full text-center">
                <label className="text-gray-700 font-semibold mb-1 block">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="block mx-auto border px-3 py-2 rounded-xl w-3/4 text-center shadow-md"
                />
                <button
                  onClick={guardarNombre}
                  className="mt-3 bg-pink-500 text-white px-5 py-2 rounded-xl hover:bg-pink-600 shadow-md"
                  disabled={subiendo}
                >
                  Guardar nombre
                </button>
              </div>

              {/* EMAIL */}
              <p className="text-gray-700 mt-3">
                <strong>Email:</strong> {usuario.email}
              </p>

              {/* CAMBIO DE FOTO */}
              <input
                type="text"
                placeholder="Pega aquí una URL de imagen"
                value={nuevaFotoURL}
                onChange={(e) => {
                  setNuevaFotoURL(e.target.value);
                  setPreview(e.target.value || null);
                }}
                className="mt-4 border p-2 rounded-xl w-3/4 text-center shadow-md"
              />

              {preview && (
                <div className="mt-4 flex flex-col items-center">
                  <p className="text-pink-600 font-semibold mb-2">
                    Vista previa
                  </p>
                  <img
                    src={preview}
                    className="w-28 h-28 rounded-full border-4 border-pink-400 object-cover"
                  />

                  <button
                    onClick={guardarNuevaFoto}
                    disabled={subiendo}
                    className="mt-3 bg-pink-500 text-white px-5 py-2 rounded-xl hover:bg-pink-600 shadow-md"
                  >
                    Guardar foto
                  </button>
                </div>
              )}

              {(usuario.foto || usuario.photoURL) && !preview && (
                <button
                  onClick={eliminarFoto}
                  className="mt-3 text-red-500 hover:underline"
                >
                  Eliminar foto
                </button>
              )}

              {/* CERRAR SESIÓN */}
              <button
                onClick={logout}
                className="mt-6 text-red-600 font-bold hover:underline"
              >
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PerfilModal;


