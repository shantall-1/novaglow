// src/context/FavoriteContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { db, auth, googleProvider } from "../lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";

const FavoriteContext = createContext();
export const useFavoritos = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [unsubFavs, setUnsubFavs] = useState(null);

  // Escuchar auth (solo una vez)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log("[Favorite] onAuthStateChanged ->", u?.email || null);
      setUser(u || null);
    });
    return () => unsub();
  }, []);

  // Suscribirse a favoritos en cuanto haya user
  useEffect(() => {
    // limpiar suscripción previa
    if (typeof unsubFavs === "function") {
      unsubFavs();
      setUnsubFavs(null);
    }

    if (!user) {
      setFavoritos([]);
      return;
    }

    const uid = user.uid;
    const favRef = collection(db, "favoritos", uid, "items");

    const unsub = onSnapshot(
      favRef,
      (snap) => {
        const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log("[Favorite] onSnapshot favorites:", lista);
        setFavoritos(lista);
      },
      (err) => {
        console.error("[Favorite] onSnapshot error:", err);
        setFavoritos([]);
      }
    );

    setUnsubFavs(() => unsub);

    return () => {
      if (unsub) unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Forzar login con popup (retorna user)
  const loginConPopup = async () => {
    if (auth.currentUser) return auth.currentUser;
    const res = await signInWithPopup(auth, googleProvider);
    setUser(res.user);
    return res.user;
  };

  // Agregar favorito (si no hay user, pedir login y usar el resultado)
  const agregarFavorito = async (producto) => {
    try {
      let currentUser = user || auth.currentUser;
      if (!currentUser) {
        // login sin recargar y garantizando que despues podemos abrir modal
        currentUser = await loginConPopup();
      }
      if (!currentUser || !currentUser.uid) {
        console.warn("[Favorite] No se obtuvo uid tras login");
        return;
      }

      const uid = currentUser.uid;
      // guardamos el documento con id = producto.id para poder borrarlo fácilmente
      const ref = doc(db, "favoritos", uid, "items", String(producto.id));

      await setDoc(ref, {
        idProducto: String(producto.id),
        name: producto.name,
        price: producto.price ?? null,
        image: producto.image ?? producto.gallery?.[0] ?? "",
        addedAt: new Date().toISOString(),
      });

      console.log(`[Favorite] agregado favorito ${producto.id} para uid ${uid}`);
      // onSnapshot actualizará la lista
    } catch (error) {
      console.error("[Favorite] error agregarFavorito:", error);
      throw error;
    }
  };

  // Quitar favorito (espera productId que sea el id del doc o idProducto; document id es el que usamos)
  const quitarFavorito = async (productId) => {
    try {
      const uid = auth.currentUser?.uid || user?.uid;
      if (!uid) {
        console.warn("[Favorite] no hay uid para quitar favorito");
        return;
      }
      // El id del doc que almacenamos al crear fue String(producto.id) -> es el mismo que productId si pasamos f.id
      await deleteDoc(doc(db, "favoritos", uid, "items", String(productId)));
      console.log(`[Favorite] eliminado favorito ${productId} para uid ${uid}`);
    } catch (error) {
      console.error("[Favorite] error quitarFavorito:", error);
      throw error;
    }
  };

  const estaEnFavoritos = (productId) =>
    favoritos.some((f) => String(f.idProducto || f.id) === String(productId));

  return (
    <FavoriteContext.Provider
      value={{
        user,
        favoritos,
        agregarFavorito,
        quitarFavorito,
        estaEnFavoritos,
        loginConPopup,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};


