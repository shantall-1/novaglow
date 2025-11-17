import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import RelatedCarousel from "../componen/RelatedCarousel";

export default function ArticuloDetalle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const cargarArticulo = async () => {
      const q = query(collection(db, "articulos"), where("slug", "==", slug));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const docu = snap.docs[0];
        const data = { id: docu.id, ...docu.data() };
        setArticle(data);
        setLikeCount(data.likes || 0);
        setComments(data.comments || []);

        // Artículos relacionados
        const qRel = query(collection(db, "articulos"), where("categoria", "==", data.categoria));
        const snapRel = await getDocs(qRel);
        const rel = [];
        snapRel.forEach((d) => {
          if (d.id !== docu.id) rel.push({ id: d.id, ...d.data() });
        });
        setRelated(rel);
      } else {
        setArticle(null);
      }
    };

    cargarArticulo();
  }, [slug]);

  const darLike = async () => {
    if (!article) return;
    const ref = doc(db, "articulos", article.id);
    await updateDoc(ref, { likes: likeCount + 1 });
    setLikeCount(likeCount + 1);
  };

  const enviarComentario = async () => {
    if (!article || commentText.trim().length < 2) return;
    const nuevoComentario = { text: commentText, date: Timestamp.now() };
    const ref = doc(db, "articulos", article.id);
    await updateDoc(ref, { comments: arrayUnion(nuevoComentario) });
    setComments([...comments, nuevoComentario]);
    setCommentText("");
  };

  if (!article)
    return <p className="text-center mt-10 text-gray-600">Artículo no encontrado ❌</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <button
        onClick={() => navigate("/inspiracion")}
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
      >
        ← Regresar al Blog
      </button>

      {/* Título y subtítulo */}
      <h1 className="text-4xl font-bold">{article.titulo}</h1>
      {article.subtitulo && (
        <h2 className="text-2xl font-bold text-fuchsia-700 mt-2">{article.subtitulo}</h2>
      )}

      <p className="text-gray-500 text-sm mt-1">
        {article.categoria} • {new Date(article.fecha).toLocaleDateString()}
      </p>

      {article.imagenUrl && (
        <img src={article.imagenUrl} className="w-full rounded-xl shadow-lg mt-4" />
      )}

      {/* Contenido respetando saltos de línea */}
      <p className="text-lg leading-relaxed text-gray-800 mt-4">
        {article.contenido.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </p>

      {/* Likes */}
      <div className="flex items-center gap-6 mt-6">
        <button
          onClick={darLike}
          className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
        >
          ❤️ {likeCount}
        </button>
      </div>

      {/* Comentarios */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-3">Comentarios ({comments.length})</h2>
        <div className="space-y-4">
          {comments.length === 0 && <p className="text-gray-600">Aún no hay comentarios 😌</p>}
          {comments.map((c, i) => (
            <div key={i} className="p-4 bg-gray-100 rounded-xl shadow-sm">
              <p className="text-gray-800">{c.text}</p>
              <span className="text-xs text-gray-500">{c.date?.toDate?.()?.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-4">
          <input
            type="text"
            placeholder="Escribe un comentario..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 p-2 rounded-xl border border-gray-300"
          />
          <button
            onClick={enviarComentario}
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-xl hover:bg-fuchsia-700 transition"
          >
            Enviar
          </button>
        </div>
      </div>

      {/* Carrusel de relacionados */}
      <RelatedCarousel items={related} />
    </div>
  );
}
