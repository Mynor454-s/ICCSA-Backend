import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import clientRoutes from "./client.routes.js";
import materialRoutes from "./material.routes.js";
import serviceRoutes from "./service.routes.js";
import productRoutes from "./product.routes.js";
import quoteItemMaterialRoutes from "./quoteItemMaterial.routes.js";
import quoteServiceRoutes from "./quoteService.routes.js";
import paymentRoutes from "./payment.routes.js";
import quoteRoutes from "./quote.routes.js";
import quoteItemRoutes from "./quoteItem.routes.js";
import roleRoutes from "./role.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/clients", clientRoutes);
router.use("/materials", materialRoutes);
router.use("/services", serviceRoutes);
router.use("/products", productRoutes);
router.use("/quote-item-materials", quoteItemMaterialRoutes);
router.use("/quote-services", quoteServiceRoutes);
router.use("/payments", paymentRoutes);
router.use("/quotes", quoteRoutes);
router.use("/quote-items", quoteItemRoutes);
router.use("/roles", roleRoutes);

export default router;
