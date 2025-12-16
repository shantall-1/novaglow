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
  orderBy,
  where
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

    // 🔥 Actualizar estado inmediatamente para reflejar cambios en la UI
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
      telefono: data.telefono || "",
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
      telefono: "",
    });

    return user;
  };

  // -----------------------------------
  // ACTUALIZACIONES ESPECÍFICAS
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
  // GESTIÓN DE PERFIL (FOTO Y NOMBRE)
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
    // Si foto es null, lo guardamos como null (para borrar), si es undefined, mantenemos la actual
    const fotoFinal = foto === null ? "" : (foto ?? usuario?.foto);

    // Actualizar Auth de Firebase
    await updateProfile(auth.currentUser, {
      displayName: nombre ?? auth.currentUser.displayName,
      photoURL: fotoFinal || "",
    });

    // Actualizar Firestore
    await updateDoc(doc(db, "usuarios", uid), {
      nombre: nombre ?? auth.currentUser.displayName,
      foto: fotoFinal,
    });

    // Actualizar Estado Local
    setUsuario((prev) => ({
        ...prev,
        displayName: nombre ?? prev.displayName,
        foto: fotoFinal
    }));
  };

  const eliminarFotoPerfil = async () => {
    await updateUserProfile({ foto: "" });
  };

  // -----------------------------------
  // LOGOUT & RESET
  // -----------------------------------
  const logout = async () => {
    await signOut(auth);
    setUsuario(null);
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // -----------------------------------
// 🔥 GUARDAR PEDIDO EN COLECCIÓN "pedidos" (NO dentro de usuarios)
// -----------------------------------
const guardarDatosPedido = async (pedido) => {
  if (!usuario) throw new Error("No hay usuario logueado");

  // Guardar en colección global "pedidos"
  await addDoc(collection(db, "pedidos"), {
    userId: usuario.uid,
    nombre: pedido.nombre,
    email: pedido.email,
    direccion: pedido.direccion,
    productos: pedido.productos,
    total: pedido.total,
    metodoPago: pedido.metodoPago,
    numeroTarjeta: pedido.numeroTarjeta || null,
    numeroTelefono: pedido.numeroTelefono || null, // ✔ TELÉFONO
    creadoEn: serverTimestamp(),
  });

  // Actualizar datos de contacto para futuras compras
  await actualizarDatosUsuario({
    nombre: pedido.nombre,
    email: pedido.email,
    direccion: pedido.direccion,
    metodoPago: pedido.metodoPago,
    telefono: pedido.numeroTelefono,
  });

  // Actualizar estado local
  setUsuario((prev) => ({
    ...prev,
    displayName: pedido.nombre,
    email: pedido.email,
    direccion: pedido.direccion,
    metodoPago: pedido.metodoPago,
    telefono: pedido.numeroTelefono,
  }));
};

  // -----------------------------------
  // OBTENER PEDIDOS
  // -----------------------------------
  const obtenerPedidos = async () => {
    if (!usuario) return [];
    const pedidosRef = collection(db, "pedidos");
    // Ordenar por fecha de creación descendente (más reciente primero)
    const q = query(pedidosRef, where("userId", "==", usuario.uid), orderBy("creadoEn", "desc"));

    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // -----------------------------------
  // ESCUCHAR CAMBIOS DE SESIÓN
  // -----------------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUsuario(null);
        setCargando(false);
        return;
      }

      // Sincronizar con Firestore
      const refUser = doc(db, "usuarios", user.uid);
      const snap = await getDoc(refUser);
      const data = snap.exists() ? snap.data() : {};

      // Construir objeto usuario completo
      setUsuario({
        uid: user.uid,
        email: user.email,
        displayName: data.nombre || user.displayName,
        foto: data.foto || user.photoURL || "",
        direccion: data.direccion || "",
        metodoPago: data.metodoPago || "",
        telefono: data.telefono || "", // <--- Añadido teléfono 
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