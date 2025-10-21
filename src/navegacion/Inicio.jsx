
import { Link } from 'react-router-dom';

const Inicio = () => {
  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="text-center max-w-4xl space-y-8">
        <h1 className="text-6xl font-black text-gray-800 leading-tight">
          Destella con <span className="text-pink-600">Nova Glow</span>
        </h1>
        <p className="text-xl text-gray-600">
          Encuentra tu outfit perfecto para la noche. Cada prenda está diseñada para hacerte la luz principal de cualquier evento.
        </p>
        <Link to="/productos" className="inline-block bg-pink-500 hover:bg-pink-600 text-white text-xl font-bold py-4 px-10 rounded-full shadow-2xl transform transition duration-300 hover:scale-105">
          Ver Catálogo Completo
        </Link>
        <div className="mt-12 text-gray-400">
          {/* Espacio para elementos visuales inmersivos */}
          <p>-- Espacio para Carrusel de Tendencias o Hero Visual --</p>
        </div>
      </div>
    </div>
  );
};

export default Inicio;