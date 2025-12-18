import "dotenv/config";
import process from "process";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.get("/", (_, res) => {
  res.send("✅ Backend Novaglow activo");
});


// Escoge el SMTP según el entorno
const isProd = process.env.NODE_ENV === "prod";

const transporter = nodemailer.createTransport(
  isProd
    ? {
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      }
    : {
        host: process.env.MAILTRAP_HOST,
        port: Number(process.env.MAILTRAP_PORT),
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      }
);

app.post("/enviar-articulos", async (req, res) => {
  const { articuloId, titulo, subtitulo, contenido } = req.body;

  if (!articuloId) return res.status(400).send("❌ Falta articuloId");

  console.log("📨 Artículo recibido:", articuloId);

  const mailOptions = {
    from: `"Novaglow" <${isProd ? process.env.GMAIL_USER : "no-reply@novaglow.com"}>`,
    to: isProd ? process.env.GMAIL_TO : process.env.MAILTRAP_TO,
    subject: `Nuevo artículo: ${titulo}`,
    html: `<h1>${titulo}</h1><h3>${subtitulo}</h3><p>${contenido}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Correo enviado (${isProd ? "Gmail" : "Mailtrap"})`);
    res.send(`Artículo enviado correctamente ✅ (${isProd ? "Gmail" : "Mailtrap"})`);
  } catch (err) {
    console.error("❌ Error enviando correo:", err);
    res.status(500).send("Error enviando el artículo");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
