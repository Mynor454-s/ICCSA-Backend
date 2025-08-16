import { Router } from "express";
import {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuoteStatus,
  regenerateQuoteQR,
  getQuoteQRInfo,
} from "../controllers/quote.controller.js";

const router = Router();

// Obtener todas las cotizaciones (información resumida)
router.get("/", getAllQuotes);

// Crear una nueva cotización
router.post("/", createQuote);

// Obtener una cotización con todos los detalles
router.get("/:id", getQuoteById);

// Obtener información del código QR de una cotización
router.get("/:id/qr-info", getQuoteQRInfo);

// Actualizar el estado de una cotización
router.put("/:id/status", updateQuoteStatus);

// Regenerar código QR de una cotización
router.post("/:id/regenerate-qr", regenerateQuoteQR);

export default router;
