import QuoteService from '../models/quoteService.model.js';
import { createCRUDController } from './crud.controller.js';

const quoteServiceController = createCRUDController(QuoteService);

export default quoteServiceController;
