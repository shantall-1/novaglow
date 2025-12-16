import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useEffect, useState } from "react";

const MoodBooster = () => {
  const [frases, setFrases] = useState([]);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    return onSnapshot(collection(db, "frasesMood"), (snap) => {
      setFrases(snap.docs.map(d => d.data()));
    });
  }, []);

  const enviarFrase = async () => {
    if (!texto.trim()) return;
    await addDoc(collection(db, "frasesMood"), { texto });
    setTexto("");
  };

  return (
    <div>
      <h2>Mood Booster ✨</h2>

      <input
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="Escribe tu frase"
      />
      <button onClick={enviarFrase}>Enviar</button>

      {frases.map((f, i) => (
        <p key={i}>{f.texto}</p>
      ))}
    </div>
  );
};

export default MoodBooster;

