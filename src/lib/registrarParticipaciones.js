import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";


export const registrarParticipaciones = async (carrito, usuario) => {
  if (!usuario || !carrito || carrito.length === 0) return;

  // 🔢 Total de participaciones = suma de cantidades
  const participaciones = carrito.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  const ordenId = `ORD-${Date.now()}`;

  await addDoc(collection(db, "participaciones"), {
    sorteoId: "bad-bunny-entrada-doble-2026",
    userId: usuario.uid,
    email: usuario.email,
    ordenId,
    participaciones,
    fecha: serverTimestamp(),
  });
};
