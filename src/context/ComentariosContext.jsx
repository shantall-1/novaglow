// src/context/ComentariosContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { db, auth, googleProvider } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";

const ComentariosContext = createContext();
export const useComentarios = () => useContext(ComentariosContext);

export const ComentariosProvider = ({ children }) => {
  const [comentariosPorProducto, setComentariosPorProducto] = useState({});
  const [usuario, setUsuario] = useState(null);
  const [unsubs, setUnsubs] = useState({}); // para manejar múltiples suscripciones

  // Listener auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log("[Comentarios] auth:", u?.email || null);
      setUsuario(u || null);
    });
    return () => unsub();
  }, []);

  // Suscribirse a comentarios de un producto (retorna unsubscribe)
  const suscribirseAComentarios = (idProducto) => {
    if (!idProducto) return () => {};

    // si ya había una suscripción para ese id, retornar esa unsubscribe
    if (unsubs[idProducto]) return unsubs[idProducto];

    const q = query(
      collection(db, "comentarios"),
      where("productId", "==", String(idProducto)),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log(`[Comentarios] snapshot ${idProducto}:`, lista);
        setComentariosPorProducto((prev) => ({ ...prev, [idProducto]: lista }));
      },
      (err) => {
        console.error("[Comentarios] onSnapshot error:", err);
        setComentariosPorProducto((prev) => ({ ...prev, [idProducto]: [] }));
      }
    );

    setUnsubs((prev) => ({ ...prev, [idProducto]: unsubscribe }));

    return () => {
      if (unsubscribe) unsubscribe();
      setUnsubs((prev) => {
        const n = { ...prev };
        delete n[idProducto];
        return n;
      });
    };
  };

  // Forzar login con popup (retorna user)
  const loginConPopup = async () => {
    if (auth.currentUser) return auth.currentUser;
    const res = await signInWithPopup(auth, googleProvider);
    setUsuario(res.user);
    return res.user;
  };

  // Agregar comentario (si no está logueada pide login)
  const agregarComentario = async (idProducto, texto) => {
    if (!texto || !texto.trim()) return;

    try {
      let user = usuario;
      if (!user) {
        const res = await loginConPopup();
        user = res;
      }

      const userName = user.displayName || user.email || "Usuario";

      await addDoc(collection(db, "comentarios"), {
        productId: String(idProducto),
        texto: texto.trim(),
        userName,
        createdAt: serverTimestamp(),
      });

      console.log("[Comentarios] comentario añadido para", idProducto);
      // onSnapshot se encargará de actualizar el state
    } catch (error) {
      console.error("[Comentarios] error agregarComentario:", error);
      throw error;
    }
  };

  return (
    <ComentariosContext.Provider
      value={{
        comentariosPorProducto,
        suscribirseAComentarios,
        agregarComentario,
        usuario,
      }}
    >
      {children}
    </ComentariosContext.Provider>
  );
};

