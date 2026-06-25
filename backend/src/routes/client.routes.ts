import { Router } from 'express';
import { getClients, createClient, getClient, updateClient, deleteClient } from '../controllers/client.controller.js';
import { authMiddleware, validateObjectId } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getClients);
router.post('/', createClient);
router.get('/:id', validateObjectId, getClient);
router.put('/:id', validateObjectId, updateClient);
router.delete('/:id', validateObjectId, deleteClient);

export default router;
