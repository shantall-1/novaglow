import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom"; // ✅ CORREGIDO
import { Sparkles, Sun, Feather, Star } from 'lucide-react';
import ContentCard from '../descubre/ContentCard';





const CATEGORY_MAP = {
    'Tendencias': 'Tendencias',
    'Guia': 'Guía de Estilo',
    'Inspiracion': 'Inspiración',
};
const categories = ["Todos", "Tendencias", "Guía de Estilo", "Inspiración"];

export const allArticles = [
    { 
        id: 1, 
        slug: "colores-temporada-fiestas", 
        title: "Los 5 Colores de la Temporada de Fiestas", 
        category: "Tendencias", 
        date: "20/10/2025", 
        readTime: "4 min",
        icon: Sun, color: "pink", 
        description: "Descubre la paleta que dominará los eventos nocturnos este año.", 
        imageUrl: "https://placehold.co/1200x600/f06c9b/fff?text=TENDENCIAS+DE+COLOR",
        content: [
            { type: 'paragraph', text: "La moda nocturna se renueva, y esta temporada, la paleta se concentra en tonos audaces y metálicos. Hemos identificado cinco colores esenciales que no pueden faltar en tu vestuario para eventos." },
            { type: 'heading', text: "1. El Rojo Carmesí" },
            { type: 'paragraph', text: "Clásico e infalible. El Rojo Carmesí se mantiene como el rey de la noche, simbolizando pasión y poder. Es perfecto para vestidos largos o jumpsuits sofisticados." },
            { type: 'heading', text: "2. El Azul Eléctrico" },
            { type: 'paragraph', text: "Para quienes buscan deslumbrar. El Azul Eléctrico regresa con fuerza, especialmente en telas con brillo o lentejuelas. Combínalo con accesorios plateados para un look futurista." },
            { type: 'heading', text: "3. Dorado Rosa Suave" },
            { type: 'paragraph', text: "Una alternativa elegante al dorado tradicional. El Dorado Rosa ofrece un brillo cálido y sutil, ideal para bodas de noche y galas formales." },
            { type: 'paragraph', text: "Recuerda que la clave es la confianza. Llevar estos colores con seguridad es el mejor accesorio. ¡Brilla con Nova Glow!" },
        ],
    },
    { 
        id: 2, 
        slug: "guia-rapida-vestidos-coctel", 
        title: "Guía Rápida para Vestidos de Cóctel", 
        category: "Guía de Estilo", 
        date: "15/09/2025", 
        readTime: "3 min",
        icon: Feather, color: "violet",
        description: "Todo lo que necesitas saber sobre la etiqueta y el largo adecuado.", 
        imageUrl: "https://placehold.co/1200x600/9333ea/fff?text=ETIQUETA+COCTEL",
        content: [
            { type: 'paragraph', text: "El vestido de cóctel es el punto medio perfecto entre lo casual y lo formal. Aquí te damos las reglas de oro para acertar siempre con el largo y el estilo." },
            { type: 'list', items: ["Largo: Debe ir por encima de la rodilla, a media pierna, o justo debajo (estilo 'tea-length'). Evita los largos hasta el suelo.", "Accesorios: Opta por carteras de mano (clutch) pequeñas y zapatos elegantes de tacón.", "Tejidos: Elige telas ricos como seda, encaje o terciopelo. Evita el algodón o lino."], },
            { type: 'paragraph', text: "Un buen vestido de cóctel siempre debe hacerte sentir cómoda y fabulosa. No subestimes el poder de un ajuste perfecto." }
        ],
    },
    { 
        id: 3, 
        slug: "vestidos-fiesta-sostenibles", 
        title: "¿Cómo Elegir Vestidos de Fiesta Sostenibles?", 
        category: "Inspiración", 
        date: "05/11/2025", 
        readTime: "5 min",
        icon: Star, color: "green",
        description: "Un vistazo a la moda ética y brillante para eventos especiales.", 
        imageUrl: "https://placehold.co/1200x600/10b981/fff?text=MODA+SOSTENIBLE",
        content: [
            { type: 'paragraph', text: "La sostenibilidad ha llegado a la moda de fiesta. Ya no tienes que sacrificar el glamour por ser consciente del medio ambiente." },
            { type: 'heading', text: "Telas a Priorizar" },
            { type: 'list', items: ["Seda orgánica o Tencel (lyocell): Alternativas lujosas con menor impacto hídrico.", "Poliéster reciclado: Ideal para lentejuelas y brillos, minimizando nuevos plásticos."], },
            { type: 'paragraph', text: "Considera también la longevidad. Un vestido de alta calidad que puedes usar en múltiples eventos es la opción más sostenible de todas. ¡Nova Glow te ayuda a tomar decisiones brillantes y responsables!" },
        ],
    },
];

const getInitialCategory = (search) => {
    const params = new URLSearchParams(search);
    const tema = params.get('tema');
    if (tema) {
        const mappedCategory = CATEGORY_MAP[tema];
        return categories.includes(mappedCategory) ? mappedCategory : 'Todos';
    }
    return 'Todos';
};

 
export default function BlogInspiracion() {
    const location = useLocation(); 
    const [activeCategory, setActiveCategory] = useState('Todos'); 

    useEffect(() => {
        const initialCategory = getInitialCategory(location.search); 
        setActiveCategory(initialCategory);
    }, [location.search]); 

    const filteredArticles = useMemo(() => {
        if (activeCategory === "Todos") {
            return allArticles;
        }
        return allArticles.filter(article => article.category === activeCategory);
    }, [activeCategory]);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 pt-24">
            <header className="text-center py-16 bg-fuchsia-50 rounded-2xl shadow-lg mb-12 border-b-4 border-fuchsia-300">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-4 flex justify-center items-center gap-3">
                    <Sparkles className="w-10 h-10 text-yellow-500" />
                    Blog & Galería de Inspiración
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Tu fuente esencial para tendencias de moda de fiesta, guías de estilo y dosis de empoderamiento.
                </p>
            </header>

            <div className="flex justify-center flex-wrap gap-4 mb-10">
                {categories.map((category) => (
                    <Link
                        key={category}
                        // Usa la categoría mapeada (ej. 'Guia') para el parámetro de URL
                        to={category === 'Todos' ? "/inspiracion" : `/inspiracion?tema=${Object.keys(CATEGORY_MAP).find(k => CATEGORY_MAP[k] === category)}`}
                        onClick={() => setActiveCategory(category)}
                        className={`
                            py-2 px-6 rounded-full font-semibold transition duration-300 text-center
                            ${activeCategory === category
                                ? 'bg-fuchsia-600 text-white shadow-md hover:bg-fuchsia-700'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-fuchsia-50 hover:border-fuchsia-300'
                            }
                        `}
                    >
                        {category}
                    </Link>
                ))}
            </div>

            <hr className="mb-10 border-fuchsia-100" />

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map(article => (
                        <ContentCard key={article.id} article={article} /> 
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        <p className="text-xl">¡Vaya! No encontramos artículos en la categoría **"{activeCategory}"**.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
