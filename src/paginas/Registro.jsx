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
    foto: null, // archivo
    fotoBase64: "", // base64 final
  });

  const [error, setError] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  // Animación de vibración
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  // Convertir archivo a Base64
  const convertirABase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    // Selección de imagen
    if (name === "foto") {
      const archivo = files?.[0];

      if (!archivo) {
        setForm((prev) => ({ ...prev, foto: null, fotoBase64: "" }));
        return;
      }

      // Convertimos a base64 automáticamente
      const base64 = await convertirABase64(archivo);

      setForm((prev) => ({
        ...prev,
        foto: archivo,
        fotoBase64: base64,
      }));

      return;
    }

    // Inputs normales
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const traducirError = (code) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "Este correo ya está registrado. Intenta iniciar sesión 🤍";
    case "auth/invalid-email":
      return "El formato del correo no es válido.";
    case "auth/weak-password":
      return "La contraseña debe contener al menos 6 caracteres.";
    case "auth/missing-password":
      return "Debes escribir una contraseña.";
    default:
      return "Ocurrió un error inesperado. Intenta nuevamente.";
  }
};

  const dispararConfeti = () => {
    const canvas = document.createElement("canvas");
    Object.assign(canvas.style, {
      position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh",
      pointerEvents: "none", zIndex: "999999"
    });
    document.body.appendChild(canvas);
    const myConfetti = confetti.create(canvas, { resize: true });
    myConfetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: ["#ffc8dd", "#ffafcc", "#ffe5ec"] });
    setTimeout(() => canvas.remove(), 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubiendo(true);

    const { nombre, email, password, fotoBase64 } = form;

    if (!nombre || !email || !password) {
      setError("💔 Por favor completa todos los campos.");
      triggerShake();
      setSubiendo(false);
      return;
    }

    try {
      // ENVIAMOS LA FOTO BASE64 (o vacía si no hay)
      await registrarUsuario(
        email.trim().toLowerCase(),
        password,
        nombre,
        fotoBase64 || "" // <-- YA NO ENVIAMOS FILE
      );

      dispararConfeti();

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(traducirError(err.code));
      triggerShake();
    }
    setSubiendo(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-100 to-white p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-pink-200"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">🌷 Crear Cuenta 🌷</h1>

        {error && (
          <motion.p
            key={error}
            animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
            className="mb-3 text-sm p-3 rounded-xl border text-center text-red-600 bg-red-50 border-red-200"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campos del formulario (iguales que antes) */}
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">Nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" className="w-full border border-pink-300 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
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
    className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none
      ${error === "Este correo ya está registrado. Intenta iniciar sesión 🤍"
        ? "border-red-400 focus:ring-red-400 bg-red-50" // 🔥 SE PONE ROJO
        : "border-pink-300 focus:ring-2 focus:ring-pink-400"
      }
    `}
  />
</div>


          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">Contraseña</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Tu contraseña" className="w-full border border-pink-300 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">Foto de perfil (opcional)</label>
            <input type="file" name="foto" accept="image/*" onChange={handleChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" />
          </div>

          {/* Mensaje informativo invisible para el usuario pero útil para ti */}
          <input type="hidden" name="rol" value="usuario" />

          <button type="submit" disabled={subiendo} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-xl transition-all shadow-lg">
            {subiendo ? "Registrando..." : "Crear Cuenta 💖"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          ¿Ya tienes cuenta? <Link to="/login" className="text-pink-600 font-semibold hover:underline">Iniciar Sesión</Link>
        </p>
      </motion.div>
    </div>
  );
}