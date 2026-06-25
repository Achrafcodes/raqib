import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
