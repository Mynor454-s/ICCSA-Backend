import { Router } from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentsSummary,
  getPaymentsByQuote,
  getPaymentById,
  updatePayment,
  deletePayment,
  checkDeliveryEligibility,
} from "../controllers/payment.controller.js";

const router = Router();

// Obtener todos los pagos (uso administrativo)
router.get("/", getAllPayments);

// Resumen de pagos por período
router.get("/summary", getPaymentsSummary);

// Crear un nuevo pago
router.post("/", createPayment);

// Obtener todos los pagos de una cotización específica
router.get("/quote/:quoteId", getPaymentsByQuote);

// Verificar si una cotización puede ser entregada
router.get("/quote/:quoteId/delivery-check", checkDeliveryEligibility);

// Obtener un pago específico
router.get("/:id", getPaymentById);

// Actualizar un pago (solo notas y referencia)
router.put("/:id", updatePayment);

// Eliminar un pago
router.delete("/:id", deletePayment);

export default router;