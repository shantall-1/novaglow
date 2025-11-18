import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";

const PerfilModal = ({ isOpen, onClose }) => {
  const { usuario, subirFotoPerfil, updateUserProfile } = useAuth();

  const [preview, setPreview] = useState(null);
  const [nuevaFoto, setNuevaFoto] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState(usuario?.displayName || "");
  const [subiendo, setSubiendo] = useState(false);

  if (!usuario) return null;

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNuevaFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  // -----------------------------------------------------
  // 🎉 CONFETTI FIX — SIEMPRE ENCIMA DEL MODAL
  // -----------------------------------------------------
  const dispararConfeti = () => {
    const canvas = document.createElement("canvas");
    canvas.id = "perfil-confetti";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999"; // 🔥 MÁS ALTO QUE EL MODAL
    document.body.appendChild(canvas);

    const myConfetti = confetti.create(canvas, { resize: true });

    myConfetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      canvas.remove();
    }, 1500);
  };
  // -----------------------------------------------------

  const guardarNuevaFoto = async () => {
    if (!nuevaFoto) return;
    setSubiendo(true);
    try {
      const url = await subirFotoPerfil(nuevaFoto);
      await updateUserProfile({ nombre: nuevoNombre, foto: url });
      setPreview(null);
      setNuevaFoto(null);
      dispararConfeti();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar foto");
    }
    setSubiendo(false);
  };

  const guardarNombre = async () => {
    setSubiendo(true);
    try {
      await updateUserProfile({ nombre: nuevoNombre, foto: usuario.foto });
      dispararConfeti();
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el nombre");
    }
    setSubiendo(false);
  };

  const eliminarFoto = async () => {
    if (!confirm("¿Seguro que quieres eliminar tu foto?")) return;
    setSubiendo(true);
    try {
      await updateUserProfile({ nombre: nuevoNombre, foto: null });
      setPreview(null);
      setNuevaFoto(null);
    } catch (err) {
      console.error(err);
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
              className="absolute right-4 top-4 text-gray-500 hover:text-pink-600 transition-colors"
              onClick={onClose}
            >
              <X size={22} />
            </button>

            <h2 className="text-3xl font-extrabold text-pink-600 mb-6 text-center drop-shadow-lg">
              Mi Perfil
            </h2>

            <div className="flex flex-col items-center">
              {fotoVisible ? (
                <div className="relative">
                  <img
                    src={fotoVisible}
                    alt="perfil"
                    className="w-28 h-28 rounded-full border-4 border-pink-400 shadow-xl object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-2 cursor-pointer hover:bg-pink-600 transition-colors">
                    <Camera size={18} className="text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-28 h-28 rounded-full bg-pink-300 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {nuevoNombre?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <div className="mt-4 w-full text-center">
                <label className="text-gray-700 font-semibold mb-1 block">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="block mx-auto border px-3 py-2 rounded-xl w-3/4 text-center shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  onClick={guardarNombre}
                  className="mt-3 bg-pink-500 text-white px-5 py-2 rounded-xl hover:bg-pink-600 transition-transform hover:scale-105 disabled:opacity-50 shadow-md"
                  disabled={subiendo}
                >
                  Guardar nombre
                </button>
              </div>

              <p className="text-gray-700 mt-3">
                <strong>Email:</strong> {usuario.email}
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="mt-3"
              />

              {preview && (
                <div className="mt-4 flex flex-col items-center">
                  <p className="text-pink-600 font-semibold mb-2">Vista previa</p>
                  <img
                    src={preview}
                    className="w-28 h-28 rounded-full object-cover border-4 border-pink-400 shadow-lg transition-transform hover:scale-105"
                    alt="preview"
                  />
                  <button
                    onClick={guardarNuevaFoto}
                    disabled={subiendo}
                    className="mt-3 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-5 rounded-xl transition-transform hover:scale-105 disabled:opacity-50 shadow-md"
                  >
                    {subiendo ? "Guardando..." : "Guardar foto"}
                  </button>
                </div>
              )}

              {(usuario.foto || usuario.photoURL) && !preview && (
                <button
                  onClick={eliminarFoto}
                  disabled={subiendo}
                  className="mt-3 text-red-500 font-semibold hover:underline disabled:opacity-50"
                >
                  Eliminar foto
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PerfilModal;
