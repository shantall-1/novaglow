import { useState, useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, User, MapPin, Mail, Phone } from "lucide-react";

export default function Carrito() {
  const {
    carrito,
    eliminarDelCarrito,
    actualizarCantidad,
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

  // Cargar datos del usuario
  useEffect(() => {
    if (usuario) {
      setFormData((prev) => ({
        ...prev,
        nombre: usuario.displayName || "",
        email: usuario.email || "",
        direccion: usuario.direccion || "",
      }));
    }
  }, [usuario]);

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
      };

      console.log("🔥 Guardando pedido:", pedidoFinal);
      await guardarDatosPedido(pedidoFinal);
      vaciarCarrito();
      navigate("/confirmacion");
    } catch (err) {
      console.error("❌ Error al guardar pedido:", err);
      alert("Error al guardar el pedido: " + err.message);
    }
    setProcesando(false);
  };

  // --- FONDO ANIMADO REUTILIZABLE ---
  const Background = () => (
    <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-pulse delay-700"></div>
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-pink-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 hidden md:block"></div>
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
          <h2 className="text-4xl font-black tracking-tighter text-gray-900 mb-2">
            OOPS!
          </h2>
          <p className="text-gray-500 font-medium mb-8">
            Tu carrito está esperando brillar.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-full transition-transform hover:scale-105 shadow-lg hover:shadow-rose-500/20"
          >
            <ArrowLeft size={18} /> Volver a la tienda
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative font-sans overflow-x-hidden bg-white selection:bg-rose-200 selection:text-rose-900 pb-20 pt-24 md:pt-28">
      <Background />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-12">
           <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-[0.9]">
              TU <span className="text-rose-500 font-serif italic">CARRITO</span>
           </h2>
           <p className="text-gray-500 mt-4 font-medium">Estás a un paso de verte increíble.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* --- LISTA DE PRODUCTOS (Izquierda) --- */}
            <div className="lg:col-span-2 space-y-5">
              <AnimatePresence>
                {carrito.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex flex-col sm:flex-row items-center gap-6 bg-white/70 backdrop-blur-md p-4 pr-6 rounded-4xl shadow-sm border border-white hover:shadow-lg transition-all group"
                  >
                    {/* Imagen */}
                    <div className="w-full sm:w-28 h-28 shrink-0 bg-gray-100 rounded-2xl overflow-hidden relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left w-full">
                        <div className="flex justify-between items-start w-full">
                           <div>
                              <h3 className="font-bold text-xl text-gray-900">{item.name}</h3>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{item.category}</p>
                           </div>
                           <p className="hidden sm:block font-black text-xl text-gray-900">${(item.price * item.cantidad).toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-start gap-6 mt-4">
                            <p className="sm:hidden font-black text-xl text-gray-900">${(item.price * item.cantidad).toFixed(2)}</p>
                            
                            {/* Controles Cantidad */}
                            <div className="flex items-center bg-white border border-gray-200 rounded-full px-1 py-1 shadow-sm">
                                <button 
                                    onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-8 text-center font-bold text-gray-700">{item.cantidad}</span>
                                <button 
                                    onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-gray-900 hover:bg-black rounded-full text-white transition"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            <button 
                                onClick={() => eliminarDelCarrito(item.id)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-colors ml-auto sm:ml-0"
                                title="Eliminar"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>


            {/* --- RESUMEN Y PAGO (Derecha Sticky) --- */}
            <div className="lg:col-span-1 lg:sticky lg:top-28">
                <motion.div 
                    layout
                    className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white/60"
                >
                    <h3 className="text-2xl font-black tracking-tighter text-gray-900 mb-6 border-b border-gray-100 pb-4">
                        RESUMEN
                    </h3>

                    <div className="space-y-3 mb-8">
                        <div className="flex justify-between text-gray-500 font-medium">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 font-medium">
                            <span>Envío</span>
                            <span className="text-green-500 font-bold">Gratis</span>
                        </div>
                        <div className="flex justify-between text-2xl font-black text-gray-900 pt-4 border-t border-gray-100 mt-2">
                            <span>TOTAL</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {!mostrarFormulario ? (
                        <button
                            onClick={() => setMostrarFormulario(true)}
                            className="group relative w-full py-4 bg-gray-900 text-white font-bold rounded-full text-lg overflow-hidden shadow-xl transition-all hover:scale-[1.02] hover:shadow-rose-500/20"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Proceder al Pago <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                            <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-gray-800"></div>
                        </button>
                    ) : (
                        /* FORMULARIO DE PAGO ESTILIZADO */
                        <motion.form 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            onSubmit={manejarPago}
                            className="space-y-4 overflow-hidden"
                        >
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center my-4">Datos de Envío</h4>

                            {/* Nombre */}
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Nombre Completo"
                                    value={formData.nombre}
                                    onChange={manejarCambio}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-sm font-medium transition-all"
                                />
                            </div>

                            {/* Email */}
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Correo Electrónico"
                                    value={formData.email}
                                    onChange={manejarCambio}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-sm font-medium transition-all"
                                />
                            </div>

                            {/* Dirección */}
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="direccion"
                                    placeholder="Dirección de entrega"
                                    value={formData.direccion}
                                    onChange={manejarCambio}
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-sm font-medium transition-all"
                                />
                            </div>

                            {/* Método de Pago */}
                            <div className="pt-2">
                                <select
                                    name="metodoPago"
                                    value={formData.metodoPago}
                                    onChange={manejarCambio}
                                    required
                                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-sm font-medium text-gray-600 cursor-pointer appearance-none"
                                >
                                    <option value="">Selecciona Método de Pago</option>
                                    <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                                    <option value="Yape">Yape / Plin</option>
                                    <option value="Efectivo">Pago contra entrega</option>
                                </select>
                            </div>

                            {/* Campos Condicionales */}
                            {formData.metodoPago === "Tarjeta" && (
                                <div className="relative group animate-in fade-in slide-in-from-top-2">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        name="numeroTarjeta"
                                        placeholder="Número de Tarjeta"
                                        value={formData.numeroTarjeta}
                                        onChange={manejarCambio}
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-sm font-medium"
                                    />
                                </div>
                            )}

 {/* CAMPOS SOLO SI YAPE */}
          {formData.metodoPago === "Yape" && (
            <div className="space-y-3">
              <input
                type="text"
                name="numeroTelefono"
                placeholder="Número de teléfono"
                value={formData.numeroTelefono}
                onChange={manejarCambio}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <div className="text-center">
                <p className="font-semibold text-gray-700 mb-2">Escanea el QR para pagar:</p>
                <img
                  src="/qr-yape.jpeg"
                  alt="QR Yape"
                  className="w-40 h-40 mx-auto rounded-lg shadow"
                />
              </div>
            </div>
          )}

                            <div className="pt-4 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={procesando}
                                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
                                >
                                    {procesando ? "Procesando..." : `Pagar $${total.toFixed(2)}`}
                                </button>
                                
                                <button 
                                    type="button"
                                    onClick={() => setMostrarFormulario(false)}
                                    className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-600"
                                >
                                    Cancelar
                                </button>
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