import { Response } from 'express';
import Client from '../models/Client.js';
import { AuthRequest } from '../types/index.js';

export const getClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const clients = await Client.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: clients });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch clients' });
  }
};

export const createClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, company, source, status, notes } = req.body;
    const client = await Client.create({ name, email, phone, company, source, status, notes, userId: req.user?.id });
    res.status(201).json({ success: true, data: client });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create client' });
  }
};

export const getClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!client) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }
    res.json({ success: true, data: client });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch client' });
  }
};

export const updateClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, company, source, status, notes } = req.body;
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { name, email, phone, company, source, status, notes },
      { new: true, runValidators: true }
    );
    if (!client) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }
    res.json({ success: true, data: client });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update client' });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    if (!client) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete client' });
  }
};
