import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import ContentCard from "../descubre/ContentCard";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Suscripcion from "./Suscripcion";

const CATEGORY_MAP = {
  Tendencias: "Tendencias",
  Guia: "Guía de Estilo",
  Inspiracion: "Inspiración",
};

const categories = ["Todos", "Tendencias", "Guía de Estilo", "Inspiración"];

const getInitialCategory = (search) => {
  const params = new URLSearchParams(search);
  const tema = params.get("tema");
  if (tema) {
    const mapped = CATEGORY_MAP[tema];
    return categories.includes(mapped) ? mapped : "Todos";
  }
  return "Todos";
};

export default function BlogInspiracion() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [usuario, setUsuario] = useState(null);
  const [articulos, setArticulos] = useState([]);

  const correosAutorizados = [
    "novaglow.admin@gmail.com",
    "hylromeroduran@crackthecode.la",
  ];

  const auth = getAuth();

  // 🔥 Cargar artículos ordenados por fecha
  useEffect(() => {
    const q = query(collection(db, "articulos"), orderBy("fecha", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const lista = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArticulos(lista);
    });
    return () => unsub();
  }, []);

  // 🔐 Usuario activo y categoría inicial
  useEffect(() => {
    setActiveCategory(getInitialCategory(location.search));

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user ? user.email : null);
    });

    return () => unsubscribe();
  }, [location.search, auth]);

  const esAdmin = usuario && correosAutorizados.includes(usuario);

  // 📂 Filtrar artículos
  const filteredArticles = useMemo(() => {
    if (activeCategory === "Todos") return articulos;
    return articulos.filter(
      (article) => article.categoria === activeCategory
    );
  }, [activeCategory, articulos]);

  // 🗑️ Eliminar artículo
  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este artículo?")) return;
    await deleteDoc(doc(db, "articulos", id));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pt-24 relative">
      {/* 🌸 HEADER */}
      <header className="text-center py-16 bg-fuchsia-50 rounded-2xl shadow-lg mb-12 border-b-4 border-fuchsia-300">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 flex justify-center items-center gap-3">
          <Sparkles className="w-10 h-10 text-yellow-500" />
          Blog & Galería de Inspiración
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Tu guía de estilo, tendencias y confianza ✨
        </p>
      </header>

      {/* 🔽 CATEGORÍAS */}
      <div className="flex justify-center flex-wrap gap-4 mb-10">
        {categories.map((category) => (
          <Link
            key={category}
            to={
              category === "Todos"
                ? "/inspiracion"
                : `/inspiracion?tema=${Object.keys(CATEGORY_MAP).find(
                    (k) => CATEGORY_MAP[k] === category
                  )}`
            }
            onClick={() => setActiveCategory(category)}
            className={`py-2 px-6 rounded-full font-semibold transition duration-300 text-center ${
              activeCategory === category
                ? "bg-fuchsia-500 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-fuchsia-50"
            }`}
          >
            {category}
          </Link>
        ))}
      </div>

      <hr className="mb-10 border-fuchsia-100" />

      {/* 📰 ARTÍCULOS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <div key={article.id} className="relative">
              {/* Limitar descripción a 20 palabras */}
              <ContentCard article={article} maxWords={20} />

              {esAdmin && (
                <button
                  onClick={() => handleEliminar(article.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-sm px-3 py-1 rounded-lg shadow-md"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <p className="text-xl">
              No hay artículos en la categoría "{activeCategory}".
            </p>
          </div>
        )}
      </section>

      {/* Suscripción al final del blog */}
      <div className="mt-12">
        <Suscripcion maxWords={15} /> {/* Opcional: limitar palabras si quieres mini-card */}
      </div>
    </div>
  );
}
