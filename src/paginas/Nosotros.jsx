// --- COMPONENTES AUXILIARES DE NOSOTROS ---
import { Sparkles, Zap, Heart } from "lucide-react";


// Componente auxiliar para los principios
const Principio = ({ title, icon, description }) => (
    <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-pink-500">
        <div className="text-4xl mb-3 flex justify-center">{icon === '✨' ? <Sparkles className="w-8 h-8 text-yellow-500"/> : icon === '📏' ? <Zap className="w-8 h-8 text-blue-500"/> : <Heart className="w-8 h-8 text-red-500"/>}</div>
        <h3 className="text-xl font-bold text-pink-600 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
    </div>
);

// Componente auxiliar para el equipo
const TeamMember = ({ name, role, tagline }) => (
    <div className="w-40 text-center">
        <div className="w-24 h-24 bg-pink-200 rounded-full mx-auto mb-3 flex items-center justify-center text-gray-700 text-sm font-semibold shadow-inner">
            {name.split(' ').map(n => n[0]).join('')}
        </div>
        <h4 className="font-bold text-gray-800">{name}</h4>
        <p className="text-sm text-pink-500 mb-1">{role}</p>
        <p className="text-xs text-gray-500 italic">"{tagline}"</p>
    </div>
);


// --- 3. VISTA NOSOTROS (Corregido para aceptar 'setPage' y fusionado el contenido) ---
export default function Nosotros() {
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      
      <header className="text-center py-12 bg-pink-50 rounded-3xl shadow-xl mb-12">
        <h1 className="text-5xl font-extrabold text-pink-700 mb-3">Nuestra Historia: El Viaje Nova Glow 💫</h1>
        <p className="text-xl text-gray-600">Moda con Propósito y Pasión</p>
      </header>

      {/* 1. Narrativa Inmersiva: La Visión (Contenido nuevo) */}
      <section className="bg-pink-100 p-8 rounded-3xl shadow-xl mb-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">
            La Noche en que Todo Comenzó
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nova Glow nació de una simple necesidad: transformar la ropa de noche. No buscábamos solo tela y lentejuelas, sino prendas que encendieran la confianza. Creemos que cada mujer merece sentirse la luz principal de la fiesta.
          </p>
        </div>
        {/* Placeholder para Imagen Emocional */}
        <div className="mt-6 h-64 bg-pink-300/50 rounded-2xl flex items-center justify-center text-pink-800 font-semibold shadow-inner">
          ¡La magia de la noche! 
        </div>
      </section>

      {/* 2. Transparencia: Nuestros Principios (Contenido nuevo) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-12">
        <Principio title="Brillo Sostenible" icon="✨" description="Diseñamos con responsabilidad, priorizando materiales duraderos y procesos éticos para un glamour sin culpa." />
        <Principio title="Ajuste Perfecto" icon="📏" description="Cada pieza pasa por rigurosas pruebas de ajuste para asegurar que te sientas cómoda y espectacular toda la noche." />
        <Principio title="Confianza Instantánea" icon="❤️" description="Nuestra misión es simple: al ponerte Nova Glow, la confianza se activa al instante. Vendemos protagonismo." />
      </section>

      {/* 3. Humanización: Conoce al Equipo Glow (Contenido nuevo) */}
      <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Conoce al Equipo Detrás del Glamour
        </h2>
        <div className="flex justify-center space-x-12 flex-wrap gap-8">
          <TeamMember name="Camila R." role="Fundadora & CEO" tagline="Mi pieza favorita para brillar es un buen top de satín." />
          <TeamMember name="Leo M." role="Jefe de Diseño" tagline="Siempre inspirado por la luz de la ciudad a medianoche." />
          <TeamMember name="Sofía L." role="Directora de Marketing" tagline="La confianza es el mejor accesorio que una mujer puede llevar." />
        </div>
      </section>

       {/* Sección de Compromiso Visual (Solo para mostrar un elemento visual de 'Quiénes Somos') */}
       <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Heart className="w-6 h-6 text-red-500"/> Nuestra Misión</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Somos una marca impulsada por la creencia de que la moda de fiesta debe empoderar. Nuestro compromiso es con la calidad, la transparencia y con hacerte sentir única en cada evento.
          </p>
          <p className="text-gray-700 leading-relaxed font-semibold">
            ¡En Nova Glow, eres la estrella!
          </p>
        </div>
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="https://placehold.co/800x600/f0f0f0/333333?text=Bocetos+de+Diseno" 
            alt="Bocetos de diseño de moda de Nova Glow" 
            className="w-full h-full object-cover transition duration-500 hover:scale-105"
          />
        </div>
      </section>
    </div>
;
}


