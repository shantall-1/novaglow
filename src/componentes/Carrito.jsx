import { useState, useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { registrarParticipaciones } from "../lib/registrarParticipaciones";

import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, User, MapPin, Mail, Phone } from "lucide-react";

export default function Carrito() {
  const {
    carrito,
    eliminarDelCarrito,
    actualizarCantidad,
    actualizarTalla,
    total,
    vaciarCarrito,
  } = useCarrito();
  const { usuario, guardarDatosPedido } = useAuth();
  const navigate = useNavigate();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    direccion: "",
    metodoPago: "",
    numeroTarjeta: "",
    numeroTelefono: "",
  });

  const [procesando, setProcesando] = useState(false);

  // ✅ CORRECCIÓN: Se usa usuario?.uid para evitar bucles infinitos 
  // y solo carga si el formulario está vacío para no sobreescribir mientras el usuario escribe.
  useEffect(() => {
    if (usuario && formData.email === "") {
      setFormData((prev) => ({
        ...prev,
        nombre: usuario.displayName || "",
        email: usuario.email || "",
        direccion: usuario.direccion || "",
      }));
    }
  }, [usuario?.uid]); // Solo se dispara si cambia el ID del usuario

  const handleEditarTalla = (item) => {
    if (!item.talla) {
      alert("Este producto no tiene talla.");
      return;
    }

    const nuevaTalla = prompt(
      "Ingresa la nueva talla (S, M, L, XL):",
      item.talla
    );

    if (!nuevaTalla) return;

    // Actualizamos la talla (ahora el contexto guardará en Firebase también)
    actualizarTalla(item.id, nuevaTalla.toUpperCase());
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const manejarPago = async (e) => {
    e.preventDefault();
    if (!usuario) {
      alert("Debes iniciar sesión para completar el pago");
      return;
    }

    setProcesando(true);

    try {
      const pedidoFinal = {
        nombre: formData.nombre,
        email: formData.email,
        direccion: formData.direccion,
        metodoPago: formData.metodoPago,
        numeroTarjeta: formData.metodoPago === "Tarjeta" ? formData.numeroTarjeta : null,
        numeroTelefono: formData.metodoPago === "Yape" ? formData.numeroTelefono : null,
        productos: carrito,
        total,
        fecha: new Date().toISOString()
      };

      console.log("🔥 Guardando pedido:", pedidoFinal);
      await guardarDatosPedido(pedidoFinal);

// 🔥 REGISTRAR PARTICIPACIONES DEL SORTEO
await registrarParticipaciones(carrito, usuario);

// 🧹 limpiar carrito
vaciarCarrito();

// ✅ ir a confirmación
navigate("/confirmacion");

    } catch (err) {
      console.error("❌ Error al guardar pedido:", err);
      alert("Error al guardar el pedido: " + err.message);
    } finally {
      setProcesando(false);
    }
  };

  const Background = () => (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse delay-700"></div>
    </div>
  );

  if (carrito.length === 0) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 font-sans overflow-hidden bg-white">
        <Background />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center bg-white/60 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl border border-white max-w-lg w-full"
        >
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShoppingBag size={40} className="text-rose-400" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-gray-900 mb-2">OOPS!</h2>
          <p className="text-gray-500 font-medium mb-8">Tu carrito está esperando brillar.</p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-full transition-transform hover:scale-105 shadow-lg"
          >
            <ArrowLeft size={18} /> Volver a la tienda
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative font-sans overflow-x-hidden bg-white pb-20 pt-24 md:pt-28">
      <Background />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
           <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-[0.9]">
             TU <span className="text-rose-500 font-serif italic">CARRITO</span>
           </h2>
           <p className="text-gray-500 mt-4 font-medium">Estás a un paso de verte increíble.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-5">
            <AnimatePresence>
              {carrito.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="flex flex-col sm:flex-row items-center gap-6 bg-white/70 backdrop-blur-md p-4 pr-6 rounded-4xl shadow-sm border border-white hover:shadow-lg transition-all"
                >
                  <div className="w-full sm:w-28 h-28 shrink-0 bg-gray-100 rounded-2xl overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 text-center sm:text-left w-full">
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">{item.name}</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase mt-1">{item.category}</p>
                      </div>
                      <p className="hidden sm:block font-black text-xl text-gray-900">${(item.price * item.cantidad).toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-start gap-6 mt-4">
                      {item.category === "ropa" && (
                        <button
                          onClick={() => handleEditarTalla(item)}
                          className="text-rose-500 text-xs font-bold underline hover:text-rose-700"
                        >
                          Talla: {item.talla || "S"} (Editar)
                        </button>
                      )}
                      
                      <div className="flex items-center bg-white border border-gray-200 rounded-full px-1 py-1">
                        <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"><Minus size={14}/></button>
                        <span className="w-8 text-center font-bold">{item.cantidad}</span>
                        <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)} className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded-full"><Plus size={14}/></button>
                      </div>

                      <button onClick={() => eliminarDelCarrito(item.id)} className="text-red-400 hover:text-red-600 ml-auto">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1 lg:sticky lg:top-28">
            <motion.div layout className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white">
              <h3 className="text-2xl font-black mb-6 border-b pb-4">RESUMEN</h3>
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-gray-500 font-medium"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
                <div className="flex justify-between text-green-500 font-bold"><span>Envío</span><span>Gratis</span></div>
                <div className="flex justify-between text-2xl font-black pt-4 border-t mt-2"><span>TOTAL</span><span>${total.toFixed(2)}</span></div>
              </div>

              {!mostrarFormulario ? (
                <button onClick={() => setMostrarFormulario(true)} className="w-full py-4 bg-gray-900 text-white font-bold rounded-full text-lg shadow-xl hover:scale-[1.02] transition-all">
                  Proceder al Pago →
                </button>
              ) : (
                <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={manejarPago} className="space-y-4">
                  <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/><input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={manejarCambio} required className="w-full pl-12 pr-4 py-3 border rounded-xl text-sm" /></div>
                  <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/><input type="email" name="email" placeholder="Email" value={formData.email} onChange={manejarCambio} required className="w-full pl-12 pr-4 py-3 border rounded-xl text-sm" /></div>
                  <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/><input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={manejarCambio} required className="w-full pl-12 pr-4 py-3 border rounded-xl text-sm" /></div>
                  
                  <select name="metodoPago" value={formData.metodoPago} onChange={manejarCambio} required className="w-full px-4 py-3 border rounded-xl text-sm bg-white">
                    <option value="">Método de Pago</option>
                    <option value="Tarjeta">Tarjeta de Crédito</option>
                    <option value="Yape">Yape / Plin</option>
                    <option value="Efectivo">Contra entrega</option>
                  </select>

                  {formData.metodoPago === "Tarjeta" && <input type="text" name="numeroTarjeta" placeholder="Número de Tarjeta" onChange={manejarCambio} required className="w-full px-4 py-3 border rounded-xl text-sm" />}
                  
                  {formData.metodoPago === "Yape" && (
                    <div className="text-center space-y-2">
                      <input type="text" name="numeroTelefono" placeholder="Número Celular" onChange={manejarCambio} required className="w-full px-4 py-3 border rounded-xl text-sm" />
                      <p className="text-xs font-bold text-gray-500">Escanea el QR:</p>
                      <img src="/qr-yape.jpeg" alt="QR" className="w-32 h-32 mx-auto rounded-lg" />
                    </div>
                  )}

                  <div className="pt-4 flex flex-col gap-3">
                    <button type="submit" disabled={procesando} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg disabled:opacity-50">
                      {procesando ? "Procesando..." : `Pagar $${total.toFixed(2)}`}
                    </button>
                    <button type="button" onClick={() => setMostrarFormulario(false)} className="text-gray-400 text-xs font-bold uppercase text-center">Cancelar</button>
                  </div>
                </motion.form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}