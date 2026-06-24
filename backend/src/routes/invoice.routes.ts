import { Router } from 'express';
import { getInvoices, createInvoice, getInvoice, updateInvoice, deleteInvoice } from '../controllers/invoice.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getInvoices);
router.post('/', createInvoice);
router.get('/:id', getInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

export default router;
