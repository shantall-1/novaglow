import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Obtener la ruta absoluta
const serviceAccountPath = path.resolve("./server/serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

// Configuración de Nodemailer (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tucorreo@gmail.com",
    pass: "TU_APP_PASSWORD", // contraseña de app de Gmail
  },
});

// Endpoint para enviar artículos
app.post("/enviar-articulos", async (req, res) => {
  const { articuloId } = req.body;

  try {
    const doc = await db.collection("articulos").doc(articuloId).get();
    if (!doc.exists) return res.status(404).send("Artículo no encontrado");

    const articulo = doc.data();

    // Traer todos los suscriptores
    const suscriptoresSnap = await db.collection("suscriptores").get();
    const emails = suscriptoresSnap.docs.map(d => d.data().email);

    if (emails.length === 0) return res.send("No hay suscriptores registrados");

    // Enviar correo a cada suscriptor
    for (let email of emails) {
      await transporter.sendMail({
        from: "NovaGlow <tucorreo@gmail.com>",
        to: email,
        subject: `Nuevo artículo: ${articulo.titulo}`,
        html: `
          <h1>${articulo.titulo}</h1>
          ${articulo.subtitulo ? `<h2>${articulo.subtitulo}</h2>` : ""}
          <p>${articulo.contenido.replace(/\n/g, "<br>")}</p>
          ${articulo.imagenUrl ? `<img src="${articulo.imagenUrl}" style="max-width:100%;">` : ""}
        `,
      });
    }

    res.send("Emails enviados correctamente 🎉");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error enviando emails");
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
