import { createContext, useContext, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { auth } from "../lib/firebase";

const ComentariosContext = createContext();

export const useComentarios = () => useContext(ComentariosContext);

export const ComentariosProvider = ({ children }) => {
 
  const [comentarios, setComentarios] = useState([]);

  // 👂 ESCUCHAR COMENTARIOS DEL PRODUCTO
  const escucharComentarios = (productoId) => {
    if (!productoId) return () => {};

    const q = query(
      collection(db, "comentarios"),
      where("productoId", "==", productoId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComentarios(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return unsubscribe;
  };

  // ➕ AGREGAR COMENTARIO (SEGURO)

  const agregarComentario = async (productoId, texto) => {
  if (!texto || !texto.trim()) return;

  const user = auth.currentUser;

  if (!user) {
    console.warn("Usuario no autenticado, no se puede comentar");
    return;
  }

  await addDoc(collection(db, "comentarios"), {
    productoId,
    texto: texto.trim(),
    userId: user.uid,
    userEmail: user.email,
    userName: user.displayName || "Anónimo",
    createdAt: serverTimestamp(),
  });
};


  // 💬 RESPONDER COMENTARIO
const responderComentario = async (productoId, comentarioId, texto) => {
  if (!texto || !texto.trim()) return;

  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "comentarios"), {
    productoId,
    texto: texto.trim(),
    respuestaA: comentarioId, // 🔥 CLAVE
    userId: user.uid,
    userName: user.displayName || "Anónimo",
    createdAt: serverTimestamp(),
  });
};

  // ✏️ EDITAR COMENTARIO
  const editarComentario = async (id, texto) => {
    if (!texto || !texto.trim()) return;

    await updateDoc(doc(db, "comentarios", id), {
      texto: texto.trim(),
    });
  };

  // 🗑️ BORRAR COMENTARIO
  const borrarComentario = async (id) => {
    await deleteDoc(doc(db, "comentarios", id));
  };

  return (
    <ComentariosContext.Provider
  value={{
    comentarios,
    escucharComentarios,
    agregarComentario,
    responderComentario, // 👈 AQUÍ
    editarComentario,
    borrarComentario,
  }}
>

      {children}
    </ComentariosContext.Provider>
  );
};

