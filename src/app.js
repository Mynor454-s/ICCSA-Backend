// src/app.js
import express from "express";
import cors from "cors";
import path from "path";
import routes from "./routes/index.js";

const app = express();

// Configuración CORS para credenciales
app.use(
  cors({
    origin: "http://localhost:5173", // URL de tu frontend
    credentials: true,               // Permite envío de cookies/autenticación
  })
);

app.use(express.json()); // Para recibir JSON en las peticiones

// Servir archivos estáticos (códigos QR)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rutas
app.use("/api", routes);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("🚀 API funcionando");
});

export default app;
