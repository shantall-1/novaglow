import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedModal from "../componentes/AnimatedModal";

const Logout = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    localStorage.removeItem("novaglow_session");

    const timer = setTimeout(() => {
      setShowModal(false);
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
