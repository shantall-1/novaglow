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

  // Limpiar formulario
  const limpiarForm = () => {
    setTitulo("");
    setSubtitulo("");
    setSlug("");
    setContenido("");
    setCategoria("Tendencias");
    setImagenUrl("");
    setEditando(null);
  };

  // Guardar o actualizar artículo
  const guardarArticulo = async () => {
    if (!titulo.trim() || !contenido.trim()) {
      alert("El título y el contenido son obligatorios");
      return;
    }

    let baseSlug = titulo.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
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

  // Cargar artículo para editar
  const cargarArticulo = (art) => {
    setEditando(art.id);
    setTitulo(art.titulo);
    setSubtitulo(art.subtitulo || "");
    setSlug(art.slug);
    setContenido(art.contenido);
    setCategoria(art.categoria);
    setImagenUrl(art.imagenUrl || "");
  };

  // Eliminar artículo
  const borrarArticulo = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este artículo?")) return;
    await deleteDoc(doc(db, "articulos", id));
  };

  // Enviar artículo a suscriptores por Gmail
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
      <div className="p-6 bg-white rounded-2xl shadow-lg space-y-4 border border-pink-200 transition-transform transform hover:scale-105 duration-200">
        <h2 className="text-2xl font-bold text-gray-700">{editando ? "Editar artículo" : "Crear nuevo artículo"}</h2>
        <input className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} />
        <input className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition" placeholder="Subtítulo" value={subtitulo} onChange={e => setSubtitulo(e.target.value)} />
        <input className="w-full border p-3 rounded-lg bg-gray-100 text-gray-600" value={slug} readOnly />
        <textarea className="w-full border p-3 rounded-lg h-48 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition" placeholder="Contenido" value={contenido} onChange={e => setContenido(e.target.value)} />
        <select className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition" value={categoria} onChange={e => setCategoria(e.target.value)}>
          <option value="Tendencias">Tendencias</option>
          <option value="Guía de Estilo">Guía de Estilo</option>
          <option value="Inspiración">Inspiración</option>
        </select>
        <input className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition" placeholder="URL de la imagen" value={imagenUrl} onChange={e => setImagenUrl(e.target.value)} />
        {imagenUrl && <img src={imagenUrl} className="w-full h-56 object-cover rounded-lg border mt-3 shadow-sm" />}

        <div className="flex gap-4 mt-3">
          <button onClick={guardarArticulo} className="bg-fuchsia-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-fuchsia-700 transition-shadow shadow-md hover:shadow-xl">
            {editando ? "Guardar cambios" : "Crear"}
          </button>
          {editando && <button onClick={limpiarForm} className="bg-gray-300 px-5 py-2 rounded-lg hover:bg-gray-400 transition">Cancelar</button>}
        </div>
      </div>

      {/* LISTA DE ARTÍCULOS */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-700">Artículos publicados</h2>
        {articulos.map((art) => (
          <div key={art.id} className="p-4 border rounded-xl flex flex-col md:flex-row md:items-center gap-4 bg-white shadow hover:shadow-lg transition-shadow duration-200 transform hover:-translate-y-1">
            {art.imagenUrl && <img src={art.imagenUrl} className="w-full md:w-32 h-32 object-cover rounded-lg shadow-sm" />}
            <div className="flex-1 space-y-1">
              <h3 className="font-extrabold text-lg text-fuchsia-600">{art.titulo}</h3>
              {art.subtitulo && (
                <h4 className="text-md font-semibold text-pink-600">{art.subtitulo}</h4>
              )}
              <p className="text-sm text-gray-500">{art.slug}</p>
              <p className="text-sm mt-1 text-gray-600 font-medium">{art.categoria}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => cargarArticulo(art)} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition">Editar</button>
              <button onClick={() => borrarArticulo(art.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">Borrar</button>
              <button onClick={() => enviarArticulo(art.id)} disabled={loadingEnviar} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition">
                {loadingEnviar ? "Enviando..." : "Enviar por Gmail"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
