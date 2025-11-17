import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AnimatedModal from "../componentes/AnimatedModal";

export default function Registro() {
  const navigate = useNavigate();
  const { registrarUsuario, loginGoogle } = useAuth();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    foto: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "foto") {
      setForm({ ...form, foto: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const traducirError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "Este correo ya está registrado.";
      case "auth/invalid-email":
        return "El correo no es válido.";
      case "auth/weak-password":
        return "La contraseña es muy débil (mínimo 6 caracteres).";
      case "auth/popup-closed-by-user":
        return "Cerraste la ventana antes de completar el inicio de sesión.";
      default:
        return "Ocurrió un error. Intenta nuevamente.";
    }
  };

  // 🔹 Registro con Email/Password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { nombre, email, password, confirmPassword, foto } = form;
    const emailLower = email.trim().toLowerCase();

    if (!nombre || !email || !password || !confirmPassword)
      return setError("⚠️ Todos los campos son obligatorios.");
    if (password.length < 6)
      return setError("🔒 La contraseña debe tener al menos 6 caracteres.");
    if (password !== confirmPassword)
      return setError("💔 Las contraseñas no coinciden.");

    try {
      setLoading(true);

      const user = await registrarUsuario(emailLower, password, nombre, foto);

      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
      setSuccess("✨ ¡Registro exitoso! Redirigiendo a iniciar sesión...");
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate("/login"); // registro normal → login
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(traducirError(err.code));
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Registro/Inicio con Google
  const handleGoogle = async () => {
    setError("");
    setSuccess("");

    try {
      const user = await loginGoogle();

      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
      setSuccess("💖 ¡Inicio de sesión con Google exitoso!");
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate("/productos"); // Google → /productos
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(traducirError(err.code));
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-200 via-pink-100 to-white p-6">
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-pink-600 text-lg font-semibold animate-pulse">
            Cargando...
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-pink-200 relative"
      >
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          🌷 Crear Cuenta 🌷
        </h2>

        {(error || success) && (
          <p
            className={`text-sm text-center p-2 rounded-xl mb-4 ${
              error ? "text-red-500 bg-red-100" : "text-green-700 bg-green-100"
            }`}
          >
            {error || success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            className="w-full p-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-pink-700 border border-pink-300 rounded-xl p-2 cursor-pointer"
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl shadow-lg"
          >
            Registrarme 💖
          </motion.button>
        </form>

        <button
          onClick={handleGoogle}
          className="w-full mt-4 bg-white border border-pink-300 text-pink-700 font-medium py-3 rounded-xl shadow hover:bg-pink-50"
        >
          Continuar con Google 🌸
        </button>

        <p className="text-center mt-4 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-pink-600 hover:underline font-semibold"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </motion.div>

      {showModal && (
        <AnimatedModal
          mensaje={error || success}
          tipo={error ? "error" : "success"}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
