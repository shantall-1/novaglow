import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";

const EditarDatosModal = ({ isOpen, onClose }) => {
  const { usuario, updateEmail, updateDireccion, updateMetodoPago } = useAuth();

  const [nuevoCorreo, setNuevoCorreo] = useState(usuario?.email || "");
  const [nuevaDireccion, setNuevaDireccion] = useState(usuario?.direccion || "");
  const [nuevoMetodoPago, setNuevoMetodoPago] = useState(usuario?.metodoPago || "");
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  if (!usuario) return null;

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
    myConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => canvas.remove(), 1500);
  };

  const validarCorreo = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const guardarDatos = async () => {
    setMensaje(null);

    // Validaciones
    if (!validarCorreo(nuevoCorreo)) {
      setMensaje("⚠️ El correo no es válido.");
      return;
    }
    if (!nuevaDireccion.trim()) {
      setMensaje("⚠️ La dirección no puede estar vacía.");
      return;
    }
    if (!nuevoMetodoPago.trim()) {
      setMensaje("⚠️ El método de pago no puede estar vacío.");
      return;
    }

    setSubiendo(true);
    try {
      if (nuevoCorreo !== usuario.email) await updateEmail(nuevoCorreo);
      if (nuevaDireccion !== usuario.direccion) await updateDireccion(nuevaDireccion);
      if (nuevoMetodoPago !== usuario.metodoPago) await updateMetodoPago(nuevoMetodoPago);

      dispararConfeti();
      setMensaje("✅ Datos actualizados correctamente!");
      setTimeout(() => {
        setMensaje(null);
        onClose();
      }, 1500);
    } catch (err) {
      setMensaje("❌ Error al actualizar datos: " + err.message);
    }
    setSubiendo(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-6 w-96 relative border-4 border-pink-200"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-pink-600"
              onClick={onClose}
            >
              <X size={22} />
            </button>

            <h2 className="text-3xl font-extrabold text-pink-600 mb-6 text-center">
              Editar Datos
            </h2>

            <div className="flex justify-center mb-4">
              <img
                src={usuario.foto || usuario.photoURL || "/user-default.png"}
                alt="Perfil"
                className="w-24 h-24 rounded-full border-4 border-pink-400 object-cover"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Correo</label>
                <input
                  type="email"
                  value={nuevoCorreo}
                  onChange={(e) => setNuevoCorreo(e.target.value)}
                  className="w-full border px-3 py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Dirección</label>
                <input
                  type="text"
                  value={nuevaDireccion}
                  onChange={(e) => setNuevaDireccion(e.target.value)}
                  className="w-full border px-3 py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Método de Pago</label>
                <input
                  type="text"
                  value={nuevoMetodoPago}
                  onChange={(e) => setNuevoMetodoPago(e.target.value)}
                  className="w-full border px-3 py-2 rounded-xl"
                  placeholder="Ej: Tarjeta ****1234"
                />
              </div>

              {mensaje && (
                <p className="text-center text-sm mt-1">{mensaje}</p>
              )}

              <button
                onClick={guardarDatos}
                disabled={subiendo}
                className="bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600 mt-2"
              >
                {subiendo ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditarDatosModal;

