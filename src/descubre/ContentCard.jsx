import React from "react";


import { Link } from "react-router-dom";

function ContentCard({ article }) {
  return (
    <Link to={`/inspiracion/${article.slug}`}>
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">{article.title}</h2>
          <p className="text-gray-600">{article.description}</p>
        </div>
      </div>
    </Link>
  );
}

export default ContentCard;