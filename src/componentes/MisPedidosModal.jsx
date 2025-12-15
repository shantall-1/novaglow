import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, ShoppingBag, CreditCard, Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MisPedidosModal = ({ isOpen, onClose }) => {
  const { usuario, obtenerPedidos } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar pedidos al abrir
  useEffect(() => {
    if (!usuario || !isOpen) return;

    const fetchPedidos = async () => {
      setCargando(true);
      try {
        const lista = await obtenerPedidos();
        setPedidos(lista);
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
      }
      setCargando(false);
    };

    fetchPedidos();
  }, [usuario, isOpen, obtenerPedidos]);

  if (!usuario) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 font-sans">
          
          {/* Backdrop Blur */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50 z-50 flex flex-col max-h-[85vh]"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* === FONDO ESTÉTICO (Orbes y Ruido) === */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-rose-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse delay-700"></div>
            </div>

            {/* HEADER FIXED */}
            <div className="relative z-10 p-8 pb-4 shrink-0">
                <button
                    className="absolute top-6 right-6 p-2.5 rounded-full bg-white/50 hover:bg-rose-50 text-gray-500 hover:text-rose-600 transition shadow-sm backdrop-blur-md cursor-pointer"
                    onClick={onClose}
                >
                    <X size={22} />
                </button>

                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 text-center leading-none">
                    MIS <span className="text-rose-500 font-serif italic">COMPRAS</span>
                </h2>
                <p className="text-center text-gray-500 text-sm mt-2 font-medium">
                    Historial de tus momentos fashion
                </p>
            </div>

            {/* CONTENIDO SCROLLABLE */}
            <div className="relative z-10 p-6 pt-0 overflow-y-auto custom-scrollbar flex-1">
                
                {/* Info Usuario (Tarjeta Resumen) */}
                <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white mb-6 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Datos de Envío</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500"><Package size={16}/></div>
                            <div>
                                <p className="font-bold text-gray-800">{usuario.displayName}</p>
                                <p className="text-gray-500 text-xs">{usuario.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500"><CreditCard size={16}/></div>
                            <div>
                                <p className="font-bold text-gray-800">Método de Pago</p>
                                <p className="text-gray-500 text-xs">{usuario.metodoPago || "No especificado"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Pedidos */}
                {cargando ? (
                     <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                        <p className="text-gray-400 font-medium text-sm">Buscando tus tesoros...</p>
                     </div>
                ) : pedidos.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <ShoppingBag size={24} />
                        </div>
                        <p className="text-gray-600 font-bold text-lg">Aún no tienes pedidos</p>
                        <p className="text-gray-400 text-sm mt-1">¡Es hora de llenar ese carrito!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pedidos.map((pedido) => (
                            <motion.div
                                key={pedido.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/70 backdrop-blur-sm border border-white p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-100 pb-3 mb-3 gap-2">
                                    <div className="flex items-center gap-2 text-rose-600 font-bold">
                                        <Package size={18} />
                                        <span className="text-sm">PEDIDO #{pedido.id.slice(0, 8).toUpperCase()}</span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg self-start md:self-auto">
                                        {/* Si tuvieras fecha, iría aquí. Por ahora un placeholder o nada */}
                                        Procesado
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {pedido.productos?.map((p, index) => (
                                        <div key={index} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 flex items-center justify-center bg-gray-100 text-gray-600 text-xs font-bold rounded-md">
                                                    {p.cantidad}
                                                </span>
                                                <span className="text-gray-700 font-medium">{p.name}</span>
                                            </div>
                                            {/* Si tuvieras precio unitario, iría aquí */}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Pagado</span>
                                    <span className="text-xl font-black text-gray-900">
                                        S/ {pedido.total?.toFixed(2) || "0.00"}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Footer decorativo (Gradient fade) */}
            <div className="h-6 bg-linear-to-t from-white to-transparent pointer-events-none absolute bottom-0 left-0 right-0 z-20 rounded-b-[2.5rem]"></div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body // Portal al body
  );
};

export default MisPedidosModal;