// src/pages/TerminosYCondiciones.jsx
import { Link } from 'react-router-dom';
import { ChevronLeft, Scale, Gavel, FileText } from 'lucide-react'; 
import { motion } from 'framer-motion';

const TerminosYCondiciones = () => {
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
                        <Scale size={24} /> 
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-4">
                        Términos <span className="text-rose-600 italic font-serif">Legales</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Última Actualización: {lastUpdated}
                    </p>
                </header>

                {/* Contenido de Términos y Condiciones */}
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-pink-100 text-gray-700 space-y-10">
                    
                    <p className="text-lg font-medium border-l-4 border-rose-200 pl-4">
                        Bienvenido a Nova Glow. Al acceder o utilizar nuestro sitio web, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso.
                    </p>

                    {/* Sección 1: Uso del Sitio Web */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 border-b border-pink-100 pb-2">
                            <FileText size={20} className="text-rose-500"/> 1. Uso del Sitio Web
                        </h2>
                        <p>
                            El contenido de las páginas de este sitio web es para su información general y uso exclusivo. Está sujeto a cambios sin previo aviso. Ni nosotros ni terceros ofrecemos garantía alguna en cuanto a la exactitud, actualidad, rendimiento o idoneidad de la información y materiales encontrados u ofrecidos en este sitio para cualquier propósito particular.
                        </p>
                        <ul className="list-disc list-inside space-y-2 pl-4 text-sm text-gray-600">
                            <li>El uso de cualquier información o material en este sitio web es bajo su propio riesgo.</li>
                            <li>Usted es responsable de asegurar que cualquier producto, servicio o información disponible a través de este sitio web cumpla con sus requisitos específicos.</li>
                        </ul>
                    </section>
                    
                    {/* Sección 2: Propiedad Intelectual */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 border-b border-pink-100 pb-2">
                            <Gavel size={20} className="text-rose-500"/> 2. Propiedad Intelectual
                        </h2>
                        <p>
                            Este sitio web contiene material que es propiedad o tiene licencia de Nova Glow, incluyendo, pero no limitado a, el diseño, el *layout*, el aspecto, la apariencia y los gráficos. La reproducción está prohibida salvo de conformidad con la nota de copyright.
                        </p>
                        <p className="text-sm text-gray-600 italic">
                            Todas las marcas reproducidas en este sitio web que no son propiedad o licenciadas al operador son reconocidas.
                        </p>
                    </section>

                    {/* Sección 3: Precios y Pedidos */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 border-b border-pink-100 pb-2">
                            <FileText size={20} className="text-rose-500"/> 3. Precios y Condiciones de Pedido
                        </h2>
                        <p>
                            Los precios de nuestros productos están sujetos a cambios sin previo aviso. Nos reservamos el derecho de modificar o interrumpir el Servicio (o cualquier parte o contenido del mismo) sin previo aviso en cualquier momento. No seremos responsables ante usted ni ante ningún tercero por cualquier modificación, cambio de precio, suspensión o interrupción del Servicio.
                        </p>
                        <p>
                            Nos reservamos el derecho de rechazar cualquier pedido que realice con nosotros. Podemos, a nuestro exclusivo criterio, limitar o cancelar las cantidades compradas por persona, por hogar o por pedido.
                        </p>
                    </section>

                    {/* Sección Final: Contacto */}
                    <div className="mt-10 pt-6 border-t border-pink-100 text-center">
                         <p className="text-sm text-gray-500">
                            Para cualquier pregunta relacionada con estos Términos y Condiciones, por favor contáctenos a través de 
                            <a href="mailto:legal@novaglow.com" className="text-rose-500 font-bold hover:text-rose-700 transition ml-1">legal@novaglow.com</a>.
                         </p>
                    </div>

                </div>

            </motion.div>
        </div>
    );
};

export default TerminosYCondiciones;