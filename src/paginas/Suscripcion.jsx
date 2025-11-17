import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import confetti from "canvas-confetti";

export default function Suscripcion({ minimal = false }) {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      await addDoc(collection(db, "suscriptores"), {
        email,
        fecha: serverTimestamp(),
      });

      setSuccess(true);
      setEmail("");
      if (!minimal) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Error guardando suscripción:", err);
    }
  };

  return (
    <div className={minimal ? "w-full" : "p-6 max-w-md mx-auto mt-4 bg-white rounded-2xl shadow-xl border flex flex-col items-center"}>
      
      {!minimal && <h2 className="text-2xl font-bold text-fuchsia-600 mb-4 animate-pulse">¡Suscríbete a nuestro newsletter!</h2>}
      
      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2">
        <input
          type="email"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={minimal
            ? "border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            : "border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition"}
          required
        />
        <button
          type="submit"
          className={minimal
            ? "bg-pink-500 text-white p-2 rounded font-medium hover:bg-pink-600 transition"
            : "bg-fuchsia-600 text-white p-3 rounded-xl font-semibold shadow-lg hover:bg-fuchsia-700 hover:scale-105 transition-transform duration-200"}
        >
          Suscribirme
        </button>
      </form>

      {success && (
        <p className={minimal ? "mt-2 text-green-600 font-medium text-sm" : "mt-4 text-green-600 font-bold text-center animate-bounce"}>
          ¡Gracias por suscribirte! 🎉
        </p>
      )}
    </div>
  );
}
