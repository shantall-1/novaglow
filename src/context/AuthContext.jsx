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
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // -----------------------------------
  // LOGIN con email
  // -----------------------------------
  const loginConEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  // -----------------------------------
  // ACTUALIZAR DATOS GENERALES (FIRESTORE + STATE)
  // -----------------------------------
  const actualizarDatosUsuario = async (campos) => {
    if (!usuario) throw new Error("No hay usuario logueado");

    const usuarioRef = doc(db, "usuarios", usuario.uid);

    const datos = {};
    Object.keys(campos).forEach((key) => {
      if (campos[key] !== undefined) datos[key] = campos[key];
    });

    await updateDoc(usuarioRef, datos);

    // 🔥 Actualizar estado inmediatamente
    setUsuario((prev) => ({ ...prev, ...datos }));
  };

  // -----------------------------------
  // LOGIN con Google
  // -----------------------------------
  const loginConGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

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

    const data = snap.exists() ? snap.data() : {};

    setUsuario({
      uid: user.uid,
      email: user.email,
      displayName: data.nombre || user.displayName,
      foto: data.foto || user.photoURL,
      direccion: data.direccion || "",
      metodoPago: data.metodoPago || "",
    });

    return user;
  };

  // -----------------------------------
  // REGISTRAR USUARIO
  // -----------------------------------
  const registrarUsuario = async (email, password, nombre, fotoURL = "") => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await updateProfile(user, { displayName: nombre });

    await setDoc(doc(db, "usuarios", user.uid), {
      uid: user.uid,
      nombre,
      email,
      foto: fotoURL,
      creadoEn: serverTimestamp(),
    });

    setUsuario({
      uid: user.uid,
      email: user.email,
      displayName: nombre,
      foto: fotoURL,
      direccion: "",
      metodoPago: "",
    });

    return user;
  };

  // -----------------------------------
  // CAMPOS SUELTOS
  // -----------------------------------
  const updateEmail = async (nuevoEmail) => {
    await actualizarDatosUsuario({ email: nuevoEmail });
  };

  const updateDireccion = async (nuevaDireccion) => {
    await actualizarDatosUsuario({ direccion: nuevaDireccion });
  };

  const updateMetodoPago = async (nuevoMetodoPago) => {
    await actualizarDatosUsuario({ metodoPago: nuevoMetodoPago });
  };

  // -----------------------------------
  // FOTO PERFIL
  // -----------------------------------
  const subirFotoPerfil = async (url) => {
    if (!auth.currentUser) return null;
    const uid = auth.currentUser.uid;

    await updateDoc(doc(db, "usuarios", uid), { foto: url });

    setUsuario((prev) => ({ ...prev, foto: url }));
    return url;
  };

  const updateUserProfile = async ({ nombre, foto }) => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;
    const fotoFinal = foto ?? usuario?.foto;

    await updateProfile(auth.currentUser, {
      displayName: nombre ?? auth.currentUser.displayName,
    });

    await updateDoc(doc(db, "usuarios", uid), {
      nombre: nombre ?? auth.currentUser.displayName,
      foto: fotoFinal,
    });

    const snap = await getDoc(doc(db, "usuarios", uid));
    const data = snap.data();

    setUsuario({
      uid,
      email: auth.currentUser.email,
      displayName: data.nombre,
      foto: data.foto,
      direccion: data.direccion || "",
      metodoPago: data.metodoPago || "",
    });
  };

  const eliminarFotoPerfil = async () => {
    await updateUserProfile({ foto: "" });
  };

  // -----------------------------------
  // LOGOUT
  // -----------------------------------
  const logout = async () => {
    await signOut(auth);
    setUsuario(null);
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  
// -----------------------------------
// GUARDAR PEDIDO (VERSIÓN FINAL CORRECTA)
// -----------------------------------
const guardarDatosPedido = async (pedido) => {
  if (!usuario) throw new Error("No hay usuario logueado");

  const pedidosRef = collection(db, "usuarios", usuario.uid, "pedidos");

  // 🔥 AQUI SE GUARDA EL PEDIDO COMPLETO
  await addDoc(pedidosRef, {
    nombre: pedido.nombre,
    email: pedido.email,
    direccion: pedido.direccion,
    productos: pedido.productos,   // AHORA SI SE GUARDA
    total: pedido.total,           // AHORA SI SE GUARDA
    metodoPago:  pedido.metodoPago,
    numeroTarjeta: pedido.numeroTarjeta,
    numeroTelefono: pedido.numeroTelefono, // si aplica
    creadoEn: serverTimestamp(),
  });

  // 🔥 Actualizar datos del usuario
  await actualizarDatosUsuario({
    nombre: pedido.nombre,
    email: pedido.email,
    direccion: pedido.direccion,
    metodoPago: pedido.metodoPago,
  });
};




  // -----------------------------------
  // OBTENER PEDIDOS
  // -----------------------------------
  const obtenerPedidos = async () => {
    if (!usuario) return [];
    const pedidosRef = collection(db, "usuarios", usuario.uid, "pedidos");
    const q = query(pedidosRef, orderBy("creadoEn", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // -----------------------------------
  // ESCUCHAR SESIÓN (MEJORADO)
  // -----------------------------------
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

      // 🔥 Combinar Auth + Firestore
      setUsuario({
        uid: user.uid,
        email: user.email,
        displayName: data.nombre || user.displayName,
        foto: data.foto || user.photoURL || "",
        direccion: data.direccion || "",
        metodoPago: data.metodoPago || "",
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
        actualizarDatosUsuario,
        updateEmail,
        updateDireccion,
        updateMetodoPago,
        guardarDatosPedido,
        obtenerPedidos,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);



