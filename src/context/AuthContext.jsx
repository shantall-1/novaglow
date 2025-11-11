import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// 1️⃣ Crear contexto
const AuthContext = createContext();

// 2️⃣ Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}

// 3️⃣ Proveedor principal
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Escucha el estado de autenticación en Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // 📋 Obtenemos los datos del usuario desde Firestore
        const userRef = doc(db, "usuarios", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let userData;
        if (userSnap.exists()) {
          userData = userSnap.data();
        } else {
          // Si no existe en Firestore, lo creamos
          userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            nombre: firebaseUser.displayName || firebaseUser.email.split("@")[0],
            creadoEn: new Date(),
          };
          await setDoc(userRef, userData);
        }

        // Guardamos en estado local
        setUser(userData);

        // Guardamos también en localStorage para el Navbar
        localStorage.setItem(
          "novaglow_session",
          JSON.stringify({
            nombre: userData.nombre,
            email: userData.email,
          })
        );

        window.dispatchEvent(new Event("novaglow_session_change"));
      } else {
        setUser(null);
        localStorage.removeItem("novaglow_session");
        window.dispatchEvent(new Event("novaglow_session_change"));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- ✨ Funciones principales ---

  // Registro con email y contraseña
  const register = async (nombre, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    // Guardamos nombre en el perfil de Firebase
    await updateProfile(newUser, { displayName: nombre });

    // Guardamos usuario en Firestore
    await setDoc(doc(db, "usuarios", newUser.uid), {
      uid: newUser.uid,
      nombre,
      email,
      creadoEn: new Date(),
    });

    // Guardar en localStorage también
    localStorage.setItem(
      "novaglow_session",
      JSON.stringify({ nombre, email })
    );
    window.dispatchEvent(new Event("novaglow_session_change"));

    return newUser;
  };

  // Login normal
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const nombre = user.displayName || email.split("@")[0];

    localStorage.setItem(
      "novaglow_session",
      JSON.stringify({ nombre, email })
    );
    window.dispatchEvent(new Event("novaglow_session_change"));

    return user;
  };

  // Login con Google
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "usuarios", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        nombre: user.displayName || user.email.split("@")[0],
        email: user.email,
        creadoEn: new Date(),
      });
    }

    localStorage.setItem(
      "novaglow_session",
      JSON.stringify({
        nombre: user.displayName || user.email.split("@")[0],
        email: user.email,
      })
    );
    window.dispatchEvent(new Event("novaglow_session_change"));

    return user;
  };

  // Restablecer contraseña
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // Cerrar sesión
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("novaglow_session");
    window.dispatchEvent(new Event("novaglow_session_change"));
    setUser(null);
  };

  // Valores que el contexto compartirá
  const value = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      {loading && (
        <div className="fixed inset-0 bg-white backdrop-blur flex items-center justify-center z-9999">
          <p className="text-pink-600 font-extrabold text-xl animate-pulse">
            <span className="text-3xl mr-2">⏳</span> Cargando sesión...
          </p>
        </div>
      )}
    </AuthContext.Provider>
  );
}
