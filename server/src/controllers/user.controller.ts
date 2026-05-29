import { Request, Response } from 'express';
import { createUser, deleteUser, getUserByUserId, listUsers, updateUser } from '../services/user.service.js';

export async function me(req: Request, res: Response) {
  const user = req.authUser ? await getUserByUserId(req.authUser.userId) : null;
  if (!user) {
    return res.status(404).json({ message: 'User profile was not found.' });
  }

  return res.json(user);
}

export async function allUsers(_req: Request, res: Response) {
  return res.json(await listUsers());
}

export async function addUser(req: Request, res: Response) {
  const { userId, password, fullName, email, role, department, status } = req.body;

  if (!userId || !password || !fullName || !email || !role || !department) {
    return res.status(400).json({ message: 'User ID, password, name, email, role, and department are required.' });
  }

  const user = await createUser({ userId, password, fullName, email, role, department, status: status ?? 'Active' });
  return res.status(201).json(user);
}

export async function editUser(req: Request, res: Response) {
  const user = await updateUser(req.params.id, req.body);
  if (!user) {
    return res.status(404).json({ message: 'User was not found.' });
  }

  return res.json(user);
}

export async function removeUser(req: Request, res: Response) {
  const deleted = await deleteUser(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'User was not found.' });
  }

  return res.status(204).send();
}
