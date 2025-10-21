import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("💔 Por favor, completa todos los campos.");
      return;
    }

    // Simulación de inicio de sesión
    if (email === "cliente@novaglow.com" && password === "12345") {
      setError("");
      alert("✨ Bienvenida a NovaGlow 💅");
      navigate("/productos");
    } else {
      setError("⚠️ Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-6">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-10 w-full max-w-md transform transition-all hover:scale-[1.02]">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-4 font-[Poppins]">
          💖 Bienvenida a NovaGlow 💖
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Inicia sesión y sigue brillando con estilo ✨
        </p>

        {error && (
          <p className="bg-pink-100 border border-pink-300 text-pink-700 p-3 rounded-md mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-pink-700 font-medium mb-1">
              Correo electrónico
            </label>
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
            <label className="block text-pink-700 font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg shadow-lg transition transform hover:scale-[1.02]"
          >
            Iniciar Sesión 💅
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/registro"
            className="text-pink-600 font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
