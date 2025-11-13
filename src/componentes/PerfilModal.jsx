import { motion, AnimatePresence } from "framer-motion";
import { X, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const PerfilModal = ({ isOpen, onClose }) => {
  const { user, setUser, updateUserProfile } = useAuth(); // ✅ hook actualizado
  const [nombre, setNombre] = useState(user?.nombre || "");
  const [foto, setFoto] = useState(user?.foto || "");
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState("exito");

  if (!user) return null;

  // 📸 Subir nueva foto a Firebase Storage
  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSubiendo(true);
      const fotoRef = ref(storage, `fotosPerfil/${user.uid}`);
      await uploadBytes(fotoRef, file);
      const url = await getDownloadURL(fotoRef);
      setFoto(url);
      setSubiendo(false);
    } catch (error) {
      console.error("Error al subir la foto:", error);
      mostrarMensaje("Error al subir la foto 😞", "error");
      setSubiendo(false);
    }
  };

  // 💾 Guardar cambios de nombre/foto en Firestore y contexto
  const handleGuardar = async () => {
    try {
      setGuardando(true);

      await updateUserProfile(user.uid, {
        nombre: nombre.trim(),
        foto,
      });

      // 🔄 Actualiza el usuario en contexto sin recargar
      setUser((prev) => ({
        ...prev,
        nombre: nombre.trim(),
        foto: foto,
      }));

      mostrarMensaje("Perfil actualizado correctamente 💖", "exito");
      setGuardando(false);

      // 🔒 Cierra el modal después de un pequeño delay
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      mostrarMensaje("Perfil actualizado correctamente 💖", "exito");
      setGuardando(false);
    }
  };

  // 💬 Mostrar mensaje flotante arriba
  const mostrarMensaje = (texto, tipo = "exito") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(null), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo oscuro */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Ventana modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl p-8 w-[90%] max-w-md z-50 text-center border border-pink-200"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Botón cerrar */}
            <button
              className="absolute top-4 right-4 text-pink-600 hover:text-pink-800"
              onClick={onClose}
            >
              <X size={24} />
            </button>

            {/* Imagen de perfil */}
            <div className="relative inline-block">
              {foto ? (
                <motion.img
                  src={foto}
                  alt="Foto de perfil"
                  className="w-24 h-24 mx-auto rounded-full border-4 border-pink-300 shadow-md object-cover"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
              ) : (
                <div className="w-24 h-24 mx-auto rounded-full bg-pink-300 flex items-center justify-center text-white text-4xl font-bold border-4 border-pink-200 shadow-md">
                  {user.nombre?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}

              {/* Botón cámara */}
              <label className="absolute bottom-1 right-2 bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full cursor-pointer">
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFotoChange}
                />
              </label>
            </div>

            {subiendo && (
              <p className="text-sm text-gray-500 mt-2">Subiendo foto...</p>
            )}

            {/* Campo editable */}
            <div className="mt-4">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border border-pink-300 rounded-xl px-3 py-2 w-full text-center text-lg text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <p className="text-gray-600 text-sm mt-2">{user.email}</p>

            <div className="w-20 h-0.5 bg-pink-300 mx-auto my-4"></div>

            <div className="text-sm text-gray-700 space-y-1">
              {user.creadoEn && (
                <p>
                  🗓️ <b>Cuenta creada:</b>{" "}
                  {new Date(
                    user.creadoEn.seconds
                      ? user.creadoEn.seconds * 1000
                      : user.creadoEn
                  ).toLocaleDateString()}
                </p>
              )}
              <p>✨ <b>ID:</b> {user.uid}</p>
            </div>

            <button
              onClick={handleGuardar}
              disabled={guardando || subiendo}
              className={`mt-6 py-2 px-6 rounded-xl font-semibold text-white transition-all ${
                guardando || subiendo
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </motion.div>

          {/* 🩷 Notificación flotante arriba */}
          <AnimatePresence>
            {mensaje && (
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg font-semibold text-white z-[60] ${
                  tipoMensaje === "exito"
                    ? "bg-pink-500"
                    : "bg-red-500"
                }`}
              >
                {mensaje}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default PerfilModal;
