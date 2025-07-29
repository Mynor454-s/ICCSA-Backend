import { Router } from "express";
import productController from "../controllers/product.controller.js"; 

const router = Router();

router.get("/", productController.getAll);
router.post("/", productController.create);
router.get("/:id", productController.getById);
router.put("/:id", productController.update);
router.delete("/:id", productController.delete);

export default router;
