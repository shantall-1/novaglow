import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import AnimatedModal from "../componentes/AnimatedModal";

const Logout = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const auth = getAuth();

    useEffect(() => {
    let timer;
    const cerrarSesion = async () => {
      try {
        // 🔒 Cerrar sesión de Firebase
        await signOut(auth);

        // 🧹 Borrar sesión local
        localStorage.removeItem("novaglow_session");

        // 🔔 Notificar al Navbar que el usuario cerró sesión
        window.dispatchEvent(new Event("novaglow_session_change"));
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      } finally {
        // ⏱️ Mostrar el modal y redirigir después
        timer = setTimeout(() => {
          setShowModal(false);
          navigate("/");
        }, 3000);
      }
    };

    cerrarSesion();
    return () => clearTimeout(timer);
  }, [auth, navigate]);

  return (
    <>
      {showModal && (
        <AnimatedModal
          show={showModal}
          message="👋 ¡Cerraste sesión con éxito!"
          subtext="Esperamos verte pronto 💅"
          type="logout"
          color="rose"
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Logout;

