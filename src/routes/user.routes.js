// src/routes/user.routes.js
import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = Router();

router.get("/", verifyToken, authorizeRoles("admin"), userController.getUsers);
router.get("/:id", verifyToken, authorizeRoles("admin"), userController.getUserById);
router.post("/", verifyToken, authorizeRoles("admin"), userController.createUser);
router.put("/:id", verifyToken, authorizeRoles("admin"), userController.updateUser);
router.delete("/:id", verifyToken, authorizeRoles("admin"), userController.deleteUser);

export default router;
