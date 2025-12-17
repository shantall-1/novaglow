import { Mail, Instagram, Twitter, Facebook, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Suscripcion from "./Suscripcion";

const Footer = () => {
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] text-white pt-20 pb-6 relative overflow-hidden font-sans selection:bg-pink-500 selection:text-white">
        
        {/* --- FONDO ATMOSFÉRICO --- */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-pink-900/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            {/* 1. GRID PRINCIPAL */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 border-b border-white/10 pb-12">
                
                {/* Columna 1: Marca & Social (Ocupa 4 columnas) */}
                <div className="md:col-span-4 space-y-6">
                    <Link to="/" onClick={scrollToTop} className="inline-block">
                        <span className="text-3xl font-bold font-[Dancing Script] bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                            NovaGlow
                        </span>
                    </Link>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                        Encendiendo tu confianza, una prenda a la vez. Moda con propósito, diseño con alma y brillo sostenible.
                    </p>
                    
                    <div className="flex gap-4 pt-2">
                        {[Instagram, Twitter, Facebook, Mail].map((Icon, i) => (
                            <a 
                                key={i} 
                                href="#" 
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Columna 2: Enlaces (Ocupa 2 columnas) */}
                <div className="md:col-span-2">
                    <h4 className="font-bold text-white mb-6">Descubre</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li>
                            <Link to="/inspiracion" onClick={scrollToTop} className="hover:text-pink-500 transition-colors flex items-center gap-2 group">
                                Blog & Galería <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </li>
                        <li>
                            <Link to="/inspiracion?tema=Guia" onClick={scrollToTop} className="hover:text-pink-500 transition-colors">Guía de Estilo</Link>
                        </li>
                        <li>
                            <Link to="/inspiracion?tema=Tendencias" onClick={scrollToTop} className="hover:text-pink-500 transition-colors">Tendencias 2025</Link>
                        </li>
                          <li>
                            <Link to="/inspiracion?tema=Inspiracion" onClick={scrollToTop} className="hover:text-pink-500 transition-colors">Inspiracion</Link>
                        </li>
                        <li>
                            <Link to="/productos" onClick={scrollToTop} className="hover:text-pink-500 transition-colors">Catálogo</Link>
                        </li>
                    </ul>
                </div>

                {/* Columna 3: Legal/Ayuda (Ocupa 2 columnas) */}
                <div className="md:col-span-2">
                    <h4 className="font-bold text-white mb-6">Ayuda</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><Link to="/contacto" onClick={scrollToTop} className="hover:text-pink-500 transition-colors">Contáctanos</Link></li>
                        <li><Link to="/envios-y-devoluciones" onClick={scrollToTop} className="hover:text-pink-500 transition-colors">Envíos y Devoluciones</Link></li>
                        <li><Link to="/terminos-y-condiciones" onClick={scrollToTop} className="hover:text-pink-500 transition-colors">Términos y Condiciones</Link></li>
                        <li><Link to="/politica-de-privacidad" onClick={scrollToTop} className="hover:text-pink-500 transition-colors">Política de Privacidad</Link></li>
                    </ul>
                </div>

                {/* Columna 4: Newsletter (Ocupa 4 columnas) */}
                <div className="md:col-span-4 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                    <h4 className="font-bold text-white mb-2">Únete al Club Glow</h4>
                    <p className="text-gray-400 text-xs mb-4">
                        Recibe ofertas secretas y las últimas tendencias directamente en tu inbox.
                    </p>
                    {/* Reutilizamos tu componente Suscripcion en modo minimal */}
                    <div className="footer-input-override">
                        <Suscripcion minimal={true} />
                    </div>
                </div>
            </div>

            {/* 2. FIRMA MASIVA (FOOTER INFERIOR) */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div className="text-gray-600 text-xs font-medium">
                    © {new Date().getFullYear()} Nova Glow Inc. <br className="hidden md:block" /> Designed to Shine.
                </div>
                
                {/* Texto Gigante Decorativo */}
                <h1 className="text-[12vw] leading-[0.8] font-black text-white/5 select-none pointer-events-none absolute bottom-[-2vw] left-1/2 -translate-x-1/2 w-full text-center whitespace-nowrap tracking-tighter">
                    NOVA GLOW
                </h1>
            </div>
        </div>

        {/* Estilos CSS inline para forzar el input del componente Suscripcion a verse bien en oscuro */}
        <style>{`
            .footer-input-override input {
                background-color: rgba(0,0,0,0.3) !important;
                border-color: rgba(255,255,255,0.1) !important;
                color: white !important;
            }
            .footer-input-override input:focus {
                border-color: #ec4899 !important;
            }
            .footer-input-override button {
                background-color: white !important;
                color: black !important;
            }
            .footer-input-override button:hover {
                background-color: #ec4899 !important;
                color: white !important;
            }
        `}</style>
    </footer>
  );
};

export default Footer;  