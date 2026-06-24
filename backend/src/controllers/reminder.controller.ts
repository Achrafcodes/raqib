import { Response } from 'express';
import Reminder from '../models/Reminder.js';
import { AuthRequest } from '../types/index.js';

export const getReminders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reminders = await Reminder.find({ userId: req.user?.id })
      .populate('clientId', 'name')
      .sort({ dueDate: 1 });
    res.json({ success: true, data: reminders });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch reminders' });
  }
};

export const createReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reminder = await Reminder.create({ ...req.body, userId: req.user?.id });
    res.status(201).json({ success: true, data: reminder });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create reminder' });
  }
};

export const updateReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!reminder) {
      res.status(404).json({ success: false, message: 'Reminder not found' });
      return;
    }
    res.json({ success: true, data: reminder });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update reminder' });
  }
};

export const deleteReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    if (!reminder) {
      res.status(404).json({ success: false, message: 'Reminder not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete reminder' });
  }
};

export const markReminderDone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { isDone: true },
      { new: true }
    );
    if (!reminder) {
      res.status(404).json({ success: false, message: 'Reminder not found' });
      return;
    }
    res.json({ success: true, data: reminder });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to mark reminder as done' });
  }
};
