import { Router } from "express";
import roleController from "../controllers/role.controller.js";

const router = Router();    

router.get("/", roleController.getAll);
router.get("/:id", roleController.getById);
router.post("/", roleController.create);
router.put("/:id", roleController.update);
router.delete("/:id", roleController.delete);

export default router;