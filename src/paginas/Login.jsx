import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AnimatedModal from "../componentes/AnimatedModal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (location.state?.message) {
      setModalMessage(location.state.message);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3500);
    }
  }, [location.state]);

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!email || !password) {
    setModalMessage("⚠️ Por favor, completa todos los campos.");
    setShowModal(true);
    return;
  }

  const nombre = email.split("@")[0];
  const user = { nombre, email };
  localStorage.setItem("novaglow_session", JSON.stringify(user));

  // 🔔 Notifica al Navbar que hay un nuevo usuario
  window.dispatchEvent(new Event("novaglow_session_change"));

  setModalMessage("💖 ¡Inicio de sesión exitoso!");
  setShowModal(true);

  setTimeout(() => {
    setShowModal(false);
    navigate(from);
  }, 2000);
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-pink-100">
        <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-6">
          ✨ Inicia Sesión ✨
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tuemail@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-pink-200 rounded-lg p-3 focus:ring-2 focus:ring-pink-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-pink-200 rounded-lg p-3 focus:ring-2 focus:ring-pink-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition-transform hover:scale-105"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>

      {showModal && (
        <AnimatedModal
          show={showModal}
          message={modalMessage}
          type="success"
          color="pink"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Login;



