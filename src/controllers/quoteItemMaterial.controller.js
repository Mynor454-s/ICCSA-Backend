// src/controllers/quoteItemMaterial.controller.js
import QuoteItemMaterial from "../models/quoteItemMaterial.model.js";
import { createCRUDController } from "./crud.controller.js";

const quoteItemMaterialController = createCRUDController(QuoteItemMaterial);

export default quoteItemMaterialController;
