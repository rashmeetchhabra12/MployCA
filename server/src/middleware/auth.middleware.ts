import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types.js';

declare global {
  namespace Express {
    interface Request {
      authUser?: TokenPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required.' });
  }

  try {
    req.authUser = jwt.verify(token, process.env.JWT_SECRET ?? 'assignment-demo-secret') as TokenPayload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.authUser?.role !== 'Admin') {
    return res.status(403).json({ message: 'Admin access is required for this action.' });
  }

  return next();
}
