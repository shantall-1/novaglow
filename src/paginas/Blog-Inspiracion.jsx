import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom"; // ✅ CORREGIDO
import { Sparkles, Sun, Feather, Star } from 'lucide-react';
import ContentCard from '../descubre/ContentCard';
import { allArticles } from '../descubre/articlesData';




const CATEGORY_MAP = {
    'Tendencias': 'Tendencias',
    'Guia': 'Guía de Estilo',
    'Inspiracion': 'Inspiración',
};
const categories = ["Todos", "Tendencias", "Guía de Estilo", "Inspiración"];


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
