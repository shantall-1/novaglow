
import { Mail, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import Suscripcion from "./Suscripcion";


const Footer = () => {
    return (

        <footer className="bg-pink-100 text-gray-900 p-10 justify-center">


            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-b border-pink-200 pb-8 mb-8">


                <div className="space-y-3 col-span-2 md:col-span-1">

                    <h3 className="text-2xl font-bold text-pink-500 font-sans">Nova Glow</h3>


                    <p className="text-sm text-gray-600">
                        Encendiendo tu confianza, una prenda a la vez. Moda con propósito.
                    </p>
                    <div className="flex space-x-4 pt-2">

                        <a href="#" className="text-gray-600 hover:text-pink-500 transition"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-600 hover:text-pink-500 transition"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-600 hover:text-pink-500 transition"><Mail className="w-5 h-5" /></a>
                    </div>
                </div>


                <div>

                    <h4 className="font-semibold text-gray-900 mb-4">Descubre</h4>
                    <ul className="space-y-2 text-sm">

                        <li><Link to="/blog-inspiracion" className="text-gray-600 hover:text-pink-500 transition">Blog / Inspiración</Link></li>
                        <li><Link to="/guia-estilo" className="text-gray-600 hover:text-pink-500 transition">Guía de Estilo</Link></li>
                        <li><Link to="/tendencias-noche" className="text-gray-600 hover:text-pink-500 transition">Tendencias de Noche</Link></li>
                    </ul>
                </div>



                <div className="col-span-2 md:col-span-1">

                    <h4 className="font-semibold text-gray-900 mb-4">Novedades (Newsletter)</h4>


                    <p className="text-sm text-gray-600 mb-3">
                        Sé la primera en saber sobre nuevas colecciones y ofertas exclusivas.
                    </p>
                    <div className="flex">
                        <Suscripcion minimal={true} />
                    </div>
                </div>
            </div>

            <div className="text-center text-gray-600 text-xs">
                © {new Date().getFullYear()} Nova Glow. Todos los derechos reservados.
            </div>
        </footer>
    );
};

export default Footer;