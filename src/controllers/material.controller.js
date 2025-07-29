// src/controllers/client.controller.js
import Material from "../models/material.model.js";
import { createCRUDController } from "./crud.controller.js";

const materialController = createCRUDController(Material);

export default materialController;
