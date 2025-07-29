import Product from '../models/product.model.js';
import { createCRUDController } from './crud.controller.js';

const productController = createCRUDController(Product);

export default productController;
