import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Link } from "react-router-dom";

export default function MiCuentaModal({ cerrar }) {
  const { 
    loginConEmail, 
    registrarUsuario, 
    loginConGoogle, 
    usuario,
    cerrarSesion 
  } = useAuth();

  const [modo, setModo] = useState("login");
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    fotoBase64: "",
  });

  const [mostrarPass, setMostrarPass] = useState(false);
  const [terminos, setTerminos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Convertir imagen a base64
  const convertirABase64 = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(file);
    });

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "foto") {
      if (!files?.[0]) return;
      const base64 = await convertirABase64(files[0]);
      setForm((prev) => ({ ...prev, fotoBase64: base64 }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!terminos) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    setLoading(true);

    try {
      await loginConEmail(form.email.toLowerCase(), form.password);
      confetti({ particleCount: 150, spread: 70 });
      cerrar();
    } catch (err) {
      setError("Error al iniciar sesión: " + err.code);
    }

    setLoading(false);
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError("");

    if (!terminos) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    if (!form.nombre || !form.email || !form.password) {
      setError("Completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      await registrarUsuario(
        form.email.toLowerCase(),
        form.password,
        form.nombre,
        form.fotoBase64 || ""
      );

      confetti({ particleCount: 200, spread: 80 });
      setModo("login");
    } catch (err) {
      setError("Error al registrarte: " + err.code);
    }

    setLoading(false);
  };

  const loginGoogle = async () => {
    try {
      await loginConGoogle();
      confetti({ particleCount: 180, spread: 80 });
      cerrar();
    } catch (err) {
      setError("Error con Google: " + err.code);
    }
  };

  // 🌸 NUEVO: MENÚ PARA USUARIOS LOGEADOS
  if (usuario) {
    // ⚡ Ajuste importante: usar usuario.foto primero
    const fotoAvatar =
      usuario?.foto ||
      usuario?.photoURL ||
      `https://ui-avatars.com/api/?name=${usuario?.displayName || "U"}`;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl border border-pink-200 relative text-center"
        >
          <button className="absolute top-3 right-3 text-pink-500" onClick={cerrar}>
            ✕
          </button>

          <h2 className="text-3xl font-bold text-pink-600 mb-6">
            Mi Cuenta 💖
          </h2>

          {/* Avatar */}
          <div className="flex justify-center mb-5">
            <div className="w-24 h-24 rounded-full border-4 border-pink-300 overflow-hidden">
              <img
                src={fotoAvatar}
                className="w-full h-full object-cover"
                alt="Perfil"
              />
            </div>
          </div>

          <p className="font-semibold text-pink-700 mb-6">
            {usuario.displayName || usuario.email}
          </p>

          {/* Opciones del menú */}
          <div className="space-y-4">
            <Link
              to="/perfil"
              onClick={cerrar}
              className="block bg-pink-100 hover:bg-pink-200 py-3 rounded-2xl font-semibold text-pink-700"
            >
              Ver Perfil
            </Link>

            <Link
              to="/mis-pedidos"
              onClick={cerrar}
              className="block bg-pink-100 hover:bg-pink-200 py-3 rounded-2xl font-semibold text-pink-700"
            >
              Mis Pedidos
            </Link>

            <Link
              to="/editar-cuenta"
              onClick={cerrar}
              className="block bg-pink-100 hover:bg-pink-200 py-3 rounded-2xl font-semibold text-pink-700"
            >
              Editar Datos
            </Link>

            <button
              onClick={async () => {
                await cerrarSesion();
                cerrar();
              }}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-2xl font-bold"
            >
              Cerrar Sesión
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // 🌸 SI NO ESTÁ LOGEADO → formulario original
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl border border-pink-200 relative"
      >
        <button className="absolute top-3 right-3 text-pink-500" onClick={cerrar}>
          ✕
        </button>

        <h1 className="text-3xl font-bold text-center text-pink-600 mb-4">
          {modo === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
        </h1>

        {error && (
          <p className="bg-red-100 border border-red-300 text-red-700 p-2 rounded-xl text-sm text-center mb-3">
            {error}
          </p>
        )}

        <form onSubmit={modo === "login" ? handleLogin : handleRegistro} className="space-y-5">
          
          {modo === "registro" && (
            <div>
              <label className="text-pink-700 text-sm">Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full border border-pink-300 rounded-xl px-4 py-2"
              />
            </div>
          )}

          <div>
            <label className="text-pink-700 text-sm">Correo</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-pink-300 rounded-xl px-4 py-2"
            />
          </div>

          <div>
            <label className="text-pink-700 text-sm">Contraseña</label>

            <div className="relative">
              <input
                type={mostrarPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-pink-300 rounded-xl px-4 py-2"
              />
              <span
                onClick={() => setMostrarPass(!mostrarPass)}
                className="absolute right-3 top-3 cursor-pointer text-pink-500 text-sm"
              >
                {mostrarPass ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {modo === "registro" && (
            <div>
              <label className="text-pink-700 text-sm">Foto (opcional)</label>
              <input type="file" name="foto" accept="image/*" onChange={handleChange} />
            </div>
          )}

          {/* TÉRMINOS */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={terminos}
              onChange={(e) => setTerminos(e.target.checked)}
            />
            <span>Acepto los <Link to="/terminos" className="text-pink-600 underline">términos y condiciones</Link></span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl font-semibold"
          >
            {loading ? "Cargando..." : modo === "login" ? "Iniciar Sesión 💖" : "Crear Cuenta 💗"}
          </button>
        </form>

        {/* Google */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">o continúa con</p>

          <button
            onClick={loginGoogle}
            className="border border-pink-300 px-4 py-2 rounded-xl w-full bg-white hover:bg-pink-50 flex items-center justify-center gap-3"
          >
            🌸 Google
          </button>
        </div>

        <p className="text-center text-sm mt-5">
          {modo === "login" ? (
            <>
              ¿No tienes cuenta?{" "}
              <span
                className="text-pink-600 font-semibold cursor-pointer"
                onClick={() => setModo("registro")}
              >
                Crear cuenta
              </span>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <span
                className="text-pink-600 font-semibold cursor-pointer"
                onClick={() => setModo("login")}
              >
                Iniciar sesión
              </span>
            </>
          )}
        </p>
      </motion.div>
    </motion.div>
  );
}

