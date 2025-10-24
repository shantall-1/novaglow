import React from 'react';
import { Zap, Heart, Sparkles, Feather, Sun, Eye, Star, Aperture } from "lucide-react";
import { Link } from 'react-router-dom';
import BlogInspiracion from './Blog-Inspiracion';

const ContentCard = ({ title, description, imageUrl, linkText = 'Ver Detalle' }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl border border-gray-100">
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-48 object-cover"
      onError={(e) => e.target.src = "https://placehold.co/600x400/feeae9/f06c9b?text=GLOW"}
    />
    <div className="p-4">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
      <a href="#" className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-800 transition">
        {linkText}
        <svg className="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </a>
    </div>
  </div>
);
// --- Componente CategoryPromoCard (CORREGIDO: Manejo de Color Dinámico) ---
const CategoryPromoCard = ({ title, icon: Icon, color, link, description, imageUrl }) => (
  // Usamos fuchsia de forma fija para las clases que Tailwind no puede escanear dinámicamente,
  // o aseguramos que los colores se usen como clase completa.
  <div className={`bg-white rounded-xl shadow-lg border-t-4 border-${color}-400 transition duration-300 transform hover:scale-[1.03] hover:shadow-2xl overflow-hidden`}>
    {/* Imagen o Relleno de Ícono */}
    {imageUrl ? (
      <div className="h-40 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => (e.target.src = "https://placehold.co/600x400/feeae9/f06c9b?text=GLOW")}
        />
      </div>
    ) : (
      // Usamos color dinámico aquí para el fondo del ícono grande
      <div className={`h-40 w-full flex items-center justify-center bg-${color}-50`}>
        {Icon && <Icon className={`w-16 h-16 text-${color}-600`} />}
      </div>
    )}

    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      {/* Usamos color dinámico para el enlace */}
      <Link to={link} className={`text-sm font-semibold text-${color}-600 hover:text-${color}-800 transition`}>
        Ver {title} →
      </Link>
    </div>
  </div>
);

// Componente auxiliar para los principios
const Principio = ({ title, icon, description }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-pink-500">
    <div className="text-4xl mb-3 flex justify-center">{icon === '✨' ? <Sparkles className="w-8 h-8 text-yellow-500" /> : icon === '📏' ? <Zap className="w-8 h-8 text-blue-500" /> : <Heart className="w-8 h-8 text-red-500" />}</div>
    <h3 className="text-xl font-sans text-pink-600 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{description}</p>
  </div>
);

// Componente auxiliar para el equipo

const TeamMember = ({ name, role, tagline, imageUrl }) => (
  <div className="flex flex-col items-center max-w-[150px] p-4 bg-gray-50 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-pink-50">
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

// --- 3. VISTA NOSOTROS (Corregido para aceptar 'setPage' y fusionado el contenido) ---
export default function Nosotros() {
  return (

    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="text-center py-24 rounded-3xl shadow-2xl mb-16 relative overflow-hidden 
                        bg-fuchsia-900 border-b-8 border-pink-400">

        {/* Fondo abstracto y dinámico */}
        <div className="absolute inset-0 bg-cover opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517400030501-1e9671d4cc0c?q=80&w=2070&auto=format&fit=crop')" }}>
        </div>

        <div className="relative z-10">
          <p className="text-lg font-semibold uppercase text-pink-300 mb-2 flex justify-center items-center">
            {/* 🚨 CORREGIDO: Usando Aperture o Feather */}
            <Aperture className="w-5 h-5 mr-2 animate-spin-slow" /> Moda con Propósito y Pasión
          </p>

          <h1 className="text-6xl font-extrabold text-white mb-4 tracking-tight animate-fade-in">
            El Viaje Nova Glow
          </h1>
          <p className="text-xl font-light text-gray-200 max-w-3xl mx-auto transition-all duration-700 hover:text-white">
            Nuestra historia es la fusión perfecta entre diseño de alta costura y la búsqueda de la confianza interior.
          </p>
        </div>
      </header>

      {/* 1. Narrativa Inmersiva: La Visión (Contenido nuevo) */}
      <section className="bg-pink-100 p-8 rounded-3xl shadow-xl mb-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-sans text-gray-800">
            La Noche en que Todo Comenzó
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nova Glow nació de una simple necesidad: transformar la ropa de noche. No buscábamos solo tela y lentejuelas, sino prendas que encendieran la confianza. Creemos que cada mujer merece sentirse la luz principal de la fiesta.
          </p>
        </div>

        {/* CORRECCIÓN: Reemplazamos el DIV por una IMAGEN */}
        <div className="mt-6 h-64 rounded-2xl overflow-hidden shadow-xl">
          <img
            // Usa una URL de imagen real aquí
            src="./imagen/imafe.jpg" // ¡Imagen insertada aquí!
            alt="Una mujer en un vestido brillante de noche"
            className="w-full h-full object-cover transition duration-500 hover:scale-105"
          />
        </div>
      </section>

      <section className="mb-16">
        <header className="text-center mb-12">
          <p className="text-sm font-semibold uppercase text-pink-600 mb-2 tracking-widest">Nuestro Fundamento</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Nuestros Tres Pilares
          </h2>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <Principio title="Brillo Sostenible" icon="✨" description="Diseñamos con responsabilidad, priorizando materiales duraderos y procesos éticos para un glamour sin culpa." delay={0} />
          <Principio title="Ajuste Perfecto" icon="📏" description="Cada pieza pasa por rigurosas pruebas de ajuste para asegurar que te sientas cómoda y espectacular toda la noche." delay={150} />
          <Principio title="Confianza Instantánea" icon="❤️" description="Nuestra misión es simple: al ponerte Nova Glow, la confianza se activa al instante. Vendemos protagonismo." delay={300} />
        </div>
      </section>

      <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-12">
        <h2 className="text-3xl font-extrabold text-pink-700 text-center mb-8">
          Conoce al Equipo Detrás del Glamour
        </h2>
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

      <section className="grid md:grid-cols-2 gap-12 items-center">
        {/* Texto: Misión */}
        <div>
          <h2 className="text-3xl font-sans text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-fuchsia-500" /> Nuestra Misión
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Somos una marca impulsada por la creencia de que la moda de fiesta debe empoderar. Nuestro compromiso es con la calidad, la transparencia y con hacerte sentir única en cada evento.
          </p>
          <p className="text-gray-700 leading-relaxed font-sans font-bold">
            ¡En Nova Glow, eres la estrella!
          </p>
        </div>
        {/* Imagen: Misión */}
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="./imagen/am.png"
            alt="Nuestra Misión Visual"
            className="w-full h-full object-cover transition duration-500 hover:scale-105"
          />
        </div>
      </section>

      {/* --- Separador Visual (Opcional) --- */}
      <hr className="border-t-2 border-fuchsia-100 mx-10" />

      {/* 2. SECCIÓN: NUESTRA VISIÓN (Invertida) */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        {/* Imagen: Visión (Primera columna en dispositivos medianos) */}
        <div className="md:order-1 relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="./imagen/vision.png"
            alt="Nuestra Visión Visual"
            className="w-full h-full object-cover transition duration-500 hover:scale-105"
          />
        </div>
        {/* Texto: Visión (Segunda columna en dispositivos medianos) */}
        <div className="md:order-2">
          <h2 className="text-3xl font-sans text-gray-800 mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-violet-500" /> Nuestra Visión
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nos vemos como la marca de referencia global en moda de fiesta que combina lujo accesible con un compromiso genuino por la sostenibilidad y el empoderamiento femenino.
          </p>
          <p className="text-gray-700 leading-relaxed font-sans font-bold">
            Un mundo donde cada noche es una oportunidad para brillar.
          </p>
        </div>
      </section>

      {/* 6. Promoción del Blog */}
      <section className="text-center py-12 bg-pink-50 rounded-2xl shadow-inner mt-20">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4 flex justify-center items-center gap-2">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          Inspírate y Descubre Más
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
          Sumérgete en nuestro blog para encontrar guías, tendencias y el impulso de confianza que necesitas.
        </p>

        {/* Tarjetas de Categorías */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          <CategoryPromoCard
            title="Tendencias"
            icon={Sun}
            color="pink"
            link="/inspiracion?tema=Tendencias"
            imageUrl="https://placehold.co/600x400/f06c9b/fff?text=TENDENCIAS"
            description="Descubre lo último en tejidos, cortes y colores de la moda nocturna global."
          />
          <CategoryPromoCard
            title="Guías de Estilo"
            icon={Feather}
            color="violet"
            link="/inspiracion?tema=Guia"
            imageUrl="https://placehold.co/600x400/9333ea/fff?text=GUIA"
            description="Consejos prácticos para armar tu outfit perfecto para cualquier tipo de evento."
          />
          <CategoryPromoCard
            title="Inspiración"
            icon={Star}
            color="yellow"
            link="/inspiracion?tema=Inspiracion"
            imageUrl="https://placehold.co/600x400/eab308/fff?text=CONFIA"
            description="Artículos sobre el poder de la confianza, el empoderamiento y el brillo interior."
          />
        </div>

        {/* Botón de Llamado a la Acción */}
        <Link
          to="/inspiracion" // Asume que esta es la ruta a Blog-Inspiracion.jsx o su componente principal
          className="inline-block bg-fuchsia-600 text-white font-semibold py-4 px-10 rounded-full text-lg hover:bg-fuchsia-700 transition duration-300 shadow-xl transform hover:scale-105"
        >
          Ir a la Galería de Inspiración
        </Link>
      </section>

    </div>
  );
}