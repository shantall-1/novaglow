import { Link } from 'react-router-dom';
import { useState } from 'react';
import CuponNovaGlow from '../layouts/Cupon'; 

const Inicio = () => {
  const [mostrarCupon, setMostrarCupon] = useState(false);

  const handleAbrirCupon = () => setMostrarCupon(true);
  const handleCerrarCupon = () => setMostrarCupon(false);
  const handleReclamarCupon = () => {
    console.log("Cupón reclamado");
    handleCerrarCupon();
  };

  return (
    <>
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4 transition-all duration-700">
        <div className="text-center max-w-4xl space-y-8">
          <h1 className="text-6xl font-black text-gray-800 leading-tight">
            Destella con <span className="text-pink-600">Nova Glow</span>
          </h1>

          <p className="text-xl text-gray-600">
            Encuentra tu outfit perfecto para la noche. Cada prenda está diseñada para hacerte la luz principal de cualquier evento.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/productos" 
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white text-xl font-bold py-4 px-10 rounded-full shadow-2xl transform transition duration-300 hover:scale-105"
            >
              Ver Catálogo Completo
            </Link>

            <button
              onClick={handleAbrirCupon}
              className="inline-block bg-white text-pink-600 border border-pink-500 hover:bg-pink-50 font-bold py-4 px-10 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
            >
              ✨ ¡Reclamar Oferta Secreta!
            </button>
          </div>

          <div className="pt-12 text-gray-400">
            <p>-- Espacio para Carrusel de Tendencias o Hero Visual --</p>
          </div>
        </div>
      </div>

      {/* Mostrar cupón solo cuando mostrarCupon = true */}
      {mostrarCupon && (
        <CuponNovaGlow 
          onClose={handleCerrarCupon} 
          onClaim={handleReclamarCupon} 
        />
      )}
    </>
  );
};

export default Inicio;