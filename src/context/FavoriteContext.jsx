
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const FavoriteContext = createContext();
export const useFavoritos = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState([]);

  const uid = user?.uid || "anonimo";

  const cargarFavoritos = async () => {
    const snap = await getDocs(collection(db, "favoritos", uid, "items"));
    const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setFavoritos(lista);
  };

  useEffect(() => {
    cargarFavoritos();
  }, [user]);

  const agregarFavorito = async (producto) => {
    await addDoc(collection(db, "favoritos", uid, "items"), producto);
    cargarFavoritos();
  };

  const quitarFavorito = async (id) => {
    await deleteDoc(doc(db, "favoritos", uid, "items", id));
    cargarFavoritos();
  };

  const estaEnFavoritos = (id) => favoritos.some((f) => f.idProducto === id);

  return (
    <FavoriteContext.Provider
      value={{
        favoritos,
        agregarFavorito,
        quitarFavorito,
        estaEnFavoritos,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
