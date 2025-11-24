+import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { AlertCircle, Check, LogOut, Chrome } from "lucide-react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// --- CONFIGURACIÓN DE FIREBASE ---
// ⚠️ IMPORTANTE: Reemplaza esto con TU propia configuración de Firebase
const firebaseConfig = {
  apiKey: "", // Tu API Key aquí
  authDomain: "tu-app.firebaseapp.com",
  projectId: "tu-app",
  storageBucket: "tu-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};

// Inicialización segura para evitar errores en re-renders
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// --- AUTH CONTEXT ---
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // 🔹 LOGIN con Google (Corregido y Centralizado)
  const loginConGoogle = async () => {
    try {
      // 1. Iniciar el popup y esperar el resultado
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 2. Referencia al documento del usuario
      const refUser = doc(db, "usuarios", user.uid);
      const snap = await getDoc(refUser);

      const userData = {
        uid: user.uid,
        email: user.email,
        nombre: user.displayName || user.email.split("@")[0],
        foto: user.photoURL || "",
        ultimaConexion: serverTimestamp(),
      };

      // 3. Guardar o Actualizar en Firestore
      if (!snap.exists()) {
        // Si es nuevo, creamos con fecha de creación
        await setDoc(refUser, {
          ...userData,
          creadoEn: serverTimestamp(),
        });
      } else {
        // Si ya existe, solo actualizamos la última conexión y datos básicos
        await setDoc(refUser, userData, { merge: true });
      }

      // 4. Actualizar estado local
      setUsuario(userData);
      return user;
    } catch (error) {
      console.error("Error en Google Login:", error);
      throw error; // Re-lanzamos para que el componente Login lo maneje
    }
  };

  // 🔹 LOGIN con Email
  const loginConEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user; // Firestore logic should be handled separately or here if consistent
  };

  // 🔹 LOGOUT
  const logout = async () => {
    await signOut(auth);
    setUsuario(null);
  };

  // 🔹 ESCUCHAR SESIÓN
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Opcional: Obtener datos frescos de Firestore al recargar
        // Por rendimiento, a veces basta con los datos de Auth para la UI inicial
        setUsuario({
          uid: user.uid,
          email: user.email,
          nombre: user.displayName || user.email.split("@")[0],
          foto: user.photoURL,
        });
      } else {
        setUsuario(null);
      }
      setCargando(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        loginConGoogle,
        loginConEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// --- COMPONENTE LOGIN ---
const Login = ({ onNavigate }) => {
  const { loginConEmail, loginConGoogle } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginConEmail(form.email, form.password);
      handleSuccess("¡Inicio de sesión exitoso!");
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      // ✅ La lógica de Firestore ya está en el Context, así que aquí solo llamamos y esperamos
      await loginConGoogle();
      handleSuccess("🌸 ¡Bienvenida con Google!");
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Haz cerrado la ventana de Google antes de terminar.");
      } else {
        setError("No se pudo iniciar sesión con Google.");
      }
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (msg) => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffc8dd", "#ffafcc", "#ffe5ec"],
    });
    setMensaje(msg);
    setTimeout(() => onNavigate("dashboard"), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-100 to-white p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-pink-200"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">
          🌷 NovaGlow 🌷
        </h1>

        <AnimatePresence>
          {(error || mensaje) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={shake ? { x: [-5, 5, -5, 5, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${
                error ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"
              }`}
            >
              {error ? <AlertCircle size={18} /> : <Check size={18} />}
              {error || mensaje}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-pink-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-pink-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
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
          disabled={loading}
          className="w-full bg-white border border-pink-200 text-gray-700 font-medium py-2.5 rounded-xl shadow-sm hover:bg-pink-50 transition-all flex items-center justify-center gap-2 group"
        >
          <Chrome className="w-5 h-5 text-pink-500 group-hover:rotate-12 transition-transform" />
          Google 🌸
        </button>
      </motion.div>
    </div>
  );
};

// --- DASHBOARD (Protected Route Example) ---
const Dashboard = ({ onNavigate }) => {
  const { usuario, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onNavigate("login");
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <nav className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-pink-600">NovaGlow Panel</h2>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-700">{usuario?.nombre}</p>
            <p className="text-xs text-gray-400">{usuario?.email}</p>
          </div>
          {usuario?.foto ? (
            <img src={usuario.foto} alt="Perfil" className="w-10 h-10 rounded-full border-2 border-pink-200" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-bold">
              {usuario?.nombre?.charAt(0).toUpperCase()}
            </div>
          )}
          <button onClick={handleLogout} className="p-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Bienvenida</h3>
          <p className="text-gray-500">
            Has iniciado sesión correctamente. Este es un ejemplo de ruta protegida.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP (Navigation Logic) ---
export default function App() {
  const [view, setView] = useState("login");

  return (
    <AuthProvider>
      <div className="font-sans text-gray-800">
        {view === "login" ? (
          <Login onNavigate={setView} />
        ) : (
          <Dashboard onNavigate={setView} />
        )}
      </div>
    </AuthProvider>
  );
}