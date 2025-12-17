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

  // 1. Escuchar Auth
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      console.log("[Favorite] onAuthStateChanged ->", u?.email || null);
      setUser(u || null);
    });
    return () => unsubAuth();
  }, []);

  // 2. Suscribirse a Favoritos (SIN setUnsubFavs en el estado)
  useEffect(() => {
    // Si no hay usuario, limpiamos la lista y no hacemos nada
    if (!user) {
      setFavoritos([]);
      return;
    }

    console.log("[Favorite] Iniciando suscripción para:", user.uid);
    const favRef = collection(db, "favoritos", user.uid, "items");

    // Firebase maneja la suscripción aquí
    const unsubscribe = onSnapshot(
      favRef,
      (snap) => {
        const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log("[Favorite] onSnapshot favorites:", lista);
        setFavoritos(lista);
      },
      (err) => {
        console.error("[Favorite] onSnapshot error:", err);
      }
    );

    // ✅ REGLA DE ORO: El return del useEffect es suficiente para limpiar
    return () => {
      console.log("[Favorite] Limpiando suscripción");
      unsubscribe();
    };
  }, [user?.uid]); // ✅ Usamos user?.uid para que la referencia sea estable y no buclee

  const loginConPopup = async () => {
    if (auth.currentUser) return auth.currentUser;
    const res = await signInWithPopup(auth, googleProvider);
    // setUser(res.user); // No es estrictamente necesario, onAuthStateChanged lo hará por ti
    return res.user;
  };

  const agregarFavorito = async (producto) => {
    try {
      let currentUser = user || auth.currentUser;
      if (!currentUser) {
        currentUser = await loginConPopup();
      }
      if (!currentUser?.uid) return;

      const uid = currentUser.uid;
      const ref = doc(db, "favoritos", uid, "items", String(producto.id));

      await setDoc(ref, {
        idProducto: String(producto.id),
        name: producto.name,
        price: producto.price ?? null,
        image: producto.image ?? producto.gallery?.[0] ?? "",
        addedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[Favorite] error agregarFavorito:", error);
    }
  };

  const quitarFavorito = async (productId) => {
    try {
      const uid = user?.uid || auth.currentUser?.uid;
      if (!uid) return;
      await deleteDoc(doc(db, "favoritos", uid, "items", String(productId)));
    } catch (error) {
      console.error("[Favorite] error quitarFavorito:", error);
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