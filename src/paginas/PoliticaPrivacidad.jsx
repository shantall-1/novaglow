// src/pages/PoliticaPrivacidad.jsx
import { Link } from 'react-router-dom';
import { ChevronLeft, Shield, User, Lock } from 'lucide-react'; 
import { motion } from 'framer-motion';

const PoliticaPrivacidad = () => {
    // Fecha de última actualización ficticia
    const lastUpdated = "16 de Diciembre de 2025";

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
                    <div className="inline-flex items-center gap-2 text-rose-500 mb-2">
                        <Shield size={28} /> 
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-4">
                        Política de <span className="text-rose-600 italic font-serif">Privacidad</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Tu seguridad es nuestra prioridad. Última Actualización: {lastUpdated}
                    </p>
                </header>

                {/* Contenido de la Política de Privacidad */}
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-pink-100 text-gray-700 space-y-12">
                    
                    <p className="text-lg font-medium border-l-4 border-rose-200 pl-4">
                        En Nova Glow, nos comprometemos a proteger su privacidad. Esta política describe cómo recopilamos, utilizamos y compartimos su información personal.
                    </p>

                    {/* Sección 1: Información Recopilada */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 border-b border-pink-100 pb-2">
                            <User size={20} className="text-rose-500"/> 1. Información que Recopilamos
                        </h2>
                        <p>
                            Recopilamos información que usted nos proporciona directamente cuando realiza una compra, se registra para una cuenta o se suscribe a nuestro boletín.
                        </p>
                        <ul className="list-disc list-inside space-y-2 pl-4 text-sm text-gray-600">
                            <li><b>Datos de Identificación:</b> Nombre, dirección de correo electrónico, dirección de envío y facturación.</li>
                            <li><b>Datos de Pago:</b> Información de su tarjeta de crédito o débito (gestionada por pasarelas de pago seguras de terceros, no almacenada directamente por nosotros).</li>
                            <li><b>Datos de Uso:</b> Información sobre cómo utiliza nuestro sitio web (ej. productos vistos, historial de pedidos).</li>
                        </ul>
                    </section>
                    
                    {/* Sección 2: Uso de la Información */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 border-b border-pink-100 pb-2">
                            <Lock size={20} className="text-rose-500"/> 2. ¿Cómo Utilizamos su Información?
                        </h2>
                        <p>
                            Utilizamos los datos recopilados para los siguientes fines:
                        </p>
                        <ul className="list-disc list-inside space-y-2 pl-4 text-sm text-gray-600">
                            <li>Procesar y gestionar sus pedidos y transacciones.</li>
                            <li>Enviar notificaciones sobre el estado de su pedido.</li>
                            <li>Mejorar nuestros productos y servicios a través del análisis de tendencias de compra.</li>
                            <li>Enviar correos de marketing y promociones (siempre con su consentimiento).</li>
                        </ul>
                    </section>

                    {/* Sección 3: Cookies y Tecnologías de Seguimiento */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 border-b border-pink-100 pb-2">
                            <Shield size={20} className="text-rose-500"/> 3. Cookies
                        </h2>
                        <p>
                            Nuestro sitio utiliza <b>cookies</b> para mejorar su experiencia de usuario. Una cookie es un pequeño archivo que solicita permiso para ser colocado en el disco duro de su ordenador. Una vez que acepta, el archivo se añade y la cookie ayuda a analizar el tráfico web o le permite saber cuándo visita un sitio en particular.
                        </p>
                        <p className="text-sm text-gray-600 italic">
                            Usted puede optar por aceptar o rechazar las cookies. La mayoría de los navegadores aceptan automáticamente las cookies, pero usted puede modificar la configuración de su navegador para rechazarlas si lo prefiere.
                        </p>
                    </section>
                    
                    {/* Sección Final: Contacto */}
                    <div className="mt-10 pt-6 border-t border-pink-100 text-center">
                         <p className="text-sm text-gray-500">
                            Si tiene preguntas sobre esta política o desea ejercer sus derechos, puede contactarnos a través de 
                            <a href="mailto:privacidad@novaglow.com" className="text-rose-500 font-bold hover:text-rose-700 transition ml-1">privacidad@novaglow.com</a>.
                         </p>
                    </div>

                </div>

            </motion.div>
        </div>
    );
};

export default PoliticaPrivacidad;