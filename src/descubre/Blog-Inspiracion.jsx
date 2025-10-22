import React from 'react';
// CORRECCIÓN 1: Se eliminó la importación genérica 'Icon' de Lucide
import { Sparkles, Star, Feather, Sun } from 'lucide-react';


// Usamos el componente auxiliar BlogCard definido arriba (o importado)
const BlogCard = ({ title, category, imageUrl, link }) => (
    <a href={link} className="block group bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100">
        <div className="h-48 overflow-hidden">
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
        </div>
        <div className="p-5">
            <span className="text-xs font-semibold uppercase text-fuchsia-500 mb-1 block">{category}</span>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-violet-600 transition duration-300 line-clamp-2">
                {title}
            </h3>
        </div>
    </a>
);


const BlogSection = ({ title, icon:posts, color, anchorId }) => (
    <section id={anchorId} className="pt-12 pb-8 border-t border-gray-200 mt-10">
        <h2 className={`text-4xl font-extrabold text-gray-800 mb-8 flex items-center`}>
            <posts className={`w-8 h-8 mr-3 text-${color}-600`} />
            {title}
        </h2>

        {/* Usamos una cuadrícula de 3 columnas para las secciones temáticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
                <BlogCard
                    key={index}
                    title={post.title}
                    category={post.category}
                    imageUrl={post.imageUrl}
                    link={post.link}
                />
            ))}
        </div>
    </section>
);



export default function BlogInspiraciones() {

    // Datos de ejemplo con ideas temáticas para Nova Glow
    const AllPosts = [
        { title: "La Confianza Instantánea: 5 Tips Antes de Salir", category: "Inspiración", theme: "Inspiracion", imageUrl: "https://placehold.co/600x400/DDA0DD/333333?text=Mujer+Segura", link: "#" },
        { title: "Rituales de Autocuidado para Brillar por Dentro", category: "Inspiración", theme: "Inspiracion", imageUrl: "https://placehold.co/600x400/fec8d8/f06c9b?text=Paz", link: "#" },
        { title: "El Poder del Color: Telas que te Hacen Brillar en la Noche", category: "Tendencias", theme: "Tendencias", imageUrl: "https://placehold.co/600x400/F4B5A6/333333?text=Telas+Metalicas", link: "#" },
        { title: "Terciopelo Líquido: El Lujo Textil del Momento", category: "Tendencias", theme: "Tendencias", imageUrl: "https://placehold.co/600x400/111827/fff?text=Terciopelo", link: "#" },
        { title: "¿Qué Ponerse? Guía para un Cóctel Sofisticado", category: "Estilo", theme: "Guia", imageUrl: "https://placehold.co/600x400/F0F8FF/333333?text=Coctel+Elegante", link: "#" },
        { title: "Básicos Glam: Las 10 Piezas Esenciales de Armario", category: "Estilo", theme: "Guia", imageUrl: "https://placehold.co/600x400/f06c9b/fff?text=LBD", link: "#" },
        { title: "El Brillo Sostenible: Cómo Elegir Moda de Fiesta Ética", category: "Propósito", theme: "Inspiracion", imageUrl: "https://placehold.co/600x400/98FF98/333333?text=Moda+Sostenible", link: "#" },
    ];

    const inspiracionPosts = AllPosts.filter(p => p.theme === "Inspiracion");
    const guiasPosts = AllPosts.filter(p => p.theme === "Guia");
    const tendenciasPosts = AllPosts.filter(p => p.theme === "Tendencias");

    return (

        <div className="max-w-6xl mx-auto p-4 md:p-8">


            <header className="text-center py-10 mb-10">
                <p className="text-sm font-semibold uppercase text-violet-600 mb-2 flex justify-center items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" /> Inspírate con Nova Glow
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
                    Blog de Estilo y Confianza
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Explora guías de estilo, tendencias de moda nocturna y artículos sobre el poder de la confianza. Aquí comienza tu brillo.
                </p>
            </header>

            {/* Navegación Interna por Temas */}
            <div className="flex justify-center space-x-4 mb-12 p-4 bg-gray-50 rounded-xl shadow-inner">
                <a href="./Inspiracion" className="font-medium text-gray-700 hover:text-fuchsia-600 transition flex items-center gap-1">
                    <Star className="w-4 h-4" /> Inspiración
                </a>
                <a href="./Guia" className="font-medium text-gray-700 hover:text-fuchsia-600 transition flex items-center gap-1">
                    <Feather className="w-4 h-4" /> Guías de Estilo
                </a>
                <a href="./Tendencias-Noche" className="font-medium text-gray-700 hover:text-fuchsia-600 transition flex items-center gap-1">
                    <Sun className="w-4 h-4" /> Tendencias
                </a>
            </div>


            {/* --- SECCIONES DE BLOG ORDENADAS --- */}

            <BlogSection
                title="Brillo Interior: Inspiración y Confianza"
                icon={Star}
                posts={inspiracionPosts}
                color="yellow"
                anchorId="inspiracion"
            />

            <BlogSection
                title="Tu Closet Glam: Guías y Básicos de Estilo"
                icon={Feather}
                posts={guiasPosts}
                color="violet"
                anchorId="guias"
            />

            <BlogSection
                title="Novedades de la Pasarela: Tendencias de Noche"
                icon={Sun}
                posts={tendenciasPosts}
                color="pink"
                anchorId="tendencias"
            />

            {/* Cuadrícula de Artículos/Tarjetas */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {AllPosts.map((post, index) => (
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
            <div className="text-center mt-12 p-8 bg-violet-300 rounded-xl shadow-inner">
                <h2 className="text-2xl font-bold text-violet-700 mb-3">¿Quieres más brillo?</h2>
                <p className="text-gray-600 mb-4">
                    Suscríbete a nuestro boletín para recibir lo último en tu correo.
                </p>
                <a
                    href="Blog-Inspiracion"
                    className="inline-block bg-fuchsia-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-fuchsia-600 transition duration-300 shadow-md"
                >
                    Suscribirme a Novedades
                </a>
            </div>

        </div>
    );
}