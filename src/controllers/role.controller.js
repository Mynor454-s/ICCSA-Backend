import Role from '../models/role.model.js';
import { createCRUDController } from './crud.controller.js';

const roleController = createCRUDController(Role);

export default roleController;
