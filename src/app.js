// src/app.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); // Para recibir JSON en las peticiones

// Rutas
app.use("/api", routes); // Todas tus rutas irán bajo /api

// Ruta raíz (opcional)
app.get("/", (req, res) => {
  res.send("🚀 API funcionando");
});

export default app;
