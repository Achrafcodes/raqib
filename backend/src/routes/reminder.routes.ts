import { Router } from 'express';
import { getReminders, createReminder, updateReminder, deleteReminder, markReminderDone } from '../controllers/reminder.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);
router.patch('/:id/done', markReminderDone);

export default router;
