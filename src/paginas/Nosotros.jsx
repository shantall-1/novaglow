import React, { useState } from 'react';
import { Zap, Heart, Sparkles, Sunrise, Feather } from "lucide-react";

// --- Componente para Tarjetas de Contenido (reutilizable) ---
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
                <svg className="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
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

// --- 2. VISTA PREVIA LATERAL (Resumen de Inspiración) ---
const InspirationMiniPreview = () => (
    <div className="space-y-6">
        <h3 className="text-xl font-extrabold text-pink-700 mb-4 border-b border-pink-200 pb-2">
            Descubre Más en Glow
        </h3>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <h4 className="flex items-center text-lg font-bold text-gray-800 mb-3"><Sparkles className="w-5 h-5 mr-2 text-pink-500" /> Guía de Estilo</h4>
            <ContentCard
                title="Básicos Glam"
                description="Las 10 piezas esenciales para tu armario."
                imageUrl="https://placehold.co/600x400/f06c9b/fff?text=LBD"
                linkText="Ver Guía"
            />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <h4 className="flex items-center text-lg font-bold text-gray-800 mb-3"><SunIcon className="w-5 h-5 mr-2 text-pink-500" /> Tendencias</h4>
            <ContentCard
                title="Terciopelo Líquido"
                description="Análisis del tejido más lujoso del momento."
                imageUrl="https://placehold.co/600x400/111827/fff?text=Terciopelo"
                linkText="Ver Tendencias"
            />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <h4 className="flex items-center text-lg font-bold text-gray-800 mb-3"><FeatherIcon className="w-5 h-5 mr-2 text-pink-500" /> Blog Inspiración</h4>
            <ContentCard
                title="Rituales de Confianza"
                description="Rutinas de 5 minutos para elevar tu autoestima."
                imageUrl="https://placehold.co/600x400/fec8d8/f06c9b?text=Paz"
                linkText="Leer Blog"
            />
        </div>
    </div>
);

// --- 3. VISTA NOSOTROS (Corregido para aceptar 'setPage' y fusionado el contenido) ---
export default function Nosotros() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">

      <header className="text-center py-14 rounded-3xl shadow-xl mb-12 
      ">

        {/* Usamos un color blanco o claro para que el texto resalte sobre el fondo oscuro */}
        <h1 className="text-5xl font-bold text-fuchsia-700 mb-3">
          Nuestra Historia: El Viaje Nova Glow
        </h1>
        <p className="text-xl font-sans text-gray-500">
          Moda con Propósito y Pasión
        </p>
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

      {/* 2. Transparencia: Nuestros Principios (Contenido nuevo) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
        <Principio title="Brillo Sostenible" icon="✨" description="Diseñamos con responsabilidad, priorizando materiales duraderos y procesos éticos para un glamour sin culpa." />
        <Principio title="Ajuste Perfecto" icon="📏" description="Cada pieza pasa por rigurosas pruebas de ajuste para asegurar que te sientas cómoda y espectacular toda la noche." />
        <Principio title="Confianza Instantánea" icon="❤️" description="Nuestra misión es simple: al ponerte Nova Glow, la confianza se activa al instante. Vendemos protagonismo." />
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

      {/* Sección de Compromiso Visual (Solo para mostrar un elemento visual de 'Quiénes Somos') */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-sans text-gray-800 mb-4 flex items-center gap-2"><Heart className="w-6 h-6 text-red-500" /> Nuestra Misión</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Somos una marca impulsada por la creencia de que la moda de fiesta debe empoderar. Nuestro compromiso es con la calidad, la transparencia y con hacerte sentir única en cada evento.
          </p>
          <p className="text-gray-700 leading-relaxed font-sans">
            ¡En Nova Glow, eres la estrella!
          </p>
        </div>
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="./imagen/am.png" // ¡Imagen insertada aquí!
            alt="Nuestra Misión Visual"
            className="w-full h-full object-cover transition duration-500 hover:scale-105"
          />
        </div>
      </section>

    </div>
  );

}