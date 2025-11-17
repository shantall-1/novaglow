
import { createContext, useContext, useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const ComentariosContext = createContext();
export const useComentarios = () => useContext(ComentariosContext);

export const ComentariosProvider = ({ children }) => {
  const [comentarios, setComentarios] = useState([]);

  const cargarComentarios = async (idProducto) => {
    const snap = await getDocs(collection(db, "comentarios", idProducto, "mensajes"));
    const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setComentarios(lista);
  };

  const agregarComentario = async (idProducto, texto, autor) => {
    await addDoc(collection(db, "comentarios", idProducto, "mensajes"), {
      texto,
      autor,
      fecha: new Date(),
    });
    cargarComentarios(idProducto);
  };

  return (
    <ComentariosContext.Provider
      value={{
        comentarios,
        cargarComentarios,
        agregarComentario,
      }}
    >
      {children}
    </ComentariosContext.Provider>
  );
};
