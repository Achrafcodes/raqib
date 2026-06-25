import { Router } from 'express';
import { getInvoices, createInvoice, getInvoice, updateInvoice, deleteInvoice, downloadInvoicePDF, sendInvoiceByEmail } from '../controllers/invoice.controller.js';
import { authMiddleware, validateObjectId } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getInvoices);
router.post('/', createInvoice);
router.get('/:id', validateObjectId, getInvoice);
router.put('/:id', validateObjectId, updateInvoice);
router.get('/:id/pdf', validateObjectId, downloadInvoicePDF);
router.post('/:id/send', validateObjectId, sendInvoiceByEmail);
router.delete('/:id', validateObjectId, deleteInvoice);

export default router;
