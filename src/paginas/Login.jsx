import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AnimatedModal from "../componentes/AnimatedModal";

// 🔥 Firebase
import { db } from "../lib/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const from = location.state?.from?.pathname || "/productos";

  useEffect(() => {
    if (location.state?.message) {
      setModalMessage(location.state.message);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3500);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError("💔 Por favor, completa todos los campos.");
      return;
    }

    try {
      // 🔑 Iniciar sesión con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 📄 Buscar datos del usuario en Firestore
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      // 🩷 Si no existe, lo creamos automáticamente
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          nombre: user.email.split("@")[0],
          creadoEn: serverTimestamp(),
          ultimaConexion: serverTimestamp(),
        });
      } else {
        // Actualiza la fecha de última conexión
        await setDoc(
          userRef,
          { ultimaConexion: serverTimestamp() },
          { merge: true }
        );
      }

      const nombre = userSnap.exists()
        ? userSnap.data().nombre
        : user.email.split("@")[0];

      // 💾 Guardar sesión local (para Navbar)
      localStorage.setItem("novaglow_session", JSON.stringify({ nombre, email }));
      window.dispatchEvent(new Event("novaglow_session_change"));

      setModalMessage("💖 ¡Inicio de sesión exitoso!");
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        navigate(from, { replace: true });
      }, 2000);
    } catch (error) {
      console.error(error);
      setError(traducirError(error.code));
    }
  };

  // 👀 Si hay sesión activa, mantenerla sincronizada
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email;
        const nombre = email.split("@")[0];
        localStorage.setItem("novaglow_session", JSON.stringify({ nombre, email }));
        window.dispatchEvent(new Event("novaglow_session_change"));
      }
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-100 via-pink-200 to-pink-300 p-6">
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

      {showModal && (
        <AnimatedModal
          show={showModal}
          message={modalMessage}
          type="success"
          color="pink"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Login;




