import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MisPedidosModal = ({ isOpen, onClose }) => {
  const { usuario, obtenerPedidos } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-6 w-96 relative border-4 border-pink-200 max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-pink-600"
              onClick={onClose}
            >
              <X size={22} />
            </button>

            <h2 className="text-3xl font-extrabold text-pink-600 mb-6 text-center">
              Mis Pedidos
            </h2>

            {/* Datos del usuario */}
            <div className="mb-4 p-4 bg-pink-50 rounded-xl border border-pink-200">
              <p><strong>Nombre:</strong> {usuario.displayName}</p>
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>Dirección:</strong> {usuario.direccion || "N/A"}</p>
              <p><strong>Método de pago:</strong> {usuario.metodoPago || "N/A"}</p>
            </div>

            {cargando ? (
              <p className="text-center text-gray-500">Cargando pedidos...</p>
            ) : pedidos.length === 0 ? (
              <p className="text-center text-gray-500">No tienes pedidos aún.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {pedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="border p-4 rounded-xl shadow hover:shadow-md transition"
                  >
                    <p className="font-semibold text-pink-600 mb-1">
                      Pedido ID: {pedido.id}
                    </p>
                    <p className="text-gray-700 mb-1">
                      Productos: {pedido.productos?.map(p => p.name).join(", ") || "N/A"}
                    </p>
                    <p className="text-gray-700 mb-1">
                      Cantidades: {pedido.productos?.map(p => p.cantidad).join(", ") || "N/A"}
                    </p>
                    <p className="text-gray-700 font-semibold">
                      Total: S/ {pedido.total?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MisPedidosModal;

