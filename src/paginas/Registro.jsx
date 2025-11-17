import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function Registro() {
  const navigate = useNavigate();
  const { registrarUsuario } = useAuth();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    foto: null,
  });
  const [error, setError] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  // Animación de vibración en caso de error
  const [shake, setShake] = useState(false);
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setForm((prev) => ({ ...prev, foto: files[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const traducirError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "El correo ya está en uso.";
      case "auth/invalid-email":
        return "Correo inválido.";
      case "auth/weak-password":
        return "La contraseña es muy débil.";
      default:
        return "Ocurrió un error. Intenta nuevamente.";
    }
  };

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
      particleCount: 200,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ffc8dd", "#ffafcc", "#ffe5ec"],
    });

    setTimeout(() => canvas.remove(), 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubiendo(true);

    const { nombre, email, password, foto } = form;
    if (!nombre || !email || !password) {
      setError("💔 Por favor completa todos los campos.");
      triggerShake();
      setSubiendo(false);
      return;
    }

    try {
      // Registrar usuario en Firebase + Firestore
      await registrarUsuario(email.trim().toLowerCase(), password, nombre, foto);

      dispararConfeti();

      // Redirigir a login
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(traducirError(err.code));
      triggerShake();
    }
    setSubiendo(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-200 via-pink-100 to-white p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-pink-200"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">
          🌷 Crear Cuenta 🌷
        </h1>

        {error && (
          <motion.p
            key={error}
            animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-sm p-3 rounded-xl border text-center text-red-600 bg-red-50 border-red-200"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="w-full border border-pink-300 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tucorreo@ejemplo.com"
              className="w-full border border-pink-300 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              className="w-full border border-pink-300 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">
              Foto de perfil (opcional)
            </label>
            <input
              type="file"
              name="foto"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={subiendo}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-xl transition-all shadow-lg"
          >
            {subiendo ? "Creando cuenta..." : "Crear Cuenta 💖"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-pink-600 font-semibold hover:underline"
          >
            Iniciar Sesión
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
