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
import RelatedCarousel from "../componen/RelatedCarousel";

export default function ArticuloDetalle() {
  const { slug } = useParams();
  const navigate = useNavigate();
const { usuario } = useAuth();

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [newComment, setNewComment] = useState("");

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
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      {/* BOTÓN VOLVER */}
      <button
        onClick={() => navigate("/inspiracion")}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-fuchsia-400 transition"
      >
        ← Regresar al Blog
      </button>

      {/* TÍTULO */}
      <h1 className="text-5xl font-extrabold text-gray-900">
        {article.titulo}
      </h1>

      {/* SUBTÍTULO */}
      {article.subtitulo && (
        <h2 className="text-2xl font-semibold text-fuchsia-700 mt-4">
          {article.subtitulo}
        </h2>
      )}

      {/* FECHA + CATEGORÍA */}
      <p className="text-gray-500 text-sm mt-1">
        {article.categoria} • {new Date(article.fecha).toLocaleDateString()}
      </p>

      {/* IMAGEN PRINCIPAL */}
      {article.imagenUrl && (
        <img
          src={article.imagenUrl}
          className="w-full rounded-xl shadow-xl mt-6 mx-auto"
        />
      )}

      {/* CONTENIDO + IMÁGENES INTERCALADAS */}
      <div className="prose prose-lg mx-auto mt-6 space-y-6">
        {paragraphs.map((p, i) => (
          <div key={i} className="space-y-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: (props) => (
                  <h1 {...props} className="text-4xl font-bold mt-8 mb-4 text-gray-900" />
                ),
                h2: (props) => (
                  <h2
                    {...props}
                    className="text-2xl font-semibold mt-6 mb-3 text-fuchsia-700"
                  />
                ),
                h3: (props) => (
                  <h3 {...props} className="text-xl font-semibold mt-4 mb-2 text-pink-700" />
                ),
                p: (props) => (
                  <p {...props} className="text-gray-700 leading-relaxed mt-3" />
                ),
                img: (props) => (
                  <img
                    {...props}
                    className="w-2/3 mx-auto rounded-lg shadow-md my-4"
                  />
                ),
              }}
            >
              {p}
            </ReactMarkdown>

            {extraImages[i] && (
              <img
                src={extraImages[i]}
                className="w-2/3 mx-auto rounded-lg shadow-md"
              />
            )}
          </div>
        ))}
      </div>

      {/* LIKE */}
      <button
        onClick={toggleLike}
        className={`px-4 py-2 rounded-lg text-lg ${
          (Array.isArray(article.likes) ? article.likes : []).includes(usuario?.uid)
            ? "bg-fuchsia-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        ❤️ {(Array.isArray(article.likes) ? article.likes : []).length || 0}
      </button>

      {/* COMENTARIOS */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-800">Comentarios</h3>

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 border rounded-lg mt-3"
          placeholder="Escribe un comentario…"
        ></textarea>

        <button
          onClick={enviarComentario}
          className="mt-2 px-4 py-2 bg-fuchsia-500 text-white rounded-lg"
        >
          Enviar
        </button>

        <div className="mt-6 space-y-4">
          {(Array.isArray(article.comments) ? article.comments : []).map((c) => (
            <div key={c.id} className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold">{c.autor}</p>
              <p>{c.texto}</p>
              <span className="text-sm text-gray-500">
                {new Date(c.fecha).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CARRUSEL DE RELACIONADOS */}
      <RelatedCarousel items={related} />
    </div>
  );
}
