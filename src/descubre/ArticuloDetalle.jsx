import React, { useMemo } from 'react';
import { Link, useParams } from "react-router-dom";
import { Sparkles, ArrowLeft, Calendar, Clock } from 'lucide-react';
import ContentRenderer from './ContentRenderer';
import { allArticles } from "../descubre/articlesData";
 // 👈 Importar aquí


export default function ArticuloDetalle() {
  const { slug } = useParams();

  const article = useMemo(() => {
    return allArticles.find(a => a.slug === slug);
  }, [slug]);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center pt-24 min-h-screen">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">Artículo No Encontrado</h1>
        <Link to="/inspiracion" className="inline-flex items-center text-fuchsia-600 hover:text-fuchsia-800 font-semibold transition">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a la Galería de Inspiración
        </Link>
      </div>
    );
  }


    return (
        <article className="max-w-6xl mx-auto p-4 md:p-8 pt-10">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-96 object-cover"
                    onError={(e) => e.target.src = "https://placehold.co/1200x600/cccccc/333?text=Nova+Glow"}
                />

                <div className="p-6 md:p-12">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span className="text-fuchsia-600 font-semibold uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-4 h-4" /> {article.category}
                        </span>
                        <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" /> {article.date}
                        </span>
                        <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-gray-400" /> {article.readTime}
                        </span>
                    </div>

                    <h1 className="text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                        {article.title}
                    </h1>

                    <ContentRenderer content={article.content} />
                    
                    <div className="mt-16 pt-8 border-t border-gray-200">
                        <Link to="/inspiracion" className="inline-flex items-center text-lg text-fuchsia-600 hover:text-fuchsia-800 font-semibold transition">
                            <ArrowLeft className="w-6 h-6 mr-2" />
                            Volver a la Galería de Inspiración
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
