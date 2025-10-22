import { useState } from "react";
import { Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight, Gift, Eye, Zap, X } from "lucide-react";

// Se agrega 'onClose' y 'initialView' como props
export default function Layout1({ onClose, initialView = 'form' }) {
    const Navigate = useNavigate();
    // Utilizamos 'view' para cambiar entre el carrusel y el formulario
    const [view, setView] = useState(initialView);
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email && email.includes('@')) {
            console.log(`Email de Suscripción capturado: ${email}`);
            setIsSubscribed(true);
            // Aquí NO cerramos el modal, mostramos el mensaje de éxito
        } else {
            alert("Por favor, introduce un correo electrónico válido.");
        }
    };

    // Datos para el Carrusel de Beneficios (Simulado)
    const benefits = [
        { icon: <Gift className="w-8 h-8 text-pink-500" />, title: "Acceso VIP", desc: "Obtén pre-acceso a colecciones y ventas privadas." },
        { icon: <Eye className="w-8 h-8 text-purple-500" />, title: "Tendencias Exclusivas", desc: "Guías de estilo y el 'Glow Report' antes que nadie." },
        { icon: <Zap className="w-8 h-8 text-yellow-500" />, title: "Ofertas Únicas", desc: "Descuentos solo disponibles para suscriptores." },
    ];


    return (
        <AnimatePresence>
            <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-40 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center p-4"
            >
                <Motion.div
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 50 }}
                    transition={{ duration: 0.4, type: "spring", damping: 15, stiffness: 100 }}
                    className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 border-t-8 border-fuchsia-500 relative"
                >
                    {/* Botón de Cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <AnimatePresence mode="wait">
                        {/* --- VISTA 1: CARRUSEL DE BENEFICIOS (InitialView) --- */}
                        {view === 'benefits' && (
                            <Motion.div
                                key="benefits"
                                initial={{ x: -300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 300, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                className="pt-4"
                            >
                                <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
                                    ¡Esto es lo que te espera en Nova Glow!
                                </h2>

                                {/* Lista de Beneficios */}
                                <div className="space-y-6">
                                    {benefits.map((b, index) => (
                                        <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg shadow-sm">
                                            <div className="mr-4 mt-1">{b.icon}</div>
                                            <div>
                                                <h3 className="font-bold text-xl text-gray-800">{b.title}</h3>
                                                <p className="text-gray-600">{b.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Botón para pasar al formulario de suscripción */}
                                <button
                                    onClick={() => setView('form')}
                                    className="mt-8 w-full bg-fuchsia-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-fuchsia-700 transition flex items-center justify-center gap-2"
                                >
                                    ¡Sí, quiero mi brillo exclusivo! <ArrowRight className="w-5 h-5" />
                                </button>
                            </Motion.div>
                        )}

                        {/* --- VISTA 2: FORMULARIO DE SUSCRIPCIÓN --- */}
                        {view === 'form' && !isSubscribed && (
                            <Motion.div
                                key="form"
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                className="pt-4"
                            >
                                <Zap className="w-8 h-8 text-fuchsia-600 mx-auto mb-4" />
                                <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-2">
                                    Último Paso: ¿Dónde te enviamos las novedades?
                                </h2>
                                <p className="text-gray-600 text-center mb-6">
                                    Introduce tu email y sella tu pase al círculo exclusivo de Nova Glow.
                                </p>

                                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 mb-6">
                                    <input
                                        type="email"
                                        placeholder="Tu email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-2 p-3 rounded-xl border-2 border-gray-300 focus:border-fuchsia-500 transition"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                                    >
                                        <Mail className="w-5 h-5" /> Suscribirme
                                    </button>
                                </form>

                                <button
                                    onClick={() => setView('benefits')}
                                    className="mt-4 text-sm text-gray-500 hover:text-fuchsia-600 transition"
                                >
                                    {"<"} Volver a los beneficios
                                </button>
                            </Motion.div>
                        )}

                        {/* --- VISTA 3: MENSAJE DE ÉXITO --- */}
                        {isSubscribed && (
                            <Motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                className="text-center py-6"
                            >
                                <Mail className="w-16 h-16 text-fuchsia-600 mx-auto mb-4" />
                                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                                    ¡Bienvenida a la Comunidad Glow!
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Revisa tu bandeja de entrada para confirmar tu suscripción y empezar a recibir tus beneficios.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="mt-8 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg"
                                >
                                    Continuar Navegando
                                </button>
                            </Motion.div>
                        )}
                    </AnimatePresence>
                </Motion.div>
            </Motion.div>
        </AnimatePresence>

     
    );
}