// src/controllers/client.controller.js
import Client from "../models/client.model.js";
import { createCRUDController } from "./crud.controller.js";

const clientController = createCRUDController(Client);

export default clientController;
