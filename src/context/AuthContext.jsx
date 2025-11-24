import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, db, storage } from "../lib/firebase";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // 🔹 LOGIN con email
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  // 🔹 Alias para Login.jsx
  const loginConEmail = login;

  // 🔹 REGISTRO con email + foto opcional + ROL
  // Modificado para recibir el rol (default: "usuario")
  const registrarUsuario = async (email, password, nombre, foto = null, rol = "usuario") => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    let photoURL = "";
    if (foto) {
      const storageRef = ref(storage, `usuarios/${user.uid}/${foto.name}`);
      await uploadBytes(storageRef, foto);
      photoURL = await getDownloadURL(storageRef);
    }

    await updateProfile(user, { displayName: nombre, photoURL: photoURL || "" });

    // 👇 AQUÍ GUARDAMOS EL ROL EN LA BASE DE DATOS
    await setDoc(doc(db, "usuarios", user.uid), {
      uid: user.uid,
      nombre,
      email: user.email,
      foto: photoURL || null,
      role: rol, // Guardamos en inglés
      rol: rol,  // Guardamos en español (por seguridad)
      creadoEn: serverTimestamp(),
    });

    setUsuario({
      uid: user.uid,
      email: user.email,
      displayName: nombre,
      foto: photoURL || null,
      role: rol, // Actualizamos estado local
      rol: rol,
    });

    return user;
  };

  // 🔹 LOGIN con Google
  const loginGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const refUser = doc(db, "usuarios", user.uid);
    const snap = await getDoc(refUser);

    let userData = {};

    if (!snap.exists()) {
      // Si es la primera vez que entra con Google, lo registramos como USUARIO
      userData = {
        uid: user.uid,
        nombre: user.displayName || user.email.split("@")[0],
        email: user.email,
        foto: user.photoURL || null,
        role: "usuario", // 👇 Rol por defecto para Google
        rol: "usuario",
        creadoEn: serverTimestamp(),
      };
      await setDoc(refUser, userData);
    } else {
      userData = snap.data();
    }

    setUsuario({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split("@")[0],
      foto: user.photoURL || null,
      role: userData.role || userData.rol || "usuario", // Leemos el rol
      rol: userData.role || userData.rol || "usuario",
    });

    return user;
  };

  // 🔹 SUBIR FOTO PERFIL
  const subirFotoPerfil = async (file) => {
    if (!auth.currentUser) return null;
    const uid = auth.currentUser.uid;
    const imgRef = ref(storage, `usuarios/${uid}/perfil.jpg`);

    await uploadBytes(imgRef, file);
    const url = await getDownloadURL(imgRef);

    await updateProfile(auth.currentUser, { photoURL: url });
    await updateDoc(doc(db, "usuarios", uid), { foto: url });

    setUsuario((prev) => ({ ...prev, foto: url }));

    return url;
  };

  // 🔹 ACTUALIZAR NOMBRE/FOTO
  const updateUserProfile = async ({ nombre, foto }) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    await updateProfile(auth.currentUser, {
      displayName: nombre ?? auth.currentUser.displayName,
      photoURL: foto !== undefined ? foto : auth.currentUser.photoURL,
    });

    await updateDoc(doc(db, "usuarios", uid), {
      nombre: nombre ?? auth.currentUser.displayName,
      foto: foto !== undefined ? foto : auth.currentUser.photoURL,
    });

    const snap = await getDoc(doc(db, "usuarios", uid));
    const data = snap.exists() ? snap.data() : {};

    setUsuario({
      uid,
      email: auth.currentUser.email,
      displayName: data?.nombre || auth.currentUser.displayName || "Usuario",
      foto: data?.foto ?? null,
      role: data?.role || data?.rol || "usuario", // Mantenemos el rol al actualizar
    });
  };

  // 🔹 LOGOUT
  const logout = async () => {
    await signOut(auth);
    setUsuario(null);
  };

  // 🔹 RESET PASSWORD
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // 🔹 ESCUCHAR CAMBIOS DE SESIÓN
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUsuario(null);
        setCargando(false);
        return;
      }

      // Al recargar la página, leemos la ficha completa de Firestore
      const refUser = doc(db, "usuarios", user.uid);
      const snap = await getDoc(refUser);
      const data = snap.exists() ? snap.data() : {};

      setUsuario({
        uid: user.uid,
        email: user.email,
        displayName: data?.nombre || user.displayName || "Usuario",
        foto: data?.foto ?? user.photoURL ?? null,
        role: data?.role || data?.rol || "usuario", // 👇 IMPORTANTE: Cargamos el rol
        rol: data?.role || data?.rol || "usuario",
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
        login,
        loginConEmail,
        registrarUsuario,
        loginGoogle,
        logout,
        resetPassword,
        updateUserProfile,
        subirFotoPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);