import { Link } from 'react-router-dom';
import { useState } from 'react';
import CuponNovaGlow from '../layouts/Cupon';

const Inicio = () => {
  const [mostrarCupon, setMostrarCupon] = useState(false);

  const handleAbrirCupon = () => setMostrarCupon(true);
  const handleCerrarCupon = () => setMostrarCupon(false);

  return (
    <div className="overflow-x-hidden bg-white selection:bg-rose-200 selection:text-rose-900 font-sans">
      
      {/* CAPA DE RUIDO (Textura suave de fondo) */}
      <div className="bg-noise fixed inset-0 z-50 pointer-events-none opacity-[0.03]"></div>

      {/* ==========================================================================
         1. HERO SECTION (El que tú pediste: Dreamy & Bold)
      ========================================================================== */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        {/* Fondo animado abstracto */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse delay-700"></div>
          <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] bg-pink-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50"></div>
        </div>

        <div className="relative z-10 max-w-5xl space-y-6">
          <span className="inline-block py-1 px-4 rounded-full border border-rose-300 bg-white/50 backdrop-blur-sm text-rose-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm animate-bounce">
            New Collection 2025
          </span>
          
          <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-gray-900 via-rose-900 to-gray-900 tracking-tighter leading-[0.9]">
            NOVA <br />
            <span className="italic font-serif text-rose-500 hover:text-rose-400 transition-colors cursor-default">GLOW</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-light">
            Moda que no solo se viste, se <span className="font-semibold text-rose-500">siente</span>. 
            Refleja tu luz interior con nuestra colección más fresca.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mt-8">
            <Link
              to="/productos"
              className="group relative px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg overflow-hidden shadow-xl transition-all hover:scale-105 hover:shadow-rose-500/25"
            >
              <span className="relative z-10 group-hover:text-rose-200 transition">Ver Catálogo</span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-gray-800/50"></div>
            </Link>

            <button
              onClick={handleAbrirCupon}
              className="px-8 py-4 bg-white/40 backdrop-blur-md border border-white text-rose-600 font-bold rounded-full text-lg shadow-lg transition-all hover:bg-white hover:scale-105"
            >
              🎁 Oferta Secreta
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================================================
         2. CINTA MARQUEE (Texto corriendo)
      ========================================================================== */}
      <div className="py-6 bg-black rotate-1 scale-105 shadow-xl border-y-4 border-white relative z-20">
        <div className="flex animate-marquee gap-12 whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
             <span key={i} className="text-3xl md:text-5xl font-black text-white tracking-widest flex items-center gap-12">
                NOVA GLOW <span className="text-rose-500 font-serif italic text-4xl">est. 2025</span>
                <span className="text-transparent stroke-white text-outline-white">BE BOLD</span> 
             </span>
          ))}
        </div>
      </div>

      {/* ==========================================================================
         3. COLECCIÓN "PICK YOUR MOOD" (Diseño de tarjetas limpias/Grid)
         Basado en tu imagen: image_494e19.jpg
      ========================================================================== */}
      <section className="py-24 px-4 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
            {/* Cabecera de Sección */}
            <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-4">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900">
                    PICK YOUR <br/> <span className="text-rose-500">MOOD</span>
                </h2>
                <Link to="/productos" className="hidden md:block text-lg border-b-2 border-black pb-1 font-bold hover:text-rose-500 hover:border-rose-500 transition">
                    Ver todo →
                </Link>
            </div>

            {/* Grid de 4 tarjetas (Party, Casual, Chic, Accessories) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Fiesta', img: 'public/img/conjunto3.jpg' }, 
                    { title: 'Casual', img: 'public/img/conjunto5.jpg' },
                    { title: 'Chic', img: 'public/img/conjunto6.jpg' },
                    { title: 'Accesorios', img: 'public/img/accesorios.jpg' },
                ].map((cat, idx) => (
                    <div key={idx} className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500">
                        {/* Imagen de fondo */}
                        <img 
                            src={cat.img} 
                            alt={cat.title} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        
                        {/* Overlay degradado suave */}
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/60 opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        
                        {/* Contenido flotante abajo */}
                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-white/95 backdrop-blur-md p-4 rounded-3xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="font-bold text-gray-900 text-lg">{cat.title}</span>
                            <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm group-hover:bg-rose-500 transition-colors">
                                ➜
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
                <Link to="/productos" className="text-lg font-bold underline">Ver todo el catálogo</Link>
            </div>
        </div>
      </section>


      {/* ==========================================================================
         4. REVIEWS SOCIAL PROOF (Diseño Animado y Limpio)
         Basado en tu imagen: image_494d5d.jpg
      ========================================================================== */}
      <section className="py-32 px-6 bg-[#FAFAFA] relative overflow-hidden">
          {/* Fondo decorativo sutil */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-rose-50 to-transparent pointer-events-none"></div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
              
              {/* IZQUIERDA: Textos y Avatares */}
              <div>
                  <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                      Ellas ya están <br/>
                      <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-400 to-purple-500">brillando.</span>
                  </h2>
                  <p className="text-xl text-gray-500 mb-10 font-light max-w-md">
                    No es solo ropa, es una actitud. Únete a las chicas que ya encontraron su luz.
                  </p>
                  
                  {/* Avatares superpuestos */}
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-5">
                        {[1,2,3,4].map((i) => (
                            <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-gray-300 overflow-hidden shadow-md">
                                <img src={`https://i.pravatar.cc/150?img=${i+20}`} alt="User" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <div className="w-14 h-14 rounded-full border-4 border-white bg-black text-white flex items-center justify-center font-bold text-sm shadow-md">
                            +500
                        </div>
                    </div>
                  </div>
              </div>

              {/* DERECHA: Tarjetas Flotantes (Animación suave) */}
              <div className="relative flex flex-col gap-6">
                  
                  {/* Review 1 - @sofia_style */}
                  <div className="bg-white p-8 rounded-4xl shadow-lg border border-gray-100 transform hover:-translate-y-2 transition-transform duration-300 relative animate-float">
                      <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-xl">S</div>
                          <div>
                            <span className="font-bold text-gray-900 block">@sofia_style</span>
                            <div className="flex text-yellow-400 text-xs">★★★★★</div>
                          </div>
                      </div>
                      <p className="text-gray-600 font-medium">
                        "Literalmente obsesionada con la tela. Es súper suave y el fit es perfecto. 10/10 ✨"
                      </p>
                  </div>
                  
                  {/* Review 2 - @valery.g (Desplazada hacia la derecha) */}
                  <div className="bg-white p-8 rounded-4xl shadow-lg border border-gray-100 transform md:translate-x-12 hover:-translate-y-2 transition-transform duration-300 animate-float" style={{ animationDelay: '1s' }}>
                      <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 font-bold text-xl">V</div>
                          <div>
                            <span className="font-bold text-gray-900 block">@valery.g</span>
                            <div className="flex text-yellow-400 text-xs">★★★★★</div>
                          </div>
                      </div>
                      <p className="text-gray-600 font-medium">
                        "Llegó súper rápido y el empaque es hermoso. Me sentí como una influencer abriendo mi paquete."
                      </p>
                  </div>
              </div>
          </div>
      </section>


      {/* ==========================================================================
         5. NEWSLETTER / FOOTER (Oscuro y Minimalista)
      ========================================================================== */}
      <section className="py-32 bg-black text-white text-center relative overflow-hidden">
        {/* Glow rojo sutil al fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.3),transparent_70%)] animate-pulse"></div>
        
        <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
                DON'T MISS <br/> THE <span className="text-rose-500 italic font-serif">GLOW</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-10 text-lg">
                Únete a la lista VIP. Drops exclusivos y descuentos secretos.
            </p>
            
            <form className="max-w-md mx-auto flex gap-2 relative bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/20">
                <input 
                    type="email" 
                    placeholder="tu@email.com" 
                    className="w-full bg-transparent border-none rounded-full px-6 py-3 focus:outline-none text-white placeholder:text-gray-500"
                />
                <button className="bg-white text-black rounded-full px-8 py-3 font-bold hover:bg-rose-500 hover:text-white transition-colors shadow-lg">
                    Unirse
                </button>
            </form>
        </div>
        
        <div className="mt-20 pt-10 border-t border-gray-900 text-gray-600 text-sm font-bold tracking-widest uppercase">
            © 2025 Nova Glow. All Rights Reserved.
        </div>
      </section>

      {/* CUPÓN POPUP */}
      {mostrarCupon && (
        <CuponNovaGlow onClose={handleCerrarCupon} onClaim={handleCerrarCupon} />
      )}
    </div>
  );
};

export default Inicio;