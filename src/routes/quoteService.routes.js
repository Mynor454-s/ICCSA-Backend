// src/routes/quoteService.routes.js
import express from "express";
import quoteServiceController from "../controllers/quoteService.controller.js";

const router = express.Router();

router.post("/", quoteServiceController.create);
router.get("/", quoteServiceController.getAll);
router.get("/:id", quoteServiceController.getById);
router.put("/:id", quoteServiceController.update);
router.delete("/:id", quoteServiceController.remove);

export default router;
