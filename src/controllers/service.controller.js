import Service from "../models/service.model.js";
import { createCRUDController } from "./crud.controller.js";

const serviceController = createCRUDController(Service);

export default serviceController;
