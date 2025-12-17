import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const { usuario } = useAuth();
  const [carrito, setCarrito] = useState([]);

  // 1️⃣ Cargar carrito desde Firebase
  useEffect(() => {
    const cargarCarrito = async () => {
      if (!usuario) {
        setCarrito([]);
        return;
      }

      try {
        const ref = doc(db, "usuarios", usuario.uid, "carrito", "actual");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const items = snap.data().items || [];
          setCarrito(items);
        }
      } catch (error) {
        console.error("Error al cargar carrito:", error);
      }
    };

    cargarCarrito();
  }, [usuario?.uid]);

  // 2️⃣ Guardar carrito en Firebase (ÚNICO lugar)
  const guardarCarritoFirebase = async (items) => {
    if (!usuario) return;
    try {
      const ref = doc(db, "usuarios", usuario.uid, "carrito", "actual");
      await setDoc(ref, { items, últimaActualización: new Date() });
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
    }
  };

  useEffect(() => {
    if (!usuario) return;
    guardarCarritoFirebase(carrito);
  }, [carrito, usuario?.uid]);

  // 3️⃣ Acciones del carrito (PUROS, sin efectos secundarios)
  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      return existente
        ? prev.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          )
        : [...prev, { ...producto, cantidad }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    setCarrito((prev) =>
      nuevaCantidad <= 0
        ? prev.filter((item) => item.id !== id)
        : prev.map((item) =>
            item.id === id ? { ...item, cantidad: nuevaCantidad } : item
          )
    );
  };

  const actualizarTalla = (id, nuevaTalla) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, talla: nuevaTalla } : item
      )
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const restaurarProductos = (productos) => {
    setCarrito((prev) => {
      const nuevo = [...prev];
      productos.forEach((prod) => {
        const existente = nuevo.find((p) => p.id === prod.id);
        existente
          ? (existente.cantidad += prod.cantidad)
          : nuevo.push(prod);
      });
      return nuevo;
    });
  };

  const total = useMemo(
    () => carrito.reduce((acc, item) => acc + item.price * item.cantidad, 0),
    [carrito]
  );

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        restaurarProductos,
        actualizarTalla,
        total,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  }
  return context;
};
