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
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden bg-linear-to-br from-rose-50 via-white to-pink-100 text-center">
        {/* efectos glow suaves */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,192,203,0.35),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,182,193,0.25),transparent_60%)]"></div>

        <div className="relative z-10 max-w-4xl px-6 space-y-8 animate-fadeIn">
          <h1 className="text-6xl sm:text-7xl font-extrabold text-gray-900 leading-tight">
            Destella con{" "}
            <span className="bg-linear-to-r from-rose-400 via-pink-400 to-rose-500 text-transparent bg-clip-text animate-pulse">
              Nova Glow
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Moda luminosa, delicada y chic. Prendas que reflejan tu luz interior con elegancia y sutileza.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/productos"
              className="bg-linear-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white text-lg sm:text-xl font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              Ver Catálogo Completo
            </Link>

            <button
              onClick={handleAbrirCupon}
              className="bg-white/90 text-rose-500 border border-rose-300 hover:bg-rose-50 font-bold py-4 px-10 rounded-full shadow-md backdrop-blur-md transition-transform hover:scale-105"
            >
              ✨ ¡Reclamar Oferta Secreta!
            </button>
          </div>

        </div>
      </section>


      {/* SECCIÓN 1: NUESTRA ESENCIA */}
      <section className="bg-white py-24 text-center px-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Tu Brillo. Nuestra Inspiración.</h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
          En <span className="text-rose-500 font-semibold">Nova Glow</span> creemos que la moda es más que vestir bien: es una forma de expresión, un lenguaje visual y una manera de iluminar cada espacio al que llegas.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              titulo: 'Diseño Contemporáneo',
              desc: 'Inspirados en las últimas tendencias internacionales, fusionamos elegancia y suavidad en cada pieza.',
            },
            {
              titulo: 'Detalles que Encantan',
              desc: 'Telas satinadas, tonos rosé y acabados que resaltan tu esencia más femenina.',
            },
            {
              titulo: 'Brilla con Propósito',
              desc: 'Cada prenda se elabora con materiales responsables y procesos éticos que respetan el entorno.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-8 bg-linear-to-b from-white to-rose-50 rounded-3xl shadow-lg hover:shadow-rose-200 transition-transform hover:-translate-y-2"
            >
              <h3 className="text-2xl font-semibold text-rose-600 mb-3">{item.titulo}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

{/* SECCIÓN 2: COLECCIÓN DESTACADA */}
<section className="relative py-24 bg-linear-to-br from-rose-50 via-white to-rose-100 text-center">
  <h2 className="text-4xl font-bold text-gray-800 mb-8">
    Colección <span className="text-rose-600">Glow Season 2025</span>
  </h2>

  <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
    Diseñada para mujeres que aman destacar con delicadeza: cortes fluidos, brillos sutiles y una energía elegante.
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
    {[
      'img/conjunto1.jpg',
      'img/conjunto2.jpg',
      'img/conjunto3.jpg',
      'img/conjunto4.jpg',
      'img/conjunto5.jpg',
      'img/conjunto6.jpg',
    ].map((img, i) => (
      <div
        key={i}
        className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-rose-200 transition-all duration-500"
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
        <img
          src={img}
          alt={`Producto Nova Glow ${i + 1}`}
          className="w-full aspect-4/5 object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
    ))}
  </div>

  <div className="mt-14">
    <Link
      to="/productos"
      className="inline-block bg-linear-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:scale-105 transition"
    >
      Explorar Colección Completa
    </Link>
  </div>
</section>


      {/* SECCIÓN 3: TESTIMONIOS */}
      <section className="bg-linear-to-r from-rose-100 via-pink-50 to-white py-24 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-12">✨ Voces que Brillan ✨</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
          {[
            { texto: '“Me sentí empoderada y radiante en mi gala. Nova Glow fue mi mejor elección.”', nombre: 'Camila R.' },
            { texto: '“El detalle y la calidad son incomparables. Se nota el amor detrás de cada prenda.”', nombre: 'Valeria G.' },
            { texto: '“Compré un vestido para mi cumpleaños y fue un sueño. ¡Brillaba toda la noche!”', nombre: 'Sofía L.' },
          ].map((t, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 shadow-md hover:shadow-rose-200 transition-transform hover:-translate-y-2">
              <p className="text-gray-700 italic mb-4">{t.texto}</p>
              <h4 className="font-semibold text-rose-600">{t.nombre}</h4>
            </div>
          ))}
        </div>
      </section>

    {/* SECCIÓN FINAL */}
<section className="bg-white text-center py-24 relative overflow-hidden">
  {/* halo glow sutil */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,182,193,0.15),transparent_70%)]"></div>

  <div className="relative z-10">
    <h2 className="text-5xl font-extrabold mb-6 text-rose-500">
      Sé la Luz del Evento 🌟
    </h2>
    <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600">
      Únete a la comunidad Nova Glow y descubre lo que significa vestir con
      confianza, elegancia y energía positiva.
    </p>

    <Link
      to="/productos"
      className="inline-block bg-white border-2 border-rose-400 text-rose-500 font-bold py-4 px-10 rounded-full shadow-md hover:bg-rose-50 hover:shadow-rose-100 transition-transform hover:scale-105 duration-300"
    >
      Brillar Ahora
    </Link>
  </div>
</section>


      {/* CUPÓN POPUP */}
      {mostrarCupon && (
        <CuponNovaGlow onClose={handleCerrarCupon} onClaim={handleReclamarCupon} />
      )}
    </>
  );
};

export default Inicio;
