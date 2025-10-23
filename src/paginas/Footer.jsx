// Footer.jsx
import React from 'react';
import { Mail, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        // CAMBIO: Fondo oscuro (bg-gray-800) a rosa pálido (bg-pink-100)
        // CAMBIO: Texto principal (text-white) a oscuro (text-gray-900)
        <footer className="bg-pink-100 text-gray-900 rounded-3xl p-10 mt-12">
            
            {/* CAMBIO: El borde ahora es un tono de rosa más oscuro */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-pink-200 pb-8 mb-8">

                {/* Columna 1: Logo/Marca */}
                <div className="space-y-3 col-span-2 md:col-span-1">
                    {/* Mantenemos el fucsia (rosa intenso) de tu marca para el logo */}
                    <h3 className="text-2xl font-bold text-pink-500 font-sans">Nova Glow</h3>
                    
                    {/* CAMBIO: Texto secundario (text-gray-400) a más oscuro (text-gray-600) */}
                    <p className="text-sm text-gray-600">
                        Encendiendo tu confianza, una prenda a la vez. Moda con propósito.
                    </p>
                    <div className="flex space-x-4 pt-2">
                        {/* CAMBIO: Iconos (text-gray-400) a (text-gray-600), con hover fucsia */}
                        <a href="#" className="text-gray-600 hover:text-pink-500 transition"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-600 hover:text-pink-500 transition"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-600 hover:text-pink-500 transition"><Mail className="w-5 h-5" /></a>
                    </div>
                </div>

                {/* Columna 2: Inspiración y Blog */}
                <div>
                    {/* CAMBIO: Título (text-white) a (text-gray-900) */}
                    <h4 className="font-semibold text-gray-900 mb-4">Descubre</h4>
                    <ul className="space-y-2 text-sm">
                        {/* CAMBIO: Links (text-gray-400) a (text-gray-600) con hover fucsia */}
                        <li><Link to="/blog-inspiracion" className="text-gray-600 hover:text-pink-500 transition">Blog / Inspiración</Link></li>
                        <li><Link to="/guia-estilo" className="text-gray-600 hover:text-pink-500 transition">Guía de Estilo</Link></li>
                        <li><Link to="/tendencias-noche" className="text-gray-600 hover:text-pink-500 transition">Tendencias de Noche</Link></li>
                    </ul>
                </div>

                {/* Columna 3: Información y Ayuda */}
                <div>
                    {/* CAMBIO: Título (text-white) a (text-gray-900) */}
                    <h4 className="font-semibold text-gray-900 mb-4">Descubre</h4>
                    <ul className="space-y-2 text-sm">
                         {/* CAMBIO: Links (text-gray-400) a (text-gray-600) con hover fucsia */}
                        <li>
                            <Link to="/Blog-Inspiracion" className="text-gray-600 hover:text-pink-500 transition">
                                Blog / Inspiración
                            </Link>
                        </li>
                        <li>
                            <Link to="/Guia" className="text-gray-600 hover:text-pink-500 transition">
                                Guía de Estilo
                            </Link>
                        </li>
                        <li>
                            <Link to="/Tendencias-Noche" className="text-gray-600 hover:text-pink-500 transition">
                                Tendencias de Noche
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Columna 4: Novedades / Newsletter */}
                <div className="col-span-2 md:col-span-1">
                    {/* CAMBIO: Título (text-white) a (text-gray-900) */}
                    <h4 className="font-semibold text-gray-900 mb-4">Novedades (Newsletter)</h4>
                    
                    {/* CAMBIO: Párrafo (text-gray-400) a (text-gray-600) */}
                    <p className="text-sm text-gray-600 mb-3">
                        Sé la primera en saber sobre nuevas colecciones y ofertas exclusivas.
                    </p>
                    <div className="flex">
                        <input
                            type="email"
                            placeholder="Tu email"
                            // El input ahora es fondo blanco, texto oscuro
                            className="p-2 rounded-l-lg text-gray-900 bg-white w-full focus:ring-pink-500 focus:border-pink-500"
                        />
                        {/* El botón se mantiene fucsia (rosa intenso) */}
                        <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold p-2 rounded-r-lg transition">
                            Suscribir
                        </button>
                    </div>
                </div>
            </div>

            {/* Derechos de autor */}
            {/* CAMBIO: Copyright (text-gray-500) a (text-gray-600) */}
            <div className="text-center text-gray-600 text-xs">
                © {new Date().getFullYear()} Nova Glow. Todos los derechos reservados.
            </div>
        </footer>
    );
};

export default Footer;