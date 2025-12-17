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
    if (!usuario) return alert("Debes iniciar sesión para dar like");

    const articleRef = doc(db, "articulos", article.id);
    const likesArray = Array.isArray(article.likes) ? article.likes : [];
    const hasLiked = likesArray.includes(usuario.uid);

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
  // -------------------------
  const paragraphs = article.contenido ? article.contenido.split("\n\n") : [];
  const extraImages = Array.isArray(article.imagenes) ? article.imagenes : [];

return (
  <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
    {/* BARRA DE PROGRESO */}
    <motion.div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 z-50"
      style={{ width: `${progress}%` }}
    />

    {/* BOTÓN VOLVER */}
    <button
      onClick={() => navigate("/inspiracion")}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-fuchsia-600 transition mb-8"
    >
      ← Volver
    </button>

    {/* LAYOUT PRINCIPAL */}
    <div className="flex gap-20 mt-16">
      {/* ARTÍCULO */}
      <div className="flex-1">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-gray-900"
        >
          {/* TÍTULO */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {article.titulo}
          </h1>

          {/* SUBTÍTULO */}
          {article.subtitulo && (
            <h2 className="text-xl md:text-2xl font-medium text-fuchsia-600 mt-6">
              {article.subtitulo}
            </h2>
          )}

          {/* META */}
          <p className="text-sm text-gray-500 mt-4">
            {article.categoria} • {new Date(article.fecha).toLocaleDateString()}
          </p>

          {/* IMAGEN PRINCIPAL */}
          {article.imagenUrl && (
            <motion.img
              src={article.imagenUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full rounded-2xl my-16"
            />
          )}

          {/* CONTENIDO */}
          <div
            className="prose prose-lg max-w-none prose-gray prose-p:leading-relaxed prose-p:my-6 prose-img:my-16 prose-img:rounded-2xl prose-h2:mt-20 prose-h3:mt-14"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                p: ({ node, children }) => {
                  const isFirst = node?.position?.start?.line === 1;
                  if (!isFirst) return <p>{children}</p>;

                  const text = children.toString();
                  const firstLetter = text.charAt(0);
                  const rest = text.slice(1);

                  return (
                    <p>
                      <span className="float-left mr-3 text-6xl font-extrabold text-fuchsia-600 leading-none">
                        {firstLetter}
                      </span>
                      {rest}
                    </p>
                  );
                },
              }}
            >
              {article.contenido}
            </ReactMarkdown>

            {/* IMÁGENES INTERCALADAS */}
            {extraImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                className="w-full my-16 rounded-2xl"
              />
            ))}
          </div>

          {/* LIKE */}
          <button
            onClick={toggleLike}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-fuchsia-600 transition mt-12"
          >
            ❤️ {article.likes.length}
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
              className="mt-4 px-6 py-2 bg-fuchsia-500 text-white rounded-lg text-sm font-semibold"
            >
              Enviar
            </button>

            <div className="mt-8 space-y-6">
              {article.comments.map((c) => (
                <div key={c.id}>
                  <p className="font-semibold">{c.autor}</p>
                  <p className="text-gray-700">{c.texto}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(c.fecha).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.article>
      </div>

      {/* SIDEBAR */}
      <aside className="hidden lg:block w-72 sticky top-32 self-start">
        <h4 className="text-sm font-semibold text-gray-500 mb-6">Relacionado</h4>
        <div className="space-y-6">
          {related.map((item) => (
            <div key={item.id} className="cursor-pointer group">
              <p className="text-sm font-medium leading-snug group-hover:text-fuchsia-600 transition">
                {item.titulo}
              </p>
              <span className="text-xs text-gray-400">{item.categoria}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  </div>
);
}