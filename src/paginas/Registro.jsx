import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Registro = () => {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, email, password, confirmPassword } = formData;
    const emailLower = email.trim().toLowerCase();

    if (!nombre || !email || !password || !confirmPassword) {
      setError("⚠️ Todos los campos son obligatorios.");
      setSuccess("");
      return;
    }

    if (password.length < 5) {
      setError("🔒 La contraseña debe tener al menos 5 caracteres.");
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("💔 Las contraseñas no coinciden.");
      setSuccess("");
      return;
    }

    // Guardar usuario
    const newUser = { nombre, email: emailLower, password };
    localStorage.setItem("novaglow_user", JSON.stringify(newUser));

    // Crear sesión inmediata
    localStorage.setItem(
      "novaglow_session",
      JSON.stringify({ nombre, email: emailLower })
    );

    setError("");
    setSuccess("✨ ¡Registro exitoso! Redirigiendo...");
    setTimeout(() => {
      navigate("/productos");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6">
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
          <div>
            <label className="block text-pink-700 font-medium mb-1">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej. Camila López"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>

          <div>
            <label className="block text-pink-700 font-medium mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>

          <div>
            <label className="block text-pink-700 font-medium mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>

          <div>
            <label className="block text-pink-700 font-medium mb-1">Confirmar contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg shadow-lg transition transform hover:scale-[1.02]"
          >
            Registrarme 💅
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-pink-600 font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registro;
