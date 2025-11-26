import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase'; // Asegúrate que la ruta sea correcta
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const useUserData = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // Aquí guardamos el rol y datos de DB
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Escuchar autenticación
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        return;
      }

      // 2. Si hay usuario, escuchar su documento de base de datos EN TIEMPO REAL
      const docRef = doc(db, "usuarios", currentUser.uid);
      
      const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          // Aquí capturamos el campo 'rol' (basado en tu imagen es 'rol')
          setUserData(docSnap.data());
        } else {
          // El usuario está logueado pero no tiene documento en DB
          setUserData(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error escuchando datos de usuario:", error);
        setLoading(false);
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  return { user, userData, loading };
};