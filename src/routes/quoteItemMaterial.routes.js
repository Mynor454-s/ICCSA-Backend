import {Router} from 'express';
import quoteItemMaterialController from '../controllers/quoteItemMaterial.controller.js';
const router = Router();
router.get('/', quoteItemMaterialController.getAll);
router.get('/:id', quoteItemMaterialController.getById);    
router.post('/', quoteItemMaterialController.create);
router.put('/:id', quoteItemMaterialController.update);
router.delete('/:id', quoteItemMaterialController.delete);
export default router;
