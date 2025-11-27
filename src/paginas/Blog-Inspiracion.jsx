import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Trash2, Zap, Star, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ContentCard from "../descubre/ContentCard";
import Suscripcion from "./Suscripcion";

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

/* ----------------------------------------------------
   CONSTS & HELPERS
---------------------------------------------------- */

const CATEGORY_MAP = {
  Tendencias: "Tendencias",
  Guia: "Guía de Estilo",
  Inspiracion: "Inspiración",
};

const categories = ["Todos", "Tendencias", "Guía de Estilo", "Inspiración"];

const getInitialCategory = (search) => {
  const params = new URLSearchParams(search);
  const tema = params.get("tema");
  if (tema && CATEGORY_MAP[tema]) return CATEGORY_MAP[tema];
  return "Todos";
};

// Iconos para las categorías
const CategoryIcon = ({ cat }) => {
    if (cat === "Tendencias") return <Zap size={14} />;
    if (cat === "Guía de Estilo") return <BookOpen size={14} />;
    if (cat === "Inspiración") return <Star size={14} />;
    return <Sparkles size={14} />;
};

/* ----------------------------------------------------
   COMPONENTE PRINCIPAL
---------------------------------------------------- */

export default function BlogInspiracion() {
  const location = useLocation();
  const auth = getAuth();

  const [activeCategory, setActiveCategory] = useState("Todos");
  const [usuario, setUsuario] = useState(null);
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);

  const correosAutorizados = [
    "novaglow.admin@gmail.com",
    "hylromeroduran@crackthecode.la",
  ];

  /* --- Cargar artículos --- */
  useEffect(() => {
    const q = query(collection(db, "articulos"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setArticulos(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /* --- Usuario + Categoría --- */
  useEffect(() => {
    setActiveCategory(getInitialCategory(location.search));
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user?.email || null);
    });
    return () => unsubscribe();
  }, [location.search]);

  const esAdmin = usuario && correosAutorizados.includes(usuario);

  /* --- Filtrar --- */
  const filteredArticles = useMemo(() => {
    return activeCategory === "Todos"
      ? articulos
      : articulos.filter((a) => a.categoria === activeCategory);
  }, [activeCategory, articulos]);

  /* --- Eliminar --- */
  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este artículo?")) return;
    await deleteDoc(doc(db, "articulos", id));
  };

  return (
    <div className="min-h-screen bg-[#FDFBFD] text-gray-800 font-sans selection:bg-pink-200 selection:text-pink-900 relative overflow-hidden">
      
      {/* Fondo Decorativo */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
         <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-300/20 rounded-full blur-[120px] mix-blend-multiply animate-pulse"></div>
         <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-rose-200/30 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-12">
        
        {/* 🌸 HEADER EDITORIAL */}
        <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-pink-100 px-4 py-1.5 rounded-full mb-6 shadow-sm">
             <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nova Glow Blog</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] mb-6">
            EL DIARIO <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-rose-600 italic font-serif pr-2">GLOW</span>
          </h1>
          
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
            Tu dosis diaria de inspiración. Desde las últimas tendencias hasta secretos de estilo que empoderan.
          </p>
        </motion.header>

        {/* 🔽 CATEGORÍAS (Tab Bar Moderno) */}
        <div className="flex justify-center mb-16">
            <div className="flex flex-wrap justify-center gap-2 bg-white/60 backdrop-blur-xl p-2 rounded-full border border-white/50 shadow-lg shadow-pink-100/50">
                {categories.map((category) => {
                    const isActive = activeCategory === category;
                    const param = category === "Todos"
                        ? "/inspiracion"
                        : `/inspiracion?tema=${Object.keys(CATEGORY_MAP).find((k) => CATEGORY_MAP[k] === category)}`;

                    return (
                        <Link
                            key={category}
                            to={param}
                            onClick={() => setActiveCategory(category)}
                            className={`relative px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                                isActive 
                                ? "text-white shadow-md" 
                                : "text-gray-500 hover:text-pink-600 hover:bg-white"
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-black rounded-full"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                {isActive && <CategoryIcon cat={category} />}
                                {category}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>

        {/* 📰 ARTÍCULOS GRID */}
        <section className="min-h-[400px]">
            {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1,2,3].map(i => <div key={i} className="h-96 bg-white rounded-[2.5rem] animate-pulse border border-gray-100"></div>)}
                 </div>
            ) : (
                <>
                    {filteredArticles.length > 0 ? (
                        <motion.div 
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredArticles.map((article, i) => (
                                    <motion.div
                                        layout
                                        key={article.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4, delay: i * 0.1 }}
                                        className="relative group"
                                    >
                                        {/* WRAPPER PARA ESTILIZAR EL ContentCard EXISTENTE */}
                                        <div className="h-full transition-transform duration-500 hover:-translate-y-2">
                                            <ContentCard article={article} maxWords={20} />
                                        </div>

                                        {/* Botón Eliminar (Admin) - Estilo Glass */}
                                        {esAdmin && (
                                            <motion.button
                                                whileHover={{ scale: 1.1, backgroundColor: "#ef4444", color: "#fff" }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleEliminar(article.id)}
                                                className="absolute top-4 right-4 bg-white/80 backdrop-blur text-red-500 p-3 rounded-full shadow-lg border border-red-100 z-20 transition-colors"
                                                title="Eliminar artículo"
                                            >
                                                <Trash2 size={18} />
                                            </motion.button>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-center py-20 bg-white/50 rounded-[3rem] border border-white"
                        >
                            <div className="text-6xl mb-4">🌪️</div>
                            <p className="text-xl text-gray-500 font-medium">
                                No hay artículos en <span className="text-pink-500 font-bold">"{activeCategory}"</span> por ahora.
                            </p>
                        </motion.div>
                    )}
                </>
            )}
        </section>

        {/* 🌟 SUSCRIPCIÓN */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24"
        >
            <div>
                <Suscripcion maxWords={15} />
            </div>
        </motion.div>

      </div>
    </div>
  );
}