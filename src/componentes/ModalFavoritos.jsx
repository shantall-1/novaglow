// src/componentes/ModalFavoritos.jsx
import { useFavoritos } from "../context/FavoriteContext";
import { Link } from "react-router-dom";

export default function ModalFavoritos({ abierto, cerrar }) {
  const { favoritos, quitarFavorito } = useFavoritos();

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-3xl max-w-lg w-full relative shadow-xl">
        <button
          onClick={cerrar}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-3xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4">❤️ Tus favoritos</h2>

        {favoritos.length === 0 ? (
          <p className="text-center text-gray-500">No hay favoritos aún 😢</p>
        ) : (
          <div className="flex flex-col gap-4">
            {favoritos.map((f) => (
              <div key={f.id} className="flex gap-3 items-center border p-3 rounded-xl">
                <img
                  src={f.image}
                  className="w-16 h-16 object-cover rounded-xl"
                  alt={f.name || ""}
                />
                <div className="flex-1">
                  <h3 className="font-bold">{f.name}</h3>
                  <p className="text-pink-600 font-semibold">
                    {f.price ? `S/${Number(f.price).toFixed(2)}` : ""}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {/* Aquí pasamos f.id (el id del documento en Firestore) */}
                  <button
                    onClick={() => quitarFavorito(f.id)}
                    className="px-3 py-2 bg-white border rounded-xl hover:bg-pink-50"
                  >
                    Eliminar
                  </button>
                  <Link
                    to={`/producto/${f.idProducto}`}
                    onClick={cerrar}
                    className="px-3 py-2 bg-pink-500 text-white rounded-xl text-center"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

