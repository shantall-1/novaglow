
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
          <p className="text-center text-gray-600">No hay favoritos aún 😢</p>
        ) : (
          <div className="flex flex-col gap-4">
            {favoritos.map((f) => (
              <div key={f.id} className="flex gap-3 items-center border p-3 rounded-xl">
                <img
                  src={f.image}
                  className="w-16 h-16 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="font-bold">{f.name}</h3>
                </div>
                <button
                  onClick={() => quitarFavorito(f.id)}
                  className="text-red-500 text-xl"
                >
                  ♥
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
