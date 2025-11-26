import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const { usuario } = useAuth();
  const [carrito, setCarrito] = useState([]);

  // 🔹 Cargar carrito de Firebase al iniciar sesión
  useEffect(() => {
    const cargarCarrito = async () => {
      if (!usuario) {
        setCarrito([]);
        return;
      }
      const ref = doc(db, "usuarios", usuario.uid, "carrito", "actual");
      const snap = await getDoc(ref);
      if (snap.exists()) setCarrito(snap.data().items || []);
    };
    cargarCarrito();
  }, [usuario]);

  // 🔹 Guardar carrito en Firebase
  const guardarCarritoFirebase = async (items) => {
    if (!usuario) return;
    const ref = doc(db, "usuarios", usuario.uid, "carrito", "actual");
    await setDoc(ref, { items });
  };

  const agregarAlCarrito = (producto, cantidad = 1) => {
    if (!producto || !producto.id) return;

    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      const nuevoCarrito = existente
        ? prev.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          )
        : [...prev, { ...producto, cantidad }];
      guardarCarritoFirebase(nuevoCarrito);
      return nuevoCarrito;
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => {
      const nuevoCarrito = prev.filter((item) => item.id !== id);
      guardarCarritoFirebase(nuevoCarrito);
      return nuevoCarrito;
    });
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    setCarrito((prev) => {
      const nuevoCarrito =
        nuevaCantidad <= 0
          ? prev.filter((item) => item.id !== id)
          : prev.map((item) =>
              item.id === id ? { ...item, cantidad: nuevaCantidad } : item
            );
      guardarCarritoFirebase(nuevoCarrito);
      return nuevoCarrito;
    });
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    guardarCarritoFirebase([]);
  };

  // 🔹 Restaurar productos de un pedido cancelado
  const restaurarProductos = (productos) => {
    setCarrito((prev) => {
      const nuevoCarrito = [...prev];
      productos.forEach((prod) => {
        const existente = nuevoCarrito.find((p) => p.id === prod.id);
        if (existente) {
          existente.cantidad += prod.cantidad;
        } else {
          nuevoCarrito.push(prod);
        }
      });
      guardarCarritoFirebase(nuevoCarrito);
      return nuevoCarrito;
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
        total,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context)
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  return context;
};

