// Footer.jsx
import React from 'react';
import { Mail, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";


// El componente Footer ya no necesita el prop 'font-script' 
// ya que asumo que lo tienes configurado globalmente.

const Footer = () => {
    return (
        // El div contenedor del footer
        <footer className="bg-gray-800 text-white rounded-3xl p-10 mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-8">

                {/* Columna 1: Logo/Marca */}
                <div className="space-y-3 col-span-2 md:col-span-1">
                    {/* Usa la clase font-script que definiste en tailwind.config.js */}
                    <h3 className="text-2xl font-bold text-fuchsia-400 font-sans">Nova Glow</h3>
                    <p className="text-sm text-gray-400">
                        Encendiendo tu confianza, una prenda a la vez. Moda con propósito.
                    </p>
                    <div className="flex space-x-4 pt-2">
                        <a href="#" className="text-gray-400 hover:text-fuchsia-400 transition"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-fuchsia-400 transition"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-fuchsia-400 transition"><Mail className="w-5 h-5" /></a>
                    </div>
                </div>

                {/* Columna 2: Inspiración y Blog */}
            <div>
                    <a href="/Blog-Inspiracion" className="font-semibold mb-4 text-white hover:underline">Descubre</a>
                    <ul className="mt-4 space-y-3 text-sm">
                        {/* Usamos <Link> con la ruta definida en App.jsx */}
                        <li><Link to="/blog-inspiracion" className="text-gray-400 hover:text-fuchsia-300 transition">Inspiración</Link></li>
                        <li><Link to="/guia-estilo" className="text-gray-400 hover:text-fuchsia-300 transition">Guía de Estilo</Link></li>
                        <li><Link to="/tendencias-noche" className="text-gray-400 hover:text-fuchsia-300 transition">Tendencias de Noche</Link></li>
                    </ul>
                </div>


                {/* Columna 3: Información y Ayuda */}
                <div>
                    <h4 className="font-semibold text-white mb-4">Descubre</h4>
                    <ul className="space-y-2 text-sm">
                        {/* Usando el nombre del archivo JSX como ruta */}
                        <li>
                            <Link to="/Blog-Inspiracion" className="text-gray-400 hover:text-fuchsia-300 transition">
                                Blog / Inspiración
                            </Link>
                        </li>
                        <li>
                            <Link to="/Guia" className="text-gray-400 hover:text-fuchsia-300 transition">
                                Guía de Estilo
                            </Link>
                        </li>
                        <li>
                            <Link to="/Tendencias-Noche" className="text-gray-400 hover:text-fuchsia-300 transition">
                                Tendencias de Noche
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Columna 4: Novedades / Newsletter */}
                <div className="col-span-2 md:col-span-1">
                    <h4 className="font-semibold text-white mb-4">Novedades (Newsletter)</h4>
                    <p className="text-sm text-gray-400 mb-3">
                        Sé la primera en saber sobre nuevas colecciones y ofertas exclusivas.
                    </p>
                    <div className="flex">
                        <input
                            type="email"
                            placeholder="Tu email"
                            className="p-2 rounded-l-lg text-gray-700 w-full focus:ring-fuchsia-500 focus:border-fuchsia-500"
                        />
                        <button className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-semibold p-2 rounded-r-lg transition">
                            Suscribir
                        </button>
                    </div>
                </div>
            </div>

            {/* Derechos de autor */}
            <div className="text-center text-gray-500 text-xs">
                © {new Date().getFullYear()} Nova Glow. Todos los derechos reservados.
            </div>
        </footer>
    );
};

export default Footer; // Exportamos el componente para usarlo