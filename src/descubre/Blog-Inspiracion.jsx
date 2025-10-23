import React, { useState, useMemo } from 'react'; // 1. Importamos useState y useMemo
import { Sparkles, Star, Feather, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AllPosts } from '../data/blogPosts';

// Componente Auxiliar: Tarjeta de Blog (BlogCard)
const BlogCard = ({ title, category, imageUrl, slug }) => (
    // 🚨 Paso 2: Asegúrate de que el slug es lo que se usa para la ruta
    <Link
        to={`/inspiracion/${slug}`}
        className="block group bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100"
    >
        <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="p-5">
            <span className="text-xs font-semibold uppercase text-fuchsia-500 mb-1 block">{category}</span>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-violet-600 transition duration-300 line-clamp-2">
                {title}
            </h3>
        </div>
    </Link>     
    
);



// Componente Auxiliar: Sección de Blog (opcional, pero ayuda a ordenar)
const BlogSection = ({ title, icon: Icon, posts, color, anchorId }) => {
    // Si no hay posts, no renderizamos la sección
    if (posts.length === 0) return null;

    return (
        <section id={anchorId} className="pt-12 pb-8 border-t border-gray-200 mt-10">
            <h2 className={`text-4xl font-extrabold text-gray-800 mb-8 flex items-center`}>
                {/* Usamos el componente Icon */}
                <Icon className={`w-8 h-8 mr-3 text-${color}-600`} />
                {title}
            </h2>
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
};


export default function BlogInspiraciones() {
    // 2. Estado para el filtro activo: 'Todos', 'Inspiracion', 'Tendencias', 'Guia'
    const [activeFilter, setActiveFilter] = useState('Todos');

    // 3. Función para filtrar los posts basado en el estado
    const filteredPosts = useMemo(() => {
        if (activeFilter === 'Todos') {
            return AllPosts;
        }
        // Filtra por el tema (theme) que coincide con el filtro activo
        return AllPosts.filter(post => post.theme === activeFilter);
    }, [activeFilter]); // Se recalcula solo cuando activeFilter cambia

    // 4. Secciones temáticas pre-filtradas (para usar en el modo 'Todos')
    const inspiracionPosts = AllPosts.filter(p => p.theme === "Inspiracion");
    const guiasPosts = AllPosts.filter(p => p.theme === "Guia");
    const tendenciasPosts = AllPosts.filter(p => p.theme === "Tendencias");


    // Estilos de Tailwind CSS para el botón de navegación
    const getNavButtonClass = (filterValue) => `
        font-medium text-sm md:text-base transition flex items-center gap-1 p-2 rounded-full cursor-pointer
        ${activeFilter === filterValue
            ? 'bg-fuchsia-100 text-fuchsia-700 shadow-md' // Estilo activo
            : 'text-gray-700 hover:text-fuchsia-600 hover:bg-gray-100' // Estilo inactivo
        }
    `;

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

            {/* 5. Navegación Interna por Temas (Botones de Filtro) */}
            <div className="flex justify-center space-x-3 sm:space-x-6 mb-12 p-3 bg-gray-50 rounded-full shadow-inner sticky top-0 z-10">

                <button
                    onClick={() => setActiveFilter('Todos')}
                    className={getNavButtonClass('Todos')}
                >
                    <Sparkles className="w-4 h-4" /> Todos
                </button>

                <button
                    onClick={() => setActiveFilter('Inspiracion')}
                    className={getNavButtonClass('Inspiracion')}
                >
                    <Star className="w-4 h-4" /> Inspiración
                </button>

                <button
                    onClick={() => setActiveFilter('Guia')}
                    className={getNavButtonClass('Guia')}
                >
                    <Feather className="w-4 h-4" /> Guías de Estilo
                </button>

                <button
                    onClick={() => setActiveFilter('Tendencias')}
                    className={getNavButtonClass('Tendencias')}
                >
                    <Sun className="w-4 h-4" /> Tendencias
                </button>
            </div>

            {/* --- CONTENIDO DINÁMICO --- */}

            {activeFilter === 'Todos' ? (
                // MODO: Mostrar todas las secciones ordenadas
                <>
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
                </>
            ) : (
                // MODO: Mostrar solo la cuadrícula del filtro seleccionado
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
                    {filteredPosts.map((post, index) => (
                        <BlogCard
                            key={index}
                            title={post.title}
                            category={post.category}
                            imageUrl={post.imageUrl}
                            link={post.link}
                        />
                    ))}
                    {filteredPosts.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500 text-lg">
                            No hay artículos disponibles para este tema.
                        </div>
                    )}
                </section>
            )}

            {/* CTA para más contenido o suscripción */}
            {/* Solo se muestra si no se está filtrando una sección específica */}
            {activeFilter === 'Todos' && (
                <div className="text-center mt-12 p-8 bg-violet-300 rounded-xl shadow-inner">
                    <h2 className="text-2xl font-bold text-violet-700 mb-3">¿Quieres más brillo?</h2>
                    <p className="text-gray-600 mb-4">
                        Suscríbete a nuestro boletín para recibir lo último en tu correo.
                    </p>
                    <a
                        href="./BlogInspiraciones" // Considera cambiar este href a una función si el botón abre un modal
                        className="inline-block bg-fuchsia-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-fuchsia-600 transition duration-300 shadow-md"
                    >
                        Suscribirme a Novedades
                    </a>
                </div>
            )}
        </div>
    );
}