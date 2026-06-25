import cron from 'node-cron';
import User from '../models/User.js';
import Reminder from '../models/Reminder.js';
import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import { sendReminderEmail, sendOverdueInvoiceEmail } from './sendEmail.js';

export const startNotificationCron = (): void => {
  // Runs every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('[cron] Running daily notification job');
    const now = new Date();

    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endTomorrow = new Date(startToday.getTime() + 2 * 24 * 60 * 60 * 1000);

    const users = await User.find({ isEmailVerified: true }).select('_id name email').lean();

    for (const user of users) {
      const userId = user._id;

      // ── Reminders due today or tomorrow ──────────────────────────────────
      const reminders = await Reminder.find({
        userId,
        isDone: false,
        dueDate: { $gte: startToday, $lt: endTomorrow },
      }).lean();

      if (reminders.length > 0) {
        sendReminderEmail(
          user.email,
          user.name,
          reminders.map((r) => ({ title: r.title, dueDate: r.dueDate, note: r.note }))
        ).catch(() => null);
      }

      // ── Overdue invoices — mark as overdue + notify ───────────────────────
      const overdueInvoices = await Invoice.find({
        userId,
        status: 'sent',
        dueDate: { $lt: startToday },
      }).populate('clientId', 'name').lean();

      if (overdueInvoices.length > 0) {
        // Flip status to overdue
        await Invoice.updateMany(
          { _id: { $in: overdueInvoices.map((i) => i._id) } },
          { status: 'overdue' }
        );

        sendOverdueInvoiceEmail(
          user.email,
          user.name,
          overdueInvoices.map((inv) => ({
            invoiceNumber: inv.invoiceNumber,
            total: inv.total,
            currency: inv.currency ?? 'USD',
            clientName: (inv.clientId as unknown as { name: string } | null)?.name ?? 'Unknown',
          }))
        ).catch(() => null);
      }
    }

    console.log(`[cron] Done — processed ${users.length} users`);
  });

  console.log('[cron] Daily notification job scheduled (9:00 AM)');
};
