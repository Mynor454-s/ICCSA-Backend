import Payment from "../models/payment.model.js";
import { createCRUDController } from "./crud.controller.js";

const paymentController = createCRUDController(Payment);

export default paymentController;
