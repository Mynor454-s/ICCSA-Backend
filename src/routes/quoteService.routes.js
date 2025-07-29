import quoteServiceController from "../controllers/quoteService.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", quoteServiceController.getAll);
router.get("/:id", quoteServiceController.getById);
router.post("/", quoteServiceController.create);
router.put("/:id", quoteServiceController.update);
router.delete("/:id", quoteServiceController.delete);

export default router;
