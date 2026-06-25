import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { AuthRequest } from '../types/index.js';

interface JwtPayload {
  id: string;
  email: string;
}

export const validateObjectId = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, message: 'Invalid ID' });
    return;
  }
  next();
};

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Accept token from httpOnly cookie OR Authorization header
  const cookieToken = req.cookies?.token;
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  const token = cookieToken ?? headerToken;

  if (!token) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
