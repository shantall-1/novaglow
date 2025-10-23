import { useState } from 'react';
import { Zap, Heart, Sparkles, Star } from "lucide-react";

import SubscriptionNovaGlow from '../layouts/Suscripcion';
import BlogInspiraciones from '../descubre/Blog-Inspiracion'


// --- Componente para Tarjetas de Contenido (reutilizable) ---
const ContentCard = ({ title, description, imageUrl, linkText = 'Ver Detalle' }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl border border-gray-100">
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-48 object-cover"
      onError={(e) => e.target.src = "https://via.placeholder.com/300x200?text=NovaGlow"} // Fallback URL
    />
    <div className="p-4">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
      <a href="./BlogInspiraciones" className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-800 transition">
        {linkText}
        <svg className="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </a>
    </div>
  </div>
);

const Principio = ({ title, icon, description }) => (
  // Se mantiene el color rosa, pero se podría usar un borde dorado (ej: border-yellow-500) para más lujo
  <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-pink-500">
    <div className="text-4xl mb-3 flex justify-center">{icon === '✨' ? <Sparkles className="w-8 h-8 text-yellow-500" /> : icon === '📏' ? <Zap className="w-8 h-8 text-blue-500" /> : <Heart className="w-8 h-8 text-red-500" />}</div>
    <h3 className="text-xl font-sans text-pink-600 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{description}</p>
  </div>
);

// Componente auxiliar para el equipo
const TeamMember = ({ name, role, tagline, imageUrl }) => (
  <div className="flex flex-col items-center max-w-[150px] p-4 bg-white rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-pink-50">
    <img
      src={imageUrl}
      alt={name}
      className="w-32 h-32 object-cover rounded-full border-4 border-pink-300 mb-3 shadow-lg"
      onError={(e) => (e.target.src = "https://placehold.co/150x150/cccccc/000?text=Team")}
    />
    <h3 className="text-xl font-bold text-gray-800">{name}</h3>
    <p className="text-pink-600 font-semibold text-sm mb-2">{role}</p>
    <p className="text-gray-600 text-center text-xs italic">"{tagline}"</p>
  </div>
);


// --- 3. VISTA NOSOTROS (Principal) ---
export default function Nosotros() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleOpenSubscription = () => {
    setShowSubscriptionModal(true);
  };

  const handleCloseSubscription = () => {
    // En un caso real, podrías querer agregar lógica aquí (ej: trackear el cierre)
    setShowSubscriptionModal(false);
  };

  const handleClaimSubscription = () => {
    // Lógica a ejecutar cuando la suscripción es exitosa (ej: mostrar un toast)
    console.log("Suscripción reclamada o confirmada en el modal.");
  };


  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">

      {/* HEADER DRAMÁTICO */}
      <header className="text-center py-14 rounded-3xl shadow-2xl mb-12 bg-linear-to-br from-purple-900 to-pink-700">
        <h1 className="text-5xl font-bold text-white mb-3">
          Nuestra Historia: El Viaje Nova Glow
        </h1>
        <p className="text-xl font-sans text-pink-300">
          Moda con Propósito y Pasión
        </p>
      </header>

      {/* 1. Narrativa Inmersiva: La Visión */}
      <section className="bg-pink-100 p-8 rounded-3xl shadow-xl mb-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-sans text-gray-800">
            La Noche en que Todo Comenzó
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nova Glow nació de una simple necesidad: transformar la ropa de noche. No buscábamos solo tela y lentejuelas, sino prendas que encendieran la confianza. Creemos que cada mujer merece sentirse la luz principal de la fiesta.
          </p>
        </div>

        {/* Bloque de Imagen Destacada */}
        <div className="mt-6 h-64 rounded-2xl overflow-hidden shadow-xl">
          <img
            src="https://png.pngtree.com/thumb_back/fh260/background/20230425/pngtree-multi-toned-clothing-on-hangers-image_2556296.jpg"
            alt="Una mujer en un vestido brillante de noche"
            className="w-full h-full object-cover transition duration-300 hover:scale-105"
          />
        </div>
      </section>

      {/* 2. Transparencia: Nuestros Principios (Cuadrícula de 3 columnas) */}
      <section className="
                grid grid-cols-1 md:grid-cols-3
                gap-8
                text-center
                mb-12
                max-w-7xl mx-auto
            ">

        {/* Título: Ocupa las 3 columnas */}
        <h2 className="col-span-full text-3xl font-extrabold text-pink-700 mb-4 md:mb-8">
          Nuestros Principios
        </h2>

        
        <div className="p-3 bg-gray-100 rounded-xl">
          <Principio
            title="Brillo Sostenible"
            icon="✨"
            description="Diseñamos con responsabilidad, priorizando materiales duraderos y procesos éticos para un glamour sin culpa."
          />
        </div>

        <div className="p-3 bg-gray-100 rounded-xl">
          <Principio
            title="Ajuste Perfecto"
            icon="📏"
            description="Cada pieza pasa por rigurosas pruebas de ajuste para asegurar que te sientas cómoda y espectacular toda la noche."
          />
        </div>

        <div className="p-3 bg-gray-100 rounded-xl">
          <Principio
            title="Confianza Instantánea"
            icon="❤️"
            description="Nuestra misión es simple: al ponerte Nova Glow, la confianza se activa al instante. Vendemos protagonismo."
          />
        </div>

      </section>

      {/* 3. Equipo Detrás del Glamour */}
      <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-12">
        <h2 className="text-3xl font-extrabold text-pink-700 text-center mb-8">
          Conoce al Equipo Detrás del Glamour
        </h2>
        {/* Nota: Cambié el bg-gray-90 a bg-white en TeamMember para mejor contraste */}
        <div className="flex justify-center space-x-12 flex-wrap gap-8">
          <TeamMember
            name="Valentina C."
            role="Fundadora & CEO"
            tagline="Mi pieza favorita para brillar es un buen top de satín."
            imageUrl="https://images.imagenmia.com/model_version/1df843cb6790d0651e956078c93e0f37a1535300950019cc576ef7b8cc5d62a5/1723977778333-output.jpg"
          />
          <TeamMember
            name="Leo C."
            role="Directora de Marketing"
            tagline="La confianza es el mejor accesorio que una mujer puede llevar."
            imageUrl="https://img.freepik.com/fotos-premium/imagen-mujer-entregando-paquete-fondo-impactante-diseno-limpio-sonrisa-feliz-fondo-pastel_934697-178.jpg"
          />
          <TeamMember
            name="Camila C."
            role="Jefa de Diseño"
            tagline="Siempre inspirada por la luz de la ciudad a medianoche."
            imageUrl="https://images.pexels.com/photos/19279369/pexels-photo-19279369.jpeg?cs=srgb&dl=pexels-s%C6%A1n-ng%E1%BB%8Dc-19279369.jpg&fm=jpg"
          />
          <TeamMember
            name="Hylary R."
            role="Gerente de Producción"
            tagline="Cada detalle cuenta cuando se trata de crear magia."
            imageUrl="https://img.freepik.com/fotos-premium/retrato-mujer-hermosa-sonriente-feliz_176420-15309.jpg"
          />
        </div>
      </section>

      {/* 4. Sección de Misión y Compromiso (Layout Split Screen) */}
      <section className="grid md:grid-cols-2 gap-12 items-center mb-12">
        <div>
          <h2 className="text-3xl font-sans text-gray-800 mb-4 flex items-center gap-2"><Heart className="w-6 h-6 text-red-500" /> Nuestra Misión</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Somos una marca impulsada por la creencia de que la moda de fiesta debe empoderar. Nuestro compromiso es con la calidad, la transparencia y con hacerte sentir única en cada evento.
          </p>
          <p className="text-gray-700 leading-relaxed font-sans font-bold">
            ¡En Nova Glow, eres la estrella!
          </p>
        </div>
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="https://finartsa.com/wp-content/uploads/2023/05/WhatsApp-Image-2023-05-31-at-11.29.03-AM.jpeg"
            alt="Nuestra Misión Visual"
            className="w-full h-full object-cover transition duration-500 hover:scale-105"
          />
        </div>
      </section>

      {/* 4. Sección de VISIÓN (Layout Split Screen - Invertida) */}
      <section className="grid md:grid-cols-2 gap-12 items-center mb-12">
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl order-2 md:order-1">
          <img
            src="https://conciencia.eco/wp-content/uploads/2024/03/Estilo-y-Conciencia-Vestido-Ecologico-Tenido-con-Tintes-Naturales-768x768.jpg"
            alt="Nuestra Visión Visual"
            className="w-full h-full object-cover transition duration-500 hover:scale-105"
          />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-3xl font-sans text-gray-800 mb-4 flex items-center gap-2"><Star className="w-8 h-8 text-yellow-500" />
            Nuestra Visión
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Liderar la evolución de la moda de fiesta hacia un futuro transparente y sostenible, siendo la elección predilecta de la mujer moderna que busca piezas de calidad excepcional que reflejen su poder interior en cada celebración.
          </p>
          <p className="text-gray-700 leading-relaxed font-sans font-bold">
            ¡Eres grandiosa!
          </p>
        </div>
      </section>

      {/* 5. Sección de Novedades y Tendencias (Mini-Galería Horizontal) */}
      <section className="py-12 md:py-16 mt-12 bg-gray-50 rounded-3xl shadow-inner">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
          El Estilo Comienza Aquí
        </h2>
        <p className="text-center text-gray-600 mb-10 text-lg max-w-2xl mx-auto">
          Nuestra pasión por la noche va más allá del vestido. Descubre nuestras últimas ideas sobre moda, estilo y el arte de brillar.
        </p>

        {/* Layout de 3 Columnas para las tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
          {/* Tarjeta 1: Blog/Artículos */}
          <ContentCard
            title="[Blog] El Poder del Negro"
            description="Analizamos por qué el 'Little Black Dress' nunca pasará de moda y cómo reinventarlo."
            imageUrl="https://invitadisima.com/41684-home_default/vestido-de-fiesta-largo-con-cuerpo-plisado-y-falda-de-tul.jpg"
            linkText="Leer Artículo"
          />

          {/* Tarjeta 2: Tendencias */}
          <ContentCard
            title="[Tendencia] Lentejuelas 'Quiet Luxury'"
            description="Te mostramos la tendencia de las lentejuelas sutiles y elegantes para esta temporada de eventos."
            imageUrl="https://bridalroomboutique.com/wp-content/uploads/2021/06/falda-entallada-hasta-el-suelo-abertura-lateral-en-la-pierna-venezuela-evening-dress-boutique-vestidos-fiesta-largos-lentejuelas.jpg"
            linkText="Ver Tendencia"
          />

          {/* Tarjeta 3: Guías/Consejos */}
          <ContentCard
            title="[Guía] El Accesorio Perfecto"
            description="Descubre cómo elegir el bolso y las joyas ideales para complementar tu look de noche."
            imageUrl="https://cdn-0.somosmamas.com.ar/wp-content/uploads/2018/12/shutterstock_535898149.jpg"
            linkText="Descargar Guía"
          />
        </div>
      </section>
      {/* Sección de Novedades y Tendencias (Mini-Galería Horizontal) */}
      <section className="py-12 md:py-16 mt-12 bg-gray-50 rounded-3xl shadow-inner">
        {/* ... contenido ... */}
        {/* CTA al final de la sección */}
        <div className="text-center mt-12">
          <a href="./BlogInspiraciones" className="bg-fuchsia-700 hover:bg-fuchsia-900 text-white font-bold py-3 px-8 rounded-full shadow-xl transition-transform transform hover:scale-105 inline-block">
            Explora el Universo Nova Glow (Ver Blog Completo)
          </a>
        </div>
      </section>

      {/* 6. CTA de Suscripción (Llamada al Modal) */}
      <section className="mt-12 py-16 px-8 bg-gray-900 rounded-3xl text-center shadow-2xl border-b-8 border-pink-600">
        <Sparkles className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
        <h2 className="text-4xl font-extrabold text-white mb-3">
          No te Pierdas Ningún Brillo
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Suscríbete a nuestro boletín exclusivo. Sé la primera en conocer las nuevas colecciones, tendencias de lujo y ventas privadas.
        </p>

        <div className="text-center mt-12 flex flex-col md:flex-row justify-center items-center gap-4">
          <button
            onClick={handleOpenSubscription}
            className="inline-block bg-white text-pink-600 border border-pink-500 hover:bg-pink-50 font-bold py-4 px-10 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
          >
            ✨ ¡Reclamar Oferta Secreta!
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Prometemos no saturar tu bandeja. Lee nuestra Política de Privacidad.
        </p>
      </section>

      {/* 7. MODAL DE SUSCRIPCIÓN (Condicional) */}
      {showSubscriptionModal && (
        <SubscriptionNovaGlow
          onClose={handleCloseSubscription}
          onClaim={handleClaimSubscription}
        />
      )}
    </div>
  );
}