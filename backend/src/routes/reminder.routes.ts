import { Router } from 'express';
import { getReminders, createReminder, updateReminder, deleteReminder, markReminderDone } from '../controllers/reminder.controller.js';
import { authMiddleware, validateObjectId } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id', validateObjectId, updateReminder);
router.delete('/:id', validateObjectId, deleteReminder);
router.patch('/:id/done', validateObjectId, markReminderDone);

export default router;
