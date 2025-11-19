import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import confetti from "canvas-confetti";

   
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function AdminBlog() {
  const [articulos, setArticulos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("Tendencias");
  const [imagenUrl, setImagenUrl] = useState("");
  const [loadingEnviar, setLoadingEnviar] = useState(false);
  const [imagenes, setImagenes] = useState([]);

  // Agregar nueva imagen (versión correcta sin warnings)
  const agregarImagen = (url) =>
    setImagenes((prev) => [...prev, url]);

  // Eliminar imagen
  const eliminarImagen = (index) =>
    setImagenes((prev) => prev.filter((_, i) => i !== index));

  // Autoslug
  useEffect(() => {
    setSlug(
      titulo
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
    );
  }, [titulo]);

  // Cargar artículos
  useEffect(() => {
    const q = query(collection(db, "articulos"), orderBy("fecha", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setArticulos(data);
    });
    return () => unsub();
  }, []);

  const limpiarForm = () => {
    setTitulo("");
    setSubtitulo("");
    setSlug("");
    setContenido("");
    setCategoria("Tendencias");
    setImagenUrl("");
    setImagenes([]);
    setEditando(null);
  };

  const guardarArticulo = async () => {
    if (!titulo.trim() || !contenido.trim()) {
      alert("El título y el contenido son obligatorios");
      return;
    }

    let baseSlug = titulo
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    let uniqueSlug = baseSlug;

    const snapshot = await getDocs(collection(db, "articulos"));
    const slugs = snapshot.docs.map((d) => d.data().slug);

    let counter = 1;
    while (slugs.includes(uniqueSlug) && (!editando || uniqueSlug !== slug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const data = {
      titulo,
      subtitulo,
      slug: uniqueSlug,
      contenido,
      categoria,
      imagenUrl,
      imagenes,
      fecha: Date.now(),
    };

    try {
      if (editando) {
        await updateDoc(doc(db, "articulos", editando), data);
        alert("Artículo actualizado ✨");
      } else {
        await addDoc(collection(db, "articulos"), data);
        alert("Artículo creado 🎉");
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
      limpiarForm();
    } catch (e) {
      console.error(e);
      alert("Error guardando artículo");
    }
  };

  const cargarArticulo = (art) => {
    setEditando(art.id);
    setTitulo(art.titulo);
    setSubtitulo(art.subtitulo || "");
    setSlug(art.slug);
    setContenido(art.contenido);
    setCategoria(art.categoria);
    setImagenUrl(art.imagenUrl || "");
    setImagenes(art.imagenes || []);
  };

  const borrarArticulo = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este artículo?")) return;
    await deleteDoc(doc(db, "articulos", id));
  };

  const enviarArticulo = async (id) => {
    setLoadingEnviar(true);
    try {
      const res = await fetch("http://localhost:3001/enviar-articulos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articuloId: id }),
      });

      const data = await res.text();
      alert(data);
      confetti({ particleCount: 100, spread: 70 });
    } catch (err) {
      console.error(err);
      alert("Error enviando el artículo");
    }
    setLoadingEnviar(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <h1 className="text-4xl font-extrabold text-fuchsia-600 text-center tracking-tight animate-pulse">
        Panel de Blog
      </h1>

      {/* FORMULARIO */}
      <div className="p-6 bg-white rounded-2xl shadow-lg space-y-6 border border-pink-200">
        <h2 className="text-2xl font-bold text-gray-700">
          {editando ? "Editar artículo" : "Crear nuevo artículo"}
        </h2>

        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Subtítulo"
          value={subtitulo}
          onChange={(e) => setSubtitulo(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded-lg bg-gray-100 text-gray-600"
          value={slug}
          readOnly
        />

        {/* AREA DE TEXTO - MARKDOWN */}
        <textarea
          className="w-full border p-3 rounded-lg h-56"
          placeholder="Contenido (Markdown soportado)"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />

        {/* PREVIEW */}
        {contenido && (
          <div className="mt-4 border rounded-lg bg-gray-50 p-4">
            <ReactMarkdown
            remarkPlugins={[remarkGfm]}
             rehypePlugins={[rehypeRaw]}
             components={{
                 h1: (props) => (
           <h1 {...props} className="text-3xl font-bold mt-6 mb-3 text-gray-800" />
             ),
                 h2: (props) => (
          <h2 {...props} className="text-xl font-semibold mt-4 mb-2 text-fuchsia-600" />
              ),
                 h3: (props) => (
          <h3 {...props} className="text-lg font-semibold mt-3 mb-2 text-pink-600" />
         ),
                 p: (props) => (
          <p {...props} className="mt-3 mb-3 text-gray-700 leading-relaxed" />
           ),
                  img: (props) => (
         <img
           {...props}
            className="mx-auto my-4 w-1/2 rounded-lg shadow-sm"
      />
    ),
  }}
>
  {contenido}
</ReactMarkdown>

          </div>
        )}

        {/* IMÁGENES ADICIONALES */}
        {imagenes.map((url, i) => (
          <div key={i} className="flex items-center gap-2 mt-2">
            <img
              src={url}
              className="w-48 h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => eliminarImagen(i)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Eliminar
            </button>
          </div>
        ))}

        <input
          type="text"
          placeholder="URL de imagen adicional (Enter para agregar)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              agregarImagen(e.target.value);
              e.target.value = "";
            }
          }}
          className="w-full border p-2 rounded-lg mt-2"
        />

        {/* CATEGORÍA */}
        <select
          className="w-full border p-3 rounded-lg"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="Tendencias">Tendencias</option>
          <option value="Guía de Estilo">Guía de Estilo</option>
          <option value="Inspiración">Inspiración</option>
        </select>

        {/* IMAGEN PRINCIPAL */}
        <input
          className="w-full border p-3 rounded-lg"
          placeholder="URL de la imagen principal"
          value={imagenUrl}
          onChange={(e) => setImagenUrl(e.target.value)}
        />

        {imagenUrl && (
          <img
            src={imagenUrl}
            className="w-full h-56 object-cover rounded-lg border mt-3"
          />
        )}

        <div className="flex gap-4 mt-3">
          <button
            onClick={guardarArticulo}
            className="bg-fuchsia-600 text-white px-5 py-2 rounded-lg font-semibold"
          >
            {editando ? "Guardar cambios" : "Crear"}
          </button>

          {editando && (
            <button
              onClick={limpiarForm}
              className="bg-gray-300 px-5 py-2 rounded-lg"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* LISTA ARTÍCULOS */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-700">
          Artículos publicados
        </h2>

        {articulos.map((art) => (
          <div
            key={art.id}
            className="p-4 border rounded-xl flex flex-col md:flex-row items-center gap-4 bg-white shadow"
          >
            {art.imagenUrl && (
              <img
                src={art.imagenUrl}
                className="w-full md:w-32 h-32 object-cover rounded-lg"
              />
            )}

            <div className="flex-1 space-y-1">
              <h3 className="font-extrabold text-lg text-fuchsia-600">
                {art.titulo}
              </h3>

              {art.subtitulo && (
                <h4 className="text-md font-semibold text-pink-600">
                  {art.subtitulo}
                </h4>
              )}

              <p className="text-sm text-gray-500">{art.slug}</p>
              <p className="text-sm mt-1 text-gray-600">{art.categoria}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => cargarArticulo(art)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>

              <button
                onClick={() => borrarArticulo(art.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Borrar
              </button>

              <button
                onClick={() => enviarArticulo(art.id)}
                disabled={loadingEnviar}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                {loadingEnviar ? "Enviando..." : "Enviar Gmail"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
