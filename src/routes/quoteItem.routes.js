import { Router } from "express";
import * as quoteItemController from "../controllers/quoteItem.controller.js";

const router = Router();

router.get("/:quoteId", quoteItemController.getQuoteItems); // Obtener items de una cotización
router.post("/", quoteItemController.createQuoteItem);
router.put("/:id", quoteItemController.updateQuoteItem);
router.delete("/:id", quoteItemController.deleteQuoteItem);

// Nueva ruta para actualizar la URL del diseño
router.patch("/:id/design-url", quoteItemController.updateDesignUrl);

export default router;
