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

  // 🔹 REGISTRO con email + foto opcional
  const registrarUsuario = async (email, password, nombre, foto = null) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    let photoURL = "";
    if (foto) {
      const storageRef = ref(storage, `usuarios/${user.uid}/${foto.name}`);
      await uploadBytes(storageRef, foto);
      photoURL = await getDownloadURL(storageRef);
    }

    await updateProfile(user, { displayName: nombre, photoURL: photoURL || "" });

    await setDoc(doc(db, "usuarios", user.uid), {
      uid: user.uid,
      nombre,
      email: user.email,
      foto: photoURL || null,
      creadoEn: serverTimestamp(),
    });

    setUsuario({
      uid: user.uid,
      email: user.email,
      displayName: nombre,
      foto: photoURL || null,
    });

    return user;
  };

  // 🔹 LOGIN con Google
  const loginGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const refUser = doc(db, "usuarios", user.uid);
    const snap = await getDoc(refUser);

    if (!snap.exists()) {
      await setDoc(refUser, {
        uid: user.uid,
        nombre: user.displayName || user.email.split("@")[0],
        email: user.email,
        foto: user.photoURL || null,
        creadoEn: serverTimestamp(),
      });
    }

    setUsuario({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split("@")[0],
      foto: user.photoURL || null,
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

    setUsuario(prev => ({ ...prev, foto: url }));

    return url;
  };

  // 🔹 ACTUALIZAR NOMBRE/FOTO (permite foto=null)
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

      const refUser = doc(db, "usuarios", user.uid);
      const snap = await getDoc(refUser);
      const data = snap.exists() ? snap.data() : {};

      setUsuario({
        uid: user.uid,
        email: user.email,
        displayName: data?.nombre || user.displayName || "Usuario",
        foto: data?.foto ?? user.photoURL ?? null,
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
        loginConEmail, // <-- mantiene compatibilidad con Login.jsx
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
