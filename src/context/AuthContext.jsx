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
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // ----------------------------
  // 🔹 LOGIN con email
  // ----------------------------
  const loginConEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  // ----------------------------
  // 🔹 LOGIN con Google
  // ----------------------------
  const loginConGoogle = async () => {
    const result = signInWithPopup(auth, googleProvider);
    const user = (await result).user;

    const refUser = doc(db, "usuarios", user.uid);
    const snap = await getDoc(refUser);

    if (!snap.exists()) {
      await setDoc(refUser, {
        uid: user.uid,
        nombre: user.displayName || user.email.split("@")[0],
        email: user.email,
        foto: user.photoURL || "",
        creadoEn: serverTimestamp(),
      });
    }

    setUsuario({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split("@")[0],
      foto: user.photoURL || "",
    });

    return user;
  };

  // ----------------------------
  // 🔹 REGISTRAR USUARIO (sin storage)
  // ----------------------------
  const registrarUsuario = async (email, password, nombre, fotoURL = "") => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // ⛔ YA NO ENVIAMOS fotoURL → Firebase Auth no acepta Base64 grande
    await updateProfile(user, {
      displayName: nombre,
    });

    // 🔥 Guardamos fotoBase64 SOLO en Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      uid: user.uid,
      nombre,
      email: user.email,
      foto: fotoURL, // Base64 completa
      creadoEn: serverTimestamp(),
    });

    setUsuario({
      uid: user.uid,
      email: user.email,
      displayName: nombre,
      foto: fotoURL,
    });

    return user;
  };

  // ----------------------------
  // 🔹 SUBIR FOTO PERFIL (solo firestore)
  // ----------------------------
  const subirFotoPerfil = async (url) => {
    if (!auth.currentUser) return null;
    const uid = auth.currentUser.uid;

    await updateDoc(doc(db, "usuarios", uid), { foto: url });

    setUsuario((prev) => ({ ...prev, foto: url }));
    return url;
  };

  // ----------------------------
  // 🔹 ACTUALIZAR NOMBRE/FOTO
  // ----------------------------
  const updateUserProfile = async ({ nombre, foto }) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    // Foto manejada solo en Firestore
    const newPhotoURL = foto !== undefined ? foto : usuario?.foto;

    // Firebase Auth solo nombre
    await updateProfile(auth.currentUser, {
      displayName: nombre ?? auth.currentUser.displayName,
    });

    await updateDoc(doc(db, "usuarios", uid), {
      nombre: nombre ?? auth.currentUser.displayName,
      foto: newPhotoURL,
    });

    const snap = await getDoc(doc(db, "usuarios", uid));
    const data = snap.data();

    setUsuario({
      uid,
      email: auth.currentUser.email,
      displayName: data.nombre,
      foto: data.foto,
    });
  };

  // ----------------------------
  // ❌ ELIMINAR FOTO PERFIL
  // ----------------------------
  const eliminarFotoPerfil = async () => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    await updateUserProfile({ foto: "" });
  };

  // ----------------------------
  // 🔹 LOGOUT
  // ----------------------------
  const logout = async () => {
    await signOut(auth);
    setUsuario(null);
  };

  // ----------------------------
  // 🔹 RESET PASSWORD
  // ----------------------------
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // ----------------------------
  // 🔹 ESCUCHAR SESIÓN
  // ----------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUsuario(null);
        setCargando(false);
        return;
      }

      const refUser = doc(db, "usuarios", user.uid);
      const snap = await getDoc(refUser);
      const data = snap.exists() ? snap.data() : {};

      setUsuario({
        uid: user.uid,
        email: user.email,
        displayName: data.nombre || user.displayName,
        foto: data.foto || "",
      });

      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        loginConEmail,
        loginConGoogle,
        registrarUsuario,
        logout,
        resetPassword,
        updateUserProfile,
        subirFotoPerfil,
        eliminarFotoPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);



