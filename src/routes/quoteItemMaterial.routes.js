import { Router } from "express";
import quoteItemMaterialController from "../controllers/quoteItemMaterial.controller.js";

const router = Router();

// Crear un nuevo material para un ítem de cotización
router.post("/", quoteItemMaterialController.create);

// Obtener todos los materiales
router.get("/", quoteItemMaterialController.findAll);

// Obtener un material específico
router.get("/:id", quoteItemMaterialController.findOne);

// Actualizar un material
router.put("/:id", quoteItemMaterialController.update);

// Eliminar un material
router.delete("/:id", quoteItemMaterialController.remove);

export default router;
