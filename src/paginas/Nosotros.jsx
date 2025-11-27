import React from "react";
import { Sparkles, Feather, Sun, Eye, Star, } from "lucide-react";
import { Link } from "react-router-dom";
import { HeaderCarrusel } from "../descubre/HeaderCarrusel";
import Valores from "../descubre/valores.jsx";
import PropositoMisionVision from "../descubre/Proposito.jsx";
// --- Componente ContentCard (CORREGIDO: Manejo de Imagen por Defecto) ---

const ContentCard = ({
  title,
  description,
  imageUrl,
  linkText = "Ver Detalle",
}) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl border border-gray-100">
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-48 object-cover"
      onError={(e) =>
        (e.target.src = "https://placehold.co/600x400/feeae9/f06c9b?text=GLOW")
      }
    />
    <div className="p-4">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
      <a
        href="#"
        className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-800 transition"
      >
        {linkText}
        <svg
          className="ml-1 w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </div>
);
// --- Componente CategoryPromoCard (CORREGIDO: Manejo de Color Dinámico) ---
const CategoryPromoCard = ({
  title,
  icon: Icon,
  color,
  link,
  description,
  imageUrl,
}) => (
  // Usamos fuchsia de forma fija para las clases que Tailwind no puede escanear dinámicamente,
  // o aseguramos que los colores se usen como clase completa.
  <div
    className={`bg-white rounded-xl shadow-lg border-t-4 border-${color}-400 transition duration-300 transform hover:scale-[1.03] hover:shadow-2xl overflow-hidden`}
  >
    {/* Imagen o Relleno de Ícono */}
    {imageUrl ? (
      <div className="h-40 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) =>
          (e.target.src =
            "https://placehold.co/600x400/feeae9/f06c9b?text=GLOW")
          }
        />
      </div>
    ) : (
      // Usamos color dinámico aquí para el fondo del ícono grande
      <div
        className={`h-40 w-full flex items-center justify-center bg-${color}-50`}
      >
        {Icon && <Icon className={`w-16 h-16 text-${color}-600`} />}
      </div>
    )}

    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      {/* Usamos color dinámico para el enlace */}
      <Link
        to={link}
        className={`text-sm font-semibold text-${color}-600 hover:text-${color}-800 transition`}
      >
        Ver {title} →
      </Link>
    </div>
  </div>
);

const FeatureCard = ({ title, description, image, icon: Icon }) => (
  <div
    className="group relative p-6 rounded-2xl shadow-xl overflow-hidden border border-pink-200 bg-white/60 backdrop-blur-lg transition-all duration-300 hover:shadow-pink-300/40 hover:-translate-y-1"
    style={{
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Capa de oscurecimiento */}
    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>

    <div className="relative z-10 text-center">
      {Icon && (
        <Icon className="w-10 h-10 mx-auto mb-3 text-pink-400 drop-shadow-md" />
      )}

      <h3 className="text-2xl font-bold text-white drop-shadow">{title}</h3>

      {description && (
        <p className="text-gray-200 text-sm mt-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  </div>
);

// Componente auxiliar para el equipo

const TeamMember = ({ name, role, tagline, imageUrl }) => (
  <div className="flex flex-col items-center max-w-[150px] p-4 bg-gray-50 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:bg-pink-50">
    <img
      src={imageUrl}
      alt={name}
      className="w-32 h-32 object-cover rounded-full border-4 border-pink-300 mb-3 shadow-lg"
      onError={(e) =>
        (e.target.src = "https://placehold.co/150x150/cccccc/000?text=Team")
      }
    />
    <h3 className="text-xl font-bold text-gray-800">{name}</h3>
    <p className="text-pink-600 font-semibold text-sm mb-2">{role}</p>
    <p className="text-gray-600 text-center text-xs italic">"{tagline}"</p>
  </div>
);

// --- 3. VISTA NOSOTROS (Corregido para aceptar 'setPage' y fusionado el contenido) ---
export default function Nosotros() {
  return (
    <div>
      <HeaderCarrusel />
      <div>
        {/* 1. Narrativa Inmersiva: La Visión (Contenido nuevo) */}
        <section>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-semibold uppercase text-gray-800">
              Nuestra historia
            </h1>
            <p className="text-xl text-gray-800 max-w-5xl mx-auto">
              En Nova Glow, cada vestido cuenta una historia de empoderamiento,
              brillo y elegancia. Fundada por Valentina C., nuestra marca nace
              de la pasión por crear moda de noche que no solo deslumbre, sino
              que inspire autenticidad y confianza real en cada mujer que la
              lleva.
            </p>
          </div>

          <br />
        </section>
        <span className="bg-black w-full py-4 px-6 mt-10 block shadow-lg border border-pink-400/30">
          <p className="text-lg text-white font-semibold uppercase text-center">
            Somos más que una marca: somos un movimiento que celebra la fuerza
            femenina a través del diseño.
          </p>
        </span>
        <div>
          <PropositoMisionVision />
        </div>
        <section className="bg-gradient-linea-to-b from-pink-50 to-white py-20 px-6">
          <h2 className="text-center text-4xl font-bold text-pink-500 mb-10">
            Manifesto de Marca
          </h2>

          <div className="max-w-3xl mx-auto text-center text-gray-800 text-xl leading-relaxed space-y-4">
            <p>Creemos que la noche es un escenario.</p>
            <p>
              Creemos en mujeres que no esperan ser vistas, sino que deciden
              brillar.
            </p>
            <p>Creemos en la moda que dura, inspira y libera.</p>
            <p>Y creemos en el poder de sentirse inolvidable.</p>
          </div>
        </section>

        <section className="py-20 px-6">
          <h2 className="text-center text-4xl font-bold text-pink-500 mb-12">
            Nuestro Camino
          </h2>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-pink-300 h-full"></div>
            {[
              { year: "2021", text: "Nace la idea de Nova Glow." },
              {
                year: "2022",
                text: "Primeros prototipos y concepto de Brillo Sostenible.",
              },
              {
                year: "2023",
                text: "Lanzamiento oficial de la primera colección.",
              },
              {
                year: "2024",
                text: "Apertura de nuestra línea propia de confección.",
              },
              { year: "2025", text: "Expansión a ventas internacionales." },
            ].map((item, idx) => (
              <div key={idx} className="mb-12 flex items-start">
                <div className="w-1/2 text-right pr-6">
                  <h3 className="text-xl font-bold text-pink-500">
                    {item.year}
                  </h3>
                </div>

                <div className="w-4 h-4 bg-pink-500 rounded-full"></div>

                <p className="w-1/2 pl-6 text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
          <div>
            <Valores />
          </div>
        </section>

        <section className="py-20 px-6 bg-gradient-linea-to-b from-white to-pink-50/40">
          {/* Encabezado General */}
          <header className="text-center mb-16">
            <p className="text-sm font-semibold uppercase text-pink-600 tracking-widest">
              Nuestro Fundamento
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 uppercase">
              Pilares & Valores de NovaGlow
            </h2>
          </header>

          {/* Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto mb-20">
            <FeatureCard
              title="Brillo Sostenible"
              description="Materiales duraderos, procesos éticos y diseño responsable para un glamour sin culpa."
              image="/img/pilar-sostenible.jpg"
              delay={0}
            />

            <FeatureCard
              title="Ajuste Perfecto"
              description="Cada prenda está probada para garantizar comodidad, seguridad y un look impecable."
              image="/img/pilar-ajuste.jpg"
              delay={150}
            />

            <FeatureCard
              title="Confianza Instantánea"
              description="Con Nova Glow, la seguridad y el protagonismo se activan desde el primer instante."
              image="/img/pilar-confianza.jpg"
              delay={300}
            />
          </div>
        </section>
        {/* 4. SECCIÓN: EQUIPO */}
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
              name="Shantall C."
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
        <section className="py-20 px-6 bg-pink-50">
          <h2 className="text-center text-4xl font-bold text-pink-500 mb-12">
            Nuestro Proceso Creativo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              { title: "Moodboards", img: "https://i.imgur.com/gS8w6n9.jpeg" },
              {
                title: "Selección de Materiales",
                img: "https://i.imgur.com/5HeI4lM.jpeg",
              },
              {
                title: "Confección Manual",
                img: "https://i.imgur.com/KOaa7JM.jpeg",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-3xl overflow-hidden shadow-lg"
              >
                <img src={item.img} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-pink-500">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-black text-white py-20 px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Inclusión y Diversidad</h2>
          <p className="max-w-3xl mx-auto text-xl opacity-90">
            Diseñamos para mujeres reales, de cuerpos reales, en todas sus historias,
            tallas y expresiones.
          </p>
        </section>

        <section className="py-20 px-6">
          <h2 className="text-center text-4xl font-bold text-pink-500 mb-10">
            Historias Reales
          </h2>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <blockquote className="p-6 bg-white shadow-xl rounded-xl border-l-4 border-pink-400">
              “Nunca me había sentido tan segura y elegante como con su vestido.”
              <span className="block text-pink-500 mt-3 font-semibold">— Andrea R.</span>
            </blockquote>
            <blockquote className="p-6 bg-white shadow-xl rounded-xl border-l-4 border-pink-400">
              “El ajuste y la calidad son impecables. Literalmente brillé.”
              <span className="block text-pink-500 mt-3 font-semibold">— Valeria M.</span>
            </blockquote>
          </div>
        </section>

        <section className="text-center py-20">
          <h2 className="text-4xl font-bold text-pink-500 mb-6">
            Descubre tu brillo
          </h2>

          <Link
            to="/colecciones"
            className="px-8 py-4 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition"
          >
            Ver Colecciones
          </Link>
        </section>



        {/* 6. Promoción del Blog */}
        <section className="text-center py-12 bg-pink-50 rounded-2xl shadow-inner mt-20">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4 flex justify-center items-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            Inspírate y Descubre Más
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
            Sumérgete en nuestro blog para encontrar guías, tendencias y el
            impulso de confianza que necesitas.
          </p>

          {/* Tarjetas de Categorías */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <CategoryPromoCard
              title="Tendencias"
              icon={Sun}
              color="pink"
              link="/inspiracion?tema=Tendencias"
              imageUrl="http://www.tiendaunique.cl/cdn/shop/products/4244navy_2_e1173c6b-d1c1-48ad-8c5e-678abe5fdba2.jpg?v=1658170307&width=1024"
              description="Descubre lo último en tejidos, cortes y colores de la moda nocturna global."
            />
            <CategoryPromoCard
              title="Guías de Estilo"
              icon={Feather}
              color="violet"
              link="/inspiracion?tema=Guia"
              imageUrl="https://www.mujerde10.com/wp-content/uploads/2025/06/moda-outfits-de-noche-antro-juvenil-con-transparencias-5-1024x678.jpg"
              description="Consejos prácticos para armar tu outfit perfecto para cualquier tipo de evento."
            />
            <CategoryPromoCard
              title="Inspiración"
              icon={Star}
              color="yellow"
              link="/inspiracion?tema=Inspiracion"
              imageUrl="https://i.pinimg.com/564x/c5/53/a6/c553a67d99cb5d833d6828808e5e9ac4.jpg"
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
    </div>
  );
}
