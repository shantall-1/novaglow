// --- Carrusel NovaGlow (Header) ---
import { useState, useEffect } from "react";
import { Aperture } from "lucide-react";

const headerSlides = [
  {
    id: 1,
    title: "El Viaje Nova Glow",
    subtitle: "Moda con Propósito y Pasión",
    text: "Nuestra historia es la fusión perfecta entre diseño de alta costura y la búsqueda de la confianza interior.",
    bg: "https://i.gifer.com/6Ycn.gif",
  },
  {
    id: 2,
    title: "Brilla sin pedir permiso",
    subtitle: "Confianza que ilumina",
    text: "Diseños creados para que cada mujer se sienta poderosa, elegante y auténtica.",
    bg: "https://i.gifer.com/OZei.gif",
  },
  {
    id: 3,
    title: "Lujo responsable",
    subtitle: "Belleza que trasciende",
    text: "Materiales seleccionados con ética y procesos conscientes.",
    bg: "https://i.gifer.com/21rl.gif",
  },
];

export function HeaderCarrusel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % headerSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slide = headerSlides[index];

  return (
    <header className="relative w-full h-[700px] overflow-hidden mb-16 transition-all duration-700">
      {/* Imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url(${slide.bg})` }}
      ></div>

      {/* Capa oscura */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Contenido */}
      <div className="relative z-50 h-full flex flex-col justify-center items-center text-center px-4">
        <p className="text-lg font-semibold uppercase text-fuchsia-300 mb-2 flex items-center">
          <Aperture className="w-5 h-5 mr-2 animate-spin-slow" />
          {slide.subtitle}
        </p>

        <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4 tracking-tight animate-fade-in">
          {slide.title}
        </h1>

        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          {slide.text}
        </p>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {headerSlides.map((s, i) => (
          <span
            key={s.id}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index ? "bg-fuchsia-400 scale-125" : "bg-white/40"
            }`}
          ></span>
        ))}
      </div>
    </header>
  );
}
