import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserForLogin, touchLastLogin } from '../services/user.service.js';
import { Role } from '../types.js';

export async function login(req: Request, res: Response) {
  const { userId, password, role } = req.body as { userId?: string; password?: string; role?: Role };

  if (!userId || !password || !role) {
    return res.status(400).json({ message: 'User ID, password, and role are required.' });
  }

  const user = await findUserForLogin(userId, password, role);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials or role.' });
  }

  await touchLastLogin(user.userId);
  const token = jwt.sign({ id: user.id, userId: user.userId, role: user.role }, process.env.JWT_SECRET ?? 'assignment-demo-secret', {
    expiresIn: '4h'
  });

  return res.json({ token, user: { ...user, lastLogin: new Date().toISOString() } });
}
