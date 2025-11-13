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
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("novaglow_session")) || null
  );
  const [loading, setLoading] = useState(true);

  // 🔁 Mantiene sincronizado con Firebase Auth y Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "usuarios", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let userData;
        if (userSnap.exists()) {
          userData = userSnap.data();
        } else {
          // Crear registro si no existe
          userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            nombre:
              firebaseUser.displayName || firebaseUser.email.split("@")[0],
            foto: firebaseUser.photoURL || "",
            creadoEn: new Date(),
          };
          await setDoc(userRef, userData);
        }

        setUser(userData);
        localStorage.setItem("novaglow_session", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("novaglow_session");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 📝 Actualizar datos del usuario en Firestore y en estado local
  const updateUserProfile = async (uid, data) => {
    const userRef = doc(db, "usuarios", uid);
    await updateDoc(userRef, data);

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("novaglow_session", JSON.stringify(updatedUser));
  };

  // 🧾 Registro
  const register = async (nombre, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: nombre });

    const userData = {
      uid: cred.user.uid,
      nombre,
      email,
      foto: cred.user.photoURL || "",
      creadoEn: new Date(),
    };

    await setDoc(doc(db, "usuarios", cred.user.uid), userData);
    setUser(userData);
    localStorage.setItem("novaglow_session", JSON.stringify(userData));
    return cred.user;
  };

  // 🔐 Login
  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "usuarios", cred.user.uid);
    const userSnap = await getDoc(userRef);

    let userData;
    if (userSnap.exists()) {
      userData = userSnap.data();
    } else {
      userData = {
        uid: cred.user.uid,
        email: cred.user.email,
        nombre: cred.user.displayName || cred.user.email.split("@")[0],
        foto: cred.user.photoURL || "",
        creadoEn: new Date(),
      };
      await setDoc(userRef, userData);
    }

    setUser(userData);
    localStorage.setItem("novaglow_session", JSON.stringify(userData));
    return cred.user;
  };

  // 🌈 Login con Google
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const u = result.user;

    const userRef = doc(db, "usuarios", u.uid);
    const snap = await getDoc(userRef);

    const userData = {
      uid: u.uid,
      nombre: u.displayName || u.email.split("@")[0],
      email: u.email,
      foto: u.photoURL || "",
      creadoEn: new Date(),
    };

    if (!snap.exists()) {
      await setDoc(userRef, userData);
    }

    setUser(userData);
    localStorage.setItem("novaglow_session", JSON.stringify(userData));
    return u;
  };

  // 📩 Restablecer contraseña
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // 🚪 Cerrar sesión
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("novaglow_session");
  };

  const value = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    resetPassword,
    logout,
    updateUserProfile, // <-- 💾 Nuevo para actualizar nombre/foto sin recargar
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {loading && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
          <p className="text-pink-600 font-extrabold text-xl animate-pulse">
            <span className="text-3xl mr-2">⏳</span> Cargando sesión...
          </p>
        </div>
      )}
    </AuthContext.Provider>
  );
}
