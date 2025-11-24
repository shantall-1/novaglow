import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import AnimatedModal from "../componentes/AnimatedModal";
import { db, auth } from "../lib/firebase";
import {
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/productos";

  // 🔥 AJUSTE IMPORTANTE (para que siga funcionando loginConGoogle)
  const { loginConEmail, loginGoogle: loginConGoogle } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [shake, setShake] = useState(false);

  // Animación de vibración
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  // Escucha de sesión local
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { displayName, email, photoURL, uid } = user;

        localStorage.setItem(
          "novaglow_session",
          JSON.stringify({
            uid,
            nombre: displayName || email.split("@")[0],
            email,
            foto: photoURL || "",
          })
        );

        window.dispatchEvent(new Event("novaglow_session_change"));
      }
    });

    return () => unsub();
  }, []);

  const traducirError = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "El correo no es válido.";
      case "auth/user-not-found":
        return "No existe una cuenta con este correo.";
      case "auth/wrong-password":
        return "La contraseña es incorrecta.";
      case "auth/missing-password":
        return "Debes ingresar una contraseña.";
      default:
        return "Ocurrió un error. Intenta nuevamente.";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ⭐ LOGIN con correo
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

    try {
      // Login desde AuthContext
      const user = await loginConEmail(email, password);

      // 🎉 Confetti
      confetti({
        particleCount: 180,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ffc8dd", "#ffafcc", "#ffe5ec"],
      });

      // Guardar en Firestore
      const userRef = doc(db, "usuarios", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          nombre: user.displayName || user.email.split("@")[0],
          foto: user.photoURL || "",
          creadoEn: serverTimestamp(),
          ultimaConexion: serverTimestamp(),
        });
      } else {
        await setDoc(
          userRef,
          { ultimaConexion: serverTimestamp() },
          { merge: true }
        );
      }

      setMensaje("💖 ¡Inicio de sesión exitoso!");
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate(from, { replace: true });
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(traducirError(err.code));
      triggerShake();
    }
  };

  // ⭐ LOGIN con Google
  const handleGoogleLogin = async () => {
    setError("");

    try {
      const user = await loginConGoogle();

      await setDoc(
        doc(db, "usuarios", user.uid),
        {
          uid: user.uid,
          nombre: user.displayName || user.email.split("@")[0],
          email: user.email,
          foto: user.photoURL || "",
          ultimaConexion: serverTimestamp(),
        },
        { merge: true }
      );

      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.6 },
      });

      setMensaje("🌸 ¡Bienvenida de nuevo con Google!");
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate("/productos");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(traducirError(err.code));
      triggerShake();
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
              error
                ? "text-red-600 bg-red-50 border-red-200"
                : "text-green-700 bg-green-50 border-green-200"
            }`}
          >
            {error || mensaje}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-xl transition-all shadow-lg"
          >
            Iniciar Sesión 💖
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 bg-white border border-pink-300 text-pink-700 font-medium py-2 rounded-xl shadow hover:bg-pink-50"
        >
          Continuar con Google 🌸
        </button>

        <p className="text-center mt-6 text-sm">
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="text-pink-600 font-semibold hover:underline"
          >
            Crear cuenta
          </Link>
        </p>
      </motion.div>
    </div>
  );
}