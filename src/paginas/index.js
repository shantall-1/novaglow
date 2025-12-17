import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("✅ Backend Novaglow activo");
});

// Ruta que llama tu frontend
app.post("/enviar-articulos", (req, res) => {
  const { articuloId } = req.body;

  if (!articuloId) {
    return res.status(400).send("Falta el ID del artículo");
  }

  console.log("📨 Artículo recibido:", articuloId);

  // Aquí luego conectamos Gmail / Nodemailer
  res.send("Artículo enviado correctamente 🚀");
});

app.listen(3001, () => {
  console.log("🚀 Backend corriendo en http://localhost:3001");
});
