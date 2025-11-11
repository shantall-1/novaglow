import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const traducirError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "Este correo ya está registrado.";
      case "auth/invalid-email":
        return "El correo no es válido.";
      case "auth/weak-password":
        return "La contraseña es muy débil (mínimo 6 caracteres).";
      default:
        return "Ocurrió un error. Intenta nuevamente.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { nombre, email, password, confirmPassword } = formData;
    const emailLower = email.trim().toLowerCase();

    if (!nombre || !email || !password || !confirmPassword) {
      setError("⚠️ Todos los campos son obligatorios.");
      return;
    }

    if (password.length < 6) {
      setError("🔒 La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("💔 Las contraseñas no coinciden.");
      return;
    }

    try {
      await register(nombre, emailLower, password);
      setSuccess("✨ ¡Registro exitoso! Redirigiendo...");
      setTimeout(() => navigate("/productos"), 1500);
    } catch (err) {
      console.log(err);
      setError(traducirError(err.code));
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
      navigate("/productos");
    } catch (err) {
      setError(traducirError(err.code));
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-pink-100 via-pink-200 to-pink-300 p-6">
      <div className="relative bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-10 w-full max-w-md z-10 transform transition-all hover:scale-[1.02]">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-4">
          💖 Crea tu cuenta NovaGlow 💖
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Únete a nuestra comunidad de brillo y glamour ✨
        </p>

        {error && (
          <p className="bg-pink-100 border border-pink-300 text-pink-700 p-3 rounded-md mb-4 text-center">
            {error}
          </p>
        )}

        {success && (
          <p className="bg-green-100 border border-green-300 text-green-700 p-3 rounded-md mb-4 text-center">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-pink-700 font-medium mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej. Camila López"
              className="w-full p-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-pink-700 font-medium mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              className="w-full p-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-pink-700 font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-pink-700 font-medium mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>

          {/* Botón registrar */}
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg shadow-lg transition transform hover:scale-[1.02]"
          >
            Registrarme 💅
          </button>
        </form>

        {/* Google Login */}
        <button
          onClick={handleGoogle}
          className="w-full mt-4 bg-white border border-pink-300 text-pink-700 font-medium py-3 rounded-lg shadow transition hover:bg-pink-50"
        >
          Continuar con Google 🌸
        </button>

        <div className="mt-6 text-center text-gray-600 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-pink-600 font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
