import React from 'react';
import { Sparkles } from 'lucide-react'; 

// Usamos el componente auxiliar BlogCard definido arriba (o importado)
const BlogCard = ({ title, category, imageUrl, link }) => (
    <a href={link} className="block group bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden">
        {/* Imagen del artículo */}
        <div className="h-48 overflow-hidden">
            <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
        </div>
        
        {/* Contenido del texto */}
        <div className="p-5">
            <span className="text-xs font-semibold uppercase text-fuchsia-500 mb-1 block">{category}</span>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-violet-600 transition duration-300 line-clamp-2">
                {title}
            </h3>
        </div>
    </a>
);
const BlogInspiracionContent = () => (
    <div className="grid md:grid-cols-3 gap-8">
        <ContentCard
            title="🌸 Detrás del Glamour: Entrevista a Leo C."
            description="Nuestra Directora de Marketing nos revela su proceso para definir la voz de Glow y su ritual favorito antes de un gran evento."
            imageUrl="https://placehold.co/600x400/f7799e/fff?text=Entrevista+Leo"
            linkText="Conoce su Historia"
        />
        <ContentCard
            title="📸 #MiMomentoGlow: Historias Reales"
            description="Galería de clientas que irradian confianza con sus prendas Glow. Descubre cómo visten nuestras usuarias para sus propios momentos especiales."
            imageUrl="https://placehold.co/600x400/feeae9/f06c9b?text=UGC+Comunidad"
            linkText="Únete a la Comunidad"
        />
        <ContentCard
            title="🧘‍♀️ Rituales de Confianza: 5 Minutos de Paz"
            description="Consejos de bienestar y prácticas de *mindfulness* para elevar tu autoestima y caminar con total seguridad en cada evento."
            imageUrl="https://placehold.co/600x400/fec8d8/f06c9b?text=Autocuidado"
            linkText="Aprende los Rituales"
        />
    </div>
);
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



export default function BlogInspiraciones() {
    
    // Datos de ejemplo con ideas temáticas para Nova Glow
    const posts = [
        { title: "¿Qué Ponerse? Guía para un Cóctel Sofisticado", category: "Estilo", imageUrl: "https://placehold.co/600x400/F0F8FF/333333?text=Coctel+Elegante", link: "#" },
        { title: "El Poder del Color: Telas que te Hacen Brillar en la Noche", category: "Tendencias", imageUrl: "https://placehold.co/600x400/F4B5A6/333333?text=Telas+Metalicas", link: "#" },
        { title: "El Brillo Sostenible: Cómo Elegir Moda de Fiesta Ética", category: "Propósito", imageUrl: "https://placehold.co/600x400/98FF98/333333?text=Moda+Sostenible", link: "#" },
        { title: "Confianza Instantánea: 5 Tips Antes de Salir a la Pista", category: "Mente", imageUrl: "https://placehold.co/600x400/DDA0DD/333333?text=Mujer+Segura", link: "#" },
    ];
    
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            
            {/* Encabezado de la Sección */}
            <header className="text-center py-10 mb-10">
                <p className="text-sm font-semibold uppercase text-violet-600 mb-2 flex justify-center items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500"/> Inspírate con Nova Glow
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                    Blog de Estilo y Confianza
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Explora guías de estilo, tendencias de moda nocturna y artículos sobre el poder de la confianza. Aquí comienza tu brillo.
                </p>
            </header>

            {/* Cuadrícula de Artículos/Tarjetas */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {posts.map((post, index) => (
                    <BlogCard 
                        key={index}
                        title={post.title}
                        category={post.category}
                        imageUrl={post.imageUrl}
                        link={post.link}
                    />
                ))}
            </section>
            
            {/* CTA para más contenido o suscripción */}
            <div className="text-center mt-12 p-8 bg-violet-50 rounded-xl shadow-inner">
                <h2 className="text-2xl font-bold text-violet-700 mb-3">¿Quieres más brillo?</h2>
                <p className="text-gray-600 mb-4">
                    Suscríbete a nuestro boletín para recibir lo último en tu correo.
                </p>
                <a 
                    href="#" 
                    className="inline-block bg-fuchsia-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-fuchsia-600 transition duration-300 shadow-md"
                >
                    Suscribirme a Novedades
                </a>
            </div>

        </div>
    );
}