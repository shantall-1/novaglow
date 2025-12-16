import { useState, useEffect, useRef } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// Animaciones
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminBlog() {
  const textareaRef = useRef(null);
  const [mostrarArticulos, setMostrarArticulos] = useState(false);

  const [articulos, setArticulos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("Tendencias");
  const [imagenUrl, setImagenUrl] = useState("");

  const [imagenes, setImagenes] = useState([]);
  const [loadingGuardar, setLoadingGuardar] = useState(false);
  const [loadingEnviar, setLoadingEnviar] = useState(false);

  const [imagenesContenido, setImagenesContenido] = useState([]);
  const [imagenTemp, setImagenTemp] = useState("");


  useEffect(() => {
    setSlug(
      titulo
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
    );
  }, [titulo]);

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

  const generarSlug = (texto) =>
    texto
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  const validarFormulario = () => {
    if (!titulo.trim()) {
      alert("❌ El título es obligatorio");
      return false;
    }
    if (!contenido.trim()) {
      alert("❌ El contenido no puede estar vacío");
      return false;
    }
    return true;
  };

  const agregarImagenContenido = () => {
    if (!imagenTemp.trim()) return;

    setImagenesContenido((prev) => [...prev, imagenTemp.trim()]);
    setImagenTemp("");
  };

  const eliminarImagenContenido = (index) => {
    setImagenesContenido((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const insertarImagenesEnTexto = () => {
    if (imagenesContenido.length === 0) return;

    const markdownImgs = imagenesContenido
      .map((url) => `![imagen](${url})`)
      .join("\n");

    setContenido((prev) =>
      prev ? `${prev}\n\n${markdownImgs}` : markdownImgs
    );

    setImagenesContenido([]);
  };


  const guardarArticulo = async () => {
    if (!validarFormulario()) return;

    setLoadingGuardar(true);

    const baseSlug = generarSlug(titulo);
    let uniqueSlug = baseSlug;

    try {
      const snapshot = await getDocs(collection(db, "articulos"));
      const slugs = snapshot.docs.map((d) => d.data().slug);

      let counter = 1;
      while (slugs.includes(uniqueSlug) && (!editando || uniqueSlug !== slug)) {
        uniqueSlug = `${baseSlug}-${counter++}`;
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

      if (editando) {
        await updateDoc(doc(db, "articulos", editando), data);
        alert("✏️ Artículo actualizado");
      } else {
        await addDoc(collection(db, "articulos"), data);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        alert("🎉 Artículo creado");
      }

      limpiarForm();
    } catch (error) {
      console.error(error);
      alert("❌ Error al guardar el artículo");
    } finally {
      setLoadingGuardar(false);
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
    if (!window.confirm("¿Seguro que deseas eliminar este artículo?")) return;
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
    <>
      {/* FONDO CON VIDEO */}
      <div className="relative min-h-screen overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="https://v.ftcdn.net/18/24/78/81/700_F_1824788120_joM4GOMppuH8ifHUjfTs3hK0tVFr0I8k.mp4"
              type="video/mp4"
            />
          </video>

          {/* Overlay suave */}
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>

        {/* CONTENIDO */}
        <div className="bg-transparent relative z-10 min-h-screen pt-28 px-6 md:px-12">
          <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9] mb-16 drop-shadow-2xl">
            Panel <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600 italic font-serif">
              de Administración
            </span>
          </h1>


          {/* FORMULARIO */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="
    bg-white/70 backdrop-blur-md
    rounded-[2.5rem]
    shadow-2xl
    border border-gray-200
    p-8 space-y-6
    max-w-5xl mx-auto
  "
          >
            <h2 className="text-3xl font-bold text-gray-800">
              {editando ? "Editar artículo" : "Crear nuevo artículo ✨"}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="border p-4 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />

              <input
                className="border p-4 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none"
                placeholder="Subtítulo"
                value={subtitulo}
                onChange={(e) => setSubtitulo(e.target.value)}
              />
            </div>

            <input
              className="w-full border p-3 rounded-xl bg-gray-50 text-gray-500"
              value={slug}
              readOnly
            />

            <textarea
              ref={textareaRef}
              className="w-full border p-4 rounded-2xl min-h-[220px] focus:ring-2 focus:ring-pink-300 outline-none resize-y"
              placeholder="Contenido con Markdown"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
            />

            {/* IMÁGENES DENTRO DEL TEXTO */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Imágenes dentro del contenido
              </h3>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Pega la URL de la imagen"
                  value={imagenTemp}
                  onChange={(e) => setImagenTemp(e.target.value)}
                  className="flex-1 border p-3 rounded-xl focus:ring-2 focus:ring-pink-300 outline-none"
                />

                <button
                  type="button"
                  onClick={agregarImagenContenido}
                  className="px-4 py-2 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600"
                >
                  ➕
                </button>
              </div>

              {/* PREVIEW DE IMÁGENES */}
              {imagenesContenido.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagenesContenido.map((url, index) => (
                    <div
                      key={index}
                      className="relative group rounded-xl overflow-hidden shadow"
                    >
                      <img
                        src={url}
                        alt="preview"
                        className="w-full h-32 object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => eliminarImagenContenido(index)}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* INSERTAR EN TEXTO */}
              {imagenesContenido.length > 0 && (
                <button
                  type="button"
                  onClick={insertarImagenesEnTexto}
                  className="px-6 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-black transition"
                >
                  📥 Insertar imágenes en el texto
                </button>
              )}
            </div>


            {/* PREVIEW */}
            <AnimatePresence>
              {contenido && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-2xl bg-white p-6 shadow-inner"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      p: ({ children }) => {
                        const soloImagenes =
                          Array.isArray(children) &&
                          children.every(
                            (child) =>
                              typeof child === "object" &&
                              child?.type === "img"
                          );

                        if (soloImagenes) {
                          return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6">
                              {children}
                            </div>
                          );
                        }

                        return <p className="mb-4 leading-relaxed">{children}</p>;
                      },
                      img: ({ ...props }) => (
                        <img
                          {...props}
                          className="w-full h-48 object-cover rounded-xl shadow-md"
                        />
                      ),
                    }}
                  >
                    {contenido}
                  </ReactMarkdown>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CATEGORÍA */}
            <select
              className="w-full border p-4 rounded-xl focus:ring-2 focus:ring-pink-300"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="Tendencias">Tendencias</option>
              <option value="Guía de Estilo">Guía de Estilo</option>
              <option value="Inspiración">Inspiración</option>
            </select>

            {/* IMAGEN PRINCIPAL */}
            <input
              className="w-full border p-4 rounded-xl"
              placeholder="URL imagen principal"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
            />

            {imagenUrl && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={imagenUrl}
                className="w-full h-64 object-cover rounded-2xl"
              />
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={guardarArticulo}
                disabled={loadingGuardar}
                className="
      px-10 py-4
      text-sm
      leading-none
      rounded-lg
      bg-gradient-to-r from-pink-500 to-rose-600
      text-white font-medium
      shadow
      hover:scale-105 transition
      disabled:opacity-50 disabled:cursor-not-allowed
    "
              >
                Guardar
              </button>

              {editando && (
                <button
                  onClick={limpiarForm}
                  className="
        px-10 py-4
        text-sm
        leading-none
        rounded-lg
        bg-gray-200 hover:bg-gray-300
        text-gray-700 font-medium
      shadow
      hover:scale-105 transition
      disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setMostrarArticulos(true)}
                className="px-10 py-4 text-sm
      leading-none
      rounded-lg
      bg-gradient-to-r from-pink-500 to-rose-400
      text-white font-medium
      shadow
      hover:scale-105 transition
      disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📚 Ver artículos creados
                </button>
              </div>

            </motion.div>

      {/* LISTADO */}
      <AnimatePresence>
        {mostrarArticulos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 overflow-hidden"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-pink-600">
                  Artículos creados
                </h2>
                <button
                  onClick={() => setMostrarArticulos(false)}
                  className="text-gray-500 hover:text-gray-800 text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="grid gap-6">
                {articulos.map((art) => (
                  <motion.div
                    key={art.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row gap-4 items-center"
                  >
                    {art.imagenUrl && (
                      <img
                        src={art.imagenUrl}
                        alt={art.titulo}
                        className="w-full md:w-40 h-32 object-cover rounded-xl"
                      />
                    )}

                    <div className="flex-1">
                      <h3 className="text-xl font-black text-pink-600">
                        {art.titulo}
                      </h3>
                      <p className="text-gray-500 text-sm">{art.slug}</p>
                      <span className="inline-block mt-1 text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
                        {art.categoria}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => cargarArticulo(art)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => borrarArticulo(art.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Borrar
                      </button>

                      <button
                        onClick={() => enviarArticulo(art.id)}
                        disabled={loadingEnviar}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        {loadingEnviar ? "Enviando…" : "Enviar Gmail"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div >
      </div >
    </>
  );
}
    