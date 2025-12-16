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
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import RelatedSidebar from "../componen/RelatedSidebar";
import { motion } from "framer-motion";

export default function ArticuloDetalle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [progress, setProgress] = useState(0);

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
  // LIKE SEGURO
  // -------------------------
  const toggleLike = async () => {
    if (!usuario) return alert("Debes iniciar sesión para dar like");

    const articleRef = doc(db, "articulos", article.id);
    const likesArray = Array.isArray(article.likes) ? article.likes : [];
    const hasLiked = (article.likes || []).includes(usuario.uid);


    await updateDoc(articleRef, {
      likes: hasLiked ? arrayRemove(usuario.uid) : arrayUnion(usuario.uid),
    });

    setArticle((prev) => ({
      ...prev,
      likes: hasLiked
        ? likesArray.filter((id) => id !== usuario.uid)
        : [...likesArray, usuario.uid],
    }));
  };

  // -------------------------
  // COMENTARIOS SEGUROS
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
  // INTERCALAR IMÁGENES
  // -------------------------
  const paragraphs = article.contenido ? article.contenido.split("\n\n") : [];
  const extraImages = Array.isArray(article.imagenes) ? article.imagenes : [];
return (
  <div className="max-w-7xl mx-auto px-6 py-10">

    {/* BARRA DE PROGRESO */}
    <motion.div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-fuchsia-600 z-50"
      style={{ width: `${progress}%` }}
    />

    {/* BOTÓN VOLVER */}
    <button
      onClick={() => navigate("/inspiracion")}
      className="px-4 py-2 bg-gray-200 rounded hover:bg-fuchsia-400 transition"
    >
      ← Regresar al Blog
    </button>

    {/* GRID PRINCIPAL */}
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 mt-10">

      {/* ========= ARTÍCULO ========= */}
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >

        {/* TÍTULO */}
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
          {article.titulo}
        </h1>

        {/* SUBTÍTULO */}
        {article.subtitulo && (
          <h2 className="text-2xl font-semibold text-fuchsia-700 mt-4">
            {article.subtitulo}
          </h2>
        )}

        {/* META */}
        <p className="text-gray-500 text-sm mt-2">
          {article.categoria} • {new Date(article.fecha).toLocaleDateString()}
        </p>

        {/* IMAGEN PRINCIPAL */}
        {article.imagenUrl && (
          <motion.img
            src={article.imagenUrl}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-h-[520px] object-cover rounded-3xl shadow-2xl my-10"
          />
        )}

        {/* CONTENIDO */}
        <div className="prose prose-lg max-w-none space-y-6">
          {paragraphs.map((p, i) => (
            <div key={i} className="space-y-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {p}
              </ReactMarkdown>

              {extraImages[i] && (
                <img
                  src={extraImages[i]}
                  className="w-2/3 mx-auto rounded-xl shadow-lg"
                />
              )}
            </div>
          ))}
        </div>

        {/* LIKE */}
        <button
          onClick={toggleLike}
          className={`mt-12 px-6 py-3 rounded-full text-lg font-semibold transition ${
           article.likes?.includes(usuario?.uid)

              ? "bg-fuchsia-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          ❤️ {article.likes.length}
        </button>

        {/* COMENTARIOS */}
        <div className="mt-16">
          <h3 className="text-2xl font-extrabold mb-4">Comentarios</h3>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="Escribe un comentario…"
          />

          <button
            onClick={enviarComentario}
            className="mt-3 px-5 py-2 bg-fuchsia-500 text-white rounded-lg"
          >
            Enviar
          </button>

          <div className="mt-6 space-y-4">
            {article.comments.map((c) => (
              <div key={c.id} className="bg-gray-100 p-4 rounded-xl">
                <p className="font-semibold">{c.autor}</p>
                <p>{c.texto}</p>
                <span className="text-sm text-gray-500">
                  {new Date(c.fecha).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
 
      </motion.article>

     {/* ========= SIDEBAR ========= */}
      <aside className="hidden lg:block sticky top-24 self-start">
  <RelatedSidebar items={related} />
</aside>

    </div>
  </div>
);
}
