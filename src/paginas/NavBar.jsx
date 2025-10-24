import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CarritoIcon from "../componentes/carritoIcon";

const Navbar = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const cargarUsuario = () => {
      const sesion = localStorage.getItem("novaglow_session");
      setUsuario(sesion ? JSON.parse(sesion) : null);
    };

    cargarUsuario();
    window.addEventListener("storage", cargarUsuario);
    window.addEventListener("novaglow_session_change", cargarUsuario);

    return () => {
      window.removeEventListener("storage", cargarUsuario);
      window.removeEventListener("novaglow_session_change", cargarUsuario);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("novaglow_session");
    setUsuario(null);
    alert("👋 Sesión cerrada correctamente.");
    window.dispatchEvent(new Event("novaglow_session_change"));
    navigate("/");
  };

  return (
    <nav className="bg-pink-100 shadow-md py-4 fixed top-0 left-0 w-full z-50 transition-all duration-500">
      <div className="container mx-auto flex justify-between items-center px-6">

        {/* 🌸 Logo con texto */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img
            src="/logo.png"
            alt="NovaGlow Logo"
            className="h-10 w-10 rounded-full shadow-md group-hover:scale-110 transition-transform"
          />
          <span className="text-2xl font-extrabold text-pink-600 font-[Poppins] group-hover:text-pink-700 transition-colors">
            NovaGlow
          </span>
        </Link>

        {/* 🔗 Navegación */}
        <div className="hidden md:flex space-x-6 items-center text-gray-700 font-medium">
          <Link to="/" className="hover:text-pink-500 transition">Inicio</Link>
          <Link to="/productos" className="hover:text-pink-500 transition">Productos</Link>
          <Link to="/nosotros" className="hover:text-pink-500 transition">Nosotros</Link>
          <Link to="/contacto" className="hover:text-pink-500 transition">Contacto</Link>
        </div>

        {/* 🛒 Carrito + sesión */}
<div className="flex items-center space-x-4">
  <CarritoIcon />
  {usuario ? (
    <div className="flex items-center space-x-3">
      <span className="text-pink-700 font-semibold">
        Hola, {usuario.nombre?.split(" ")[0]} ✨
      </span>
      <button
        onClick={handleLogout}
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105"
      >
        Cerrar Sesión
      </button>
    </div>
  ) : (
    <div className="flex items-center space-x-3">
      <Link
        to="/login"
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-transform hover:scale-105"
      >
        Iniciar Sesión
      </Link>
      <Link
        to="/registro"
        className="border border-pink-500 text-pink-600 font-bold py-2 px-4 rounded-lg hover:bg-pink-50 transition-transform hover:scale-105"
      >
        Registrarme
      </Link>
    </div>
  )}
</div>

      </div>
    </nav>
  );
};

export default Navbar;
