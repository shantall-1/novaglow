import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// ✅ FIREBASE AUTH & FIRESTORE
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();

export default function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
      case "auth/popup-closed-by-user":
        return "Se cerró la ventana de Google antes de finalizar.";
      default:
        return "Ocurrió un error inesperado. Intenta nuevamente.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

   const { nombre, email, password, confirmPassword } = formData;
    const emailLower = email.trim().toLowerCase();

    // ✅ Validaciones
    if (!nombre || !email || !password || !confirmPassword) {
      setError("⚠️ Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("🔒 La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("💔 Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      // ✅ CREAR USUARIO EN AUTHENTICATION
      const result = await createUserWithEmailAndPassword(auth, emailLower, password);

      const uid = result.user.uid;

      // ✅ GUARDAR EN FIRESTORE
      await setDoc(doc(db, "usuarios", uid), {
        nombre,
        email: emailLower,
        creadoEn: new Date(),
      });

      setSuccess("✨ ¡Registro exitoso! Redirigiendo...");
      setTimeout(() => navigate("/productos"), 1500);

    } catch (err) {
      console.error(err);
      setError(traducirError(err.code || "default"));
      setLoading(false);

    } finally {
      if (!success) setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);

    try {
      // ✅ LOGIN CON GOOGLE EN AUTH
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // ✅ GUARDAR EN FIRESTORE SI NO EXISTE
      await setDoc(
        doc(db, "usuarios", user.uid),
        {
          nombre: user.displayName || "",
          email: user.email,
          creadoEn: new Date(),
        },
        { merge: true }
      );

      navigate("/productos");

    } catch (err) {
      console.error(err);
      setError(traducirError(err.code || "default"));

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-pink-100 via-pink-200 to-pink-300 p-6 font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');`}</style>
      
      <div className="relative bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl p-10 w-full max-w-md z-10 transform transition-all duration-300 hover:scale-[1.02]">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-4 tracking-tight">
          💖 Crea tu cuenta NovaGlow 💖
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Únete a nuestra comunidad de brillo y glamour ✨
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-xl mb-4 text-center font-medium shadow-sm">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded-xl mb-4 text-center font-medium shadow-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-pink-700 font-medium mb-1 text-sm">
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej. Camila López"
              className="w-full p-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition placeholder:text-gray-400"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-pink-700 font-medium mb-1 text-sm">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              className="w-full p-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition placeholder:text-gray-400"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-pink-700 font-medium mb-1 text-sm">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition placeholder:text-gray-400"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-pink-700 font-medium mb-1 text-sm">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition placeholder:text-gray-400"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded-xl shadow-lg transition transform duration-300 
              ${loading 
                ? 'bg-pink-300 text-pink-100 cursor-not-allowed flex items-center justify-center'
                : 'bg-pink-500 hover:bg-pink-600 text-white hover:scale-[1.01]'
              }`}
          >
            {loading ? "Registrando..." : "Registrarme 💅"}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/90 text-gray-500">O</span>
          </div>
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className={`w-full bg-white border border-pink-300 text-pink-700 font-medium py-3 rounded-xl shadow transition duration-300
            ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-pink-50'}
          `}
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
