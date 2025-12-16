// src/pages/EnviosYDevoluciones.jsx
import { Link } from 'react-router-dom';
// Corregido: ArrowRight ha sido añadido aquí.
import { ChevronLeft, Box, RefreshCw, Truck, Home, ArrowRight } from 'lucide-react'; 
import { motion } from 'framer-motion';

const EnviosYDevoluciones = () => {
    return (
        <div className="bg-[#FFF5F7] min-h-screen pt-24 pb-20 font-sans">
            
            {/* Ruido Sutil (Mantenemos la estética) */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 max-w-5xl mx-auto px-4"
            >
                {/* Botón de Regreso */}
                <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-600 hover:text-rose-600 transition mb-10">
                    <ChevronLeft size={16} /> Volver a Inicio
                </Link>

                {/* Encabezado Principal */}
                <header className="text-center mb-16 border-b border-pink-200 pb-8">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-4">
                        <span className="text-rose-600 italic font-serif">Envío</span> & Devolución
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                        Toda la información que necesitas para recibir tus productos Nova Glow sin complicaciones.
                    </p>
                </header>

                {/* Grid de Secciones */}
                <div className="grid md:grid-cols-2 gap-12">
                    
                    {/* Sección 1: Envíos */}
                    <div className="space-y-8 p-8 bg-white rounded-3xl shadow-xl border border-pink-100">
                        <div className="flex items-center gap-4 text-rose-600">
                            <Truck size={30} strokeWidth={2.5} />
                            <h2 className="text-3xl font-black tracking-tight text-gray-900">
                                Proceso de Envío
                            </h2>
                        </div>
                        <div className="space-y-6 text-gray-700">
                            <p className="font-medium text-lg border-l-4 border-rose-200 pl-4">
                                Enviamos a todo el Perú y la mayoría de países de Latinoamérica. ¡Tu estilo no tiene fronteras!
                            </p>
                            
                            <ul className="list-disc list-inside space-y-3 pl-2 text-base">
                                <li><b>Tiempo de Procesamiento:</b> 1-2 días hábiles.</li>
                                <li><b>Envíos Nacionales (Perú):</b> 3-5 días hábiles (S/ 15.00). Gratis en pedidos mayores a S/ 200.</li>
                                <li><b>Envíos Express (Lima Metropolitana):</b> 24 horas hábiles (S/ 25.00).</li>
                                <li><b>Envíos Internacionales:</b> 7-14 días hábiles. (Tarifa calculada al checkout).</li>
                            </ul>
                            
                            <p className="text-sm text-gray-500 italic">
                                Recibirás un correo electrónico con tu número de seguimiento tan pronto como tu paquete sea despachado.
                            </p>
                        </div>
                    </div>

                    {/* Sección 2: Devoluciones */}
                    <div className="space-y-8 p-8 bg-white rounded-3xl shadow-xl border border-pink-100">
                        <div className="flex items-center gap-4 text-rose-600">
                            <RefreshCw size={30} strokeWidth={2.5} />
                            <h2 className="text-3xl font-black tracking-tight text-gray-900">
                                Política de Devolución
                            </h2>
                        </div>
                        <div className="space-y-6 text-gray-700">
                            <p className="font-medium text-lg border-l-4 border-rose-200 pl-4">
                                Si no estás 100% satisfecha, te facilitamos el proceso de cambio o devolución.
                            </p>
                            
                            <ul className="list-disc list-inside space-y-3 pl-2 text-base">
                                <li><b>Plazo:</b> Tienes 30 días calendario desde la recepción de tu pedido.</li>
                                <li><b>Condición:</b> Los artículos deben estar sin usar, sin lavar, con etiquetas originales.</li>
                                <li><b>Reembolsos:</b> Se procesarán dentro de 7 días hábiles tras la recepción y revisión del artículo.</li>
                                <li><b>Artículos no elegibles:</b> Prendas íntimas, bikinis y artículos en liquidación final.</li>
                            </ul>
                            
                            <Link to="/contacto" className="inline-flex items-center gap-2 text-rose-500 font-bold text-sm hover:text-rose-700 transition">
                                <Box size={16} /> Iniciar Proceso de Devolución
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Preguntas Frecuentes / Info Adicional */}
                <div className="mt-16 text-center p-8 bg-pink-50/50 border border-pink-100 rounded-3xl">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">¿Tienes más preguntas?</h3>
                    <p className="text-gray-600 mb-6">
                        Nuestro equipo de soporte Nova Glow está listo para ayudarte en lo que necesites.
                    </p>
                    <Link to="/contacto" className="inline-flex items-center gap-2 bg-rose-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-rose-700 transition-colors">
                        Contáctanos ahora <ArrowRight size={18} />
                    </Link>
                </div>

            </motion.div>
        </div>
    );
};

export default EnviosYDevoluciones;