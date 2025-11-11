import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedModal from "../componentes/AnimatedModal";
import { getAuth, signOut } from "firebase/auth";

const Logout = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    // 🔥 Cerrar sesión de Firebase
    signOut(auth)
      .then(() => {
        // 🧹 Limpiar sesión local
        localStorage.removeItem("novaglow_session");
        window.dispatchEvent(new Event("novaglow_session_change"));
      })
      .catch((error) => console.error("Error al cerrar sesión:", error));

    // 🕒 Mostrar el modal y redirigir
    const timer = setTimeout(() => {
      setShowModal(false);
      navigate("/");
    }, 3000);

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
