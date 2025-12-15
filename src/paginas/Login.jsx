import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import AnimatedModal from "../componentes/AnimatedModal"; 
import { db, auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/productos";

  // ✅ CORRECCIÓN: Usamos el nombre exacto que tienes en tu AuthContext
  const { loginConEmail, loginConGoogle } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Efecto de vibración para errores ---
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  // --- Traductor de errores de Firebase ---
  const traducirError = (code) => {
    switch (code) {
      case "auth/invalid-email": return "El correo no es válido.";
      case "auth/user-not-found": return "No existe una cuenta con este correo.";
      case "auth/wrong-password": return "La contraseña es incorrecta.";
      case "auth/missing-password": return "Debes ingresar una contraseña.";
      case "auth/popup-closed-by-user": return "Cerraste la ventana de Google antes de terminar.";
      case "auth/popup-blocked": return "El navegador bloqueó la ventana emergente.";
      case "auth/cancelled-popup-request": return "Se canceló la solicitud.";
      default: return "Ocurrió un error: " + code;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ⭐ LOGIN CON EMAIL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setError("💔 Por favor, completa todos los campos.");
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      const user = await loginConEmail(email, password);

      confetti({ particleCount: 180, spread: 70, origin: { y: 0.6 }, colors: ["#ffc8dd", "#ffafcc", "#ffe5ec"] });

      // Actualizar timestamp
      const userRef = doc(db, "usuarios", user.uid);
      await setDoc(userRef, { ultimaConexion: serverTimestamp() }, { merge: true });

      setMensaje("💖 ¡Inicio de sesión exitoso!");
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate(from, { replace: true });
      }, 2000);
    } catch (err) {
      console.error("Error Email:", err);
      setError(traducirError(err.code));
      triggerShake();
      setLoading(false);
    }
  };

  // ⭐ LOGIN CON GOOGLE (CORREGIDO)
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      console.log("🌸 Iniciando login con Google...");
      
      // ✅ Llamamos a la función correcta del contexto
      // Tu contexto ya devuelve el objeto 'user' y guarda en firestore, 
      // así que aquí solo necesitamos esperar la respuesta.
      const user = await loginConGoogle();

      if (!user) throw new Error("No se obtuvieron datos del usuario.");

      // Solo actualizamos la última conexión aquí, porque tu Context ya creó el usuario si era nuevo
      await setDoc(
        doc(db, "usuarios", user.uid),
        { ultimaConexion: serverTimestamp() },
        { merge: true }
      );

      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#4285F4", "#34A853", "#FBBC05", "#EA4335"],
      });

      setMensaje("🌸 ¡Bienvenida con Google!");
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate(from, { replace: true });
      }, 2000);

    } catch (err) {
      console.error("Error Google:", err);
      setError(traducirError(err.code || "auth/internal-error"));
      triggerShake();
      setLoading(false);
    }
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
          🌷 Iniciar Sesión 🌷
        </h1>

        {(error || mensaje) && (
          <motion.p
            key={error || mensaje}
            animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
            className={`mb-3 text-sm p-3 rounded-xl border text-center ${
              error ? "text-red-600 bg-red-50 border-red-200" : "text-green-700 bg-green-50 border-green-200"
            }`}
          >
            {error || mensaje}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="tucorreo@ejemplo.com"
              className="w-full border border-pink-300 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Tu contraseña"
              className="w-full border border-pink-300 rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Cargando..." : "Iniciar Sesión 💖"}
          </button>
        </form>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-pink-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-pink-400">O continúa con</span>
            </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full bg-white border border-pink-300 text-gray-700 font-medium py-2.5 rounded-xl shadow-sm hover:bg-pink-50 hover:shadow-md transition-all flex justify-center items-center gap-3 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Iniciar sesión con Google
        </button>

        <p className="text-center mt-6 text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="text-pink-600 font-semibold hover:underline">
            Crear cuenta
          </Link>
        </p>
      </motion.div>
      {showModal && <AnimatedModal />}
    </div>
  );
}