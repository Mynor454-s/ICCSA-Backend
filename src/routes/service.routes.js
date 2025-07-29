import { Router } from "express";
import serviceController from "../controllers/service.controller.js";

const router = Router();

router.get("/", serviceController.getAll);
router.get("/:id", serviceController.getById);
router.post("/", serviceController.create);
router.put("/:id", serviceController.update);
router.delete("/:id", serviceController.delete);

export default router;
