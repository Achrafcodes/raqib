import { Response } from 'express';
import Invoice from '../models/Invoice.js';
import Project from '../models/Project.js';
import Reminder from '../models/Reminder.js';
import Client from '../models/Client.js';
import { AuthRequest } from '../types/index.js';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    const [totalEarnedResult, activeProjects, unpaidInvoices, followUpsDueToday, paidInvoices, recentClients, recentProjects] =
      await Promise.all([
        Invoice.aggregate([
          { $match: { userId: userId, status: 'paid' } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
        Project.countDocuments({ userId, status: 'in-progress' }),
        Invoice.countDocuments({ userId, status: { $in: ['sent', 'overdue'] } }),
        Reminder.countDocuments({ userId, isDone: false, dueDate: { $gte: startOfToday, $lt: endOfToday } }),
        Invoice.find({ userId, status: 'paid' }).select('total createdAt').lean(),
        Client.find({ userId }).sort({ createdAt: -1 }).limit(5).select('name status createdAt').lean(),
        Project.find({ userId }).sort({ createdAt: -1 }).limit(5).select('title status createdAt').lean(),
      ]);

    // Earnings chart — last 12 months
    const earningsChart: { month: string; earnings: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      const monthEarnings = paidInvoices
        .filter((inv) => {
          const d = new Date(inv.createdAt);
          return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth();
        })
        .reduce((sum, inv) => sum + inv.total, 0);
      earningsChart.push({ month: label, earnings: monthEarnings });
    }

    // Pipeline breakdown
    const pipelineData = await Project.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const pipelineBreakdown = pipelineData.reduce<Record<string, number>>((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // Recent activity — merge clients + projects sorted by date
    const recentActivity = [
      ...recentClients.map((c) => ({ type: 'client', title: c.name, status: c.status, date: c.createdAt })),
      ...recentProjects.map((p) => ({ type: 'project', title: p.title, status: p.status, date: p.createdAt })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        totalEarned: totalEarnedResult[0]?.total ?? 0,
        activeProjects,
        unpaidInvoices,
        followUpsDueToday,
        earningsChart,
        pipelineBreakdown,
        recentActivity,
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};
