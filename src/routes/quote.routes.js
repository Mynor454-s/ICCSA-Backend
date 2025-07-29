import { Router } from "express";
import {
  createQuote,
  getQuoteById,
  updateQuoteStatus,
} from "../controllers/quote.controller.js";

const router = Router();

// Crear una nueva cotización
router.post("/", createQuote);

// Obtener una cotización con todos los detalles
router.get("/:id", getQuoteById);

// Actualizar el estado de una cotización
router.put("/:id/status", updateQuoteStatus);

export default router;
