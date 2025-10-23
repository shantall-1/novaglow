import React from 'react';
import { useParams, Link } from 'react-router-dom'; // Importamos useParams y Link
import { AllPosts } from '../data/blogPosts'; // Importamos los datos

export default function BlogDetalles() {
    // Captura el 'slug' de la URL definida en App.jsx
    const { slug } = useParams(); 
    
    // Busca el post que coincide con el slug
    const post = AllPosts.find(p => p.slug === slug);

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center">
                <h1 className="text-4xl font-bold text-gray-800">Artículo no encontrado</h1>
                <Link to="./inspiracion" className="mt-4 inline-block text-pink-600 hover:underline">
                    ← Volver al Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 py-16">
            
            {/* 🌟 ENLACE DE VUELTA AL BLOG PRINCIPAL 🌟 */}
            <Link 
                to="/inspiracion" 
                className="inline-flex items-center text-gray-600 hover:text-pink-600 transition mb-6"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Volver a la Galería de Inspiración
            </Link>

            <header className="mb-8">
                <p className="text-sm font-semibold uppercase text-fuchsia-500 mb-2">{post.category}</p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">{post.title}</h1>
                <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-96 object-cover rounded-xl shadow-lg mt-6"
                />
            </header>

            {/* Renderiza el contenido HTML guardado en los datos */}
            <div 
                className="prose max-w-none text-gray-700 leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: post.content }} 
            />

            <div className="mt-12 text-center border-t pt-6">
                 <Link to="/inspiracion" className="bg-fuchsia-700 hover:bg-fuchsia-900 text-white font-bold py-3 px-8 rounded-full shadow-xl transition-transform transform hover:scale-105 inline-block">
                    Ver más Artículos
                </Link>
            </div>
        </div>
    );
}