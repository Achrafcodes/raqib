import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AuthRequest } from '../types/index.js';

const signToken = (id: string, email: string): string =>
  jwt.sign({ id, email }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  } as jwt.SignOptions);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, freelanceTitle, currency } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email and password are required' });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ success: false, message: 'Email already in use' });
      return;
    }

    const user = await User.create({ name, email, password, freelanceTitle, currency });
    const token = signToken(user._id.toString(), user.email);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          freelanceTitle: user.freelanceTitle,
          currency: user.currency,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = signToken(user._id.toString(), user.email);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          freelanceTitle: user.freelanceTitle,
          currency: user.currency,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};
