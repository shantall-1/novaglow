import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Backend Novaglow activo");
});

app.post("/enviar-articulos", (req, res) => {
  const { articuloId } = req.body;

  if (!articuloId) {
    return res.status(400).send("❌ Falta articuloId");
  }

  console.log("📨 Artículo recibido:", articuloId);
  res.send("Artículo enviado correctamente (simulado)");
});

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
