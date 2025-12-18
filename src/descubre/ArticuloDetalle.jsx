import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import ReactMarkdown from "react-markdown";


import { motion } from "framer-motion";

export default function ArticuloDetalle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [progress, setProgress] = useState(0);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [liking, setLiking] = useState(false);

  const palabras = article?.contenido?.split(" ").length || 0;
  const minutosLectura = Math.max(1, Math.ceil(palabras / 200));
  // -------------------------
  // CARGAR EL ARTÍCULO
  // -------------------------
  useEffect(() => {
    const cargarArticulo = async () => {
      const q = query(collection(db, "articulos"), where("slug", "==", slug));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const docu = snap.docs[0];
        const data = docu.data();
        setArticle({
          id: docu.id,
          ...data,
          likes: Array.isArray(data.likes) ? data.likes : [],
          comments: Array.isArray(data.comments) ? data.comments : [],
          imagenes: Array.isArray(data.imagenes) ? data.imagenes : [],
        });
      } else {
        setArticle(null);
      }
    };

    cargarArticulo();
  }, [slug]);

  // -------------------------
  // BARRA DE PROGRESO
  // -------------------------
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress((scrollTop / docHeight) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // -------------------------
  // ARTÍCULOS RELACIONADOS
  // -------------------------
  useEffect(() => {
    if (!article) return;

    const cargarRelacionados = async () => {
      const q = query(
        collection(db, "articulos"),
        where("categoria", "==", article.categoria)
      );

      const snap = await getDocs(q);

      const lista = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((a) => a.slug !== article.slug)
        .slice(0, 6);

      setRelated(lista);
    };

    cargarRelacionados();
  }, [article]);

  if (!article)
    return (
      <p className="text-center mt-10 text-gray-600">
        Artículo no encontrado ❌
      </p>
    );




  // -------------------------
  // LIKE
  // -------------------------
  const toggleLike = async () => {
    if (!usuario) {
      alert("Inicia sesión para dar me gusta");
      return;
    }

    if (liking) return;

    try {
      setLiking(true);

      const articleRef = doc(db, "articulos", article.id);
      const hasLiked = article.likes.includes(usuario.uid);

      await updateDoc(articleRef, {
        likes: hasLiked
          ? arrayRemove(usuario.uid)
          : arrayUnion(usuario.uid),
      });

      setArticle((prev) => ({
        ...prev,
        likes: hasLiked
          ? prev.likes.filter((id) => id !== usuario.uid)
          : [...prev.likes, usuario.uid],
      }));
    } catch (error) {
      console.error("Error al dar like:", error);
    } finally {
      setLiking(false);
    }
  };

  // -------------------------
  // COMENTARIOS
  // -------------------------
  const enviarComentario = async () => {
    if (!usuario) return alert("Inicia sesión para comentar");
    if (!newComment.trim()) return;

    const articleRef = doc(db, "articulos", article.id);

    const comentario = {
      id: Date.now(),
      texto: newComment,
      autor: usuario.email,
      fecha: new Date().toISOString(),
    };

    await updateDoc(articleRef, {
      comments: arrayUnion(comentario),
    });

    setArticle((prev) => ({
      ...prev,
      comments: [...(Array.isArray(prev.comments) ? prev.comments : []), comentario],
    }));

    setNewComment("");
  };

  // -------------------------
  // RENDER
  ;
  const hasLiked = article.likes.includes(usuario?.uid);


  return (
    <div className="relative min-h-screen bg-white">

      {/* BARRA PROGRESO */}
      <motion.div
        className="fixed top-0 left-0 h-[3px] bg-linear-to-r from-pink-500 via-fuchsia-500 to-purple-500 z-50"
        style={{ width: `${progress}%` }}
      />

      {/* VOLVER */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <button
          onClick={() => navigate("/inspiracion")}
          className="text-sm text-gray-500 hover:text-fuchsia-600"
        >
          ← Volver
        </button>
      </div>

      {/* HEADER */}
      <div className="max-w-3xl mx-auto px-6 mt-8 flex justify-between items-center">
        <p className="text-xs text-gray-400">
          ⏱️ {minutosLectura} min de lectura
        </p>

        <button
          onClick={() => setModoOscuro(!modoOscuro)}
          className="text-xs px-4 py-2 rounded-full border"
        >
          {modoOscuro ? "☀️ Modo claro" : "🌙 Modo lectura"}
        </button>
      </div>

      {/* GRID */}
      <div
        className={`
        max-w-7xl mx-auto px-6 py-20
        grid grid-cols-1 lg:grid-cols-[1fr_280px]
        gap-16
        ${modoOscuro ? "bg-[#0e0e11] text-gray-100" : ""}
      `}
      >

        {/* ARTÍCULO */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
  prose prose-lg
  max-w-[680px]
  mx-auto
  leading-[1.75]
  prose-p:text-gray-700
  prose-h2:tracking-tight
  prose-h3:text-gray-800
  ${modoOscuro ? "prose-invert" : ""}
`}>
          <h1 className="text-5xl font-serif italic text-transparent bg-clip-text bg-linear-to-r from-gray-800 to-rose-600">
            {article.titulo}
          </h1>

          {article.subtitulo && (
            <h2 className="text-2xl text-fuchsia-600 mt-6">
              {article.subtitulo}
            </h2>
          )}

          <p className="text-xs uppercase tracking-widest text-gray-400">
            {article.categoria} · {minutosLectura} min lectura
          </p>

          {article.imagenUrl && (
            <img
              src={article.imagenUrl}
              className="w-full rounded-2xl my-16"
            />
          )}

          <ReactMarkdown
            components={{
              p: ({ node, children }) => {
                const isFirst = node?.position?.start?.line === 1;
                if (!isFirst) return <p>{children}</p>;

                const text = children.toString();
                return (
                  <p>
                    <span className="float-left mr-3 text-6xl font-serif text-fuchsia-600 leading-none">
                      {text[0]}
                    </span>
                    {text.slice(1)}
                  </p>
                );
              },
            }}
          >
            {article.contenido}
          </ReactMarkdown>

          {/* IMÁGENES EXTRA */}
          {article.imagenes?.map((img, idx) => (
            <img
              key={idx}
              src={img}
              className="w-full my-24 rounded-3xl shadow-sm"
            />
          ))}

          {/* LIKE */}
          <button
            onClick={toggleLike}
            disabled={liking}
            className={`
    inline-flex items-center gap-2 mt-20
    text-xs font-medium transition
    ${hasLiked
                ? "text-fuchsia-600"
                : "text-gray-400 hover:text-fuchsia-600"}
    ${liking ? "opacity-50 cursor-not-allowed" : ""}
  `}
          >
            <img
              src={
                hasLiked
                  ? "https://img.icons8.com/?size=100&id=w0wAxnBWQKQs&format=png&color=D946EF"
                  : "https://img.icons8.com/?size=100&id=w0wAxnBWQKQs&format=png&color=9CA3AF"
              }
              alt="Me gusta"
              className="w-4 h-4 transition-transform duration-200"
            />

            <span>{article.likes.length}</span>

            <span className="hidden sm:inline">
              {hasLiked ? "Te gusta" : "Me gusta"}
            </span>
          </button>


          {/* COMENTARIOS */}
          <div className="mt-20 pt-16 border-t">
            <h3 className="text-xl font-bold mb-6">Comentarios</h3>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-4 border rounded-xl"
              placeholder="Escribe un comentario…"
            />

            <button
              onClick={enviarComentario}
              className="mt-4 px-6 py-2 bg-fuchsia-500 text-white rounded-lg"
            >
              Enviar
            </button>
          </div>

          <div className="mt-40 pt-20 border-t text-center max-w-xl mx-auto">
            <p className="text-gray-500 text-sm mb-10">
              Gracias por leer.
              Explora más ideas que inspiran ✨
            </p>

            <button
              onClick={() => navigate("/inspiracion")}
              className="
      inline-flex items-center gap-3
      px-10 py-4 rounded-full
      bg-linear-to-r from-pink-500 to-fuchsia-600
      text-white text-sm font-medium
      shadow-xl hover:scale-105 transition
    "
            >
              ← Volver a inspiración
            </button>
          </div>

        </motion.article>

        {/* SIDEBAR */}
        <aside className="hidden lg:block sticky top-32">
          <h4 className="text-sm font-semibold text-gray-500 mb-6">
            Relacionado
          </h4>

          <div className="space-y-6">
            {related.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/articulo/${item.slug}`)}
                className="cursor-pointer group border-l-2 border-transparent hover:border-fuchsia-500 pl-4 transition"
              >
                <p className="text-sm font-medium leading-snug text-gray-700 group-hover:text-fuchsia-600">
                  {item.titulo}
                </p>
                <span className="text-xs text-gray-400">
                  {item.categoria}
                </span>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div >
  );
}