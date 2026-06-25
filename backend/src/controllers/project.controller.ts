import { Response } from 'express';
import Project from '../models/Project.js';
import { AuthRequest } from '../types/index.js';

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({ userId: req.user?.id })
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId, title, description, price, currency, status, deadline } = req.body;
    const project = await Project.create({ clientId, title, description, price, currency, status, deadline, userId: req.user?.id });
    res.status(201).json({ success: true, data: project });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
};

export const getProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user?.id }).populate(
      'clientId',
      'name email'
    );
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    res.json({ success: true, data: project });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId, title, description, price, currency, status, deadline } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { clientId, title, description, price, currency, status, deadline },
      { new: true, runValidators: true }
    );
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    res.json({ success: true, data: project });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
};
