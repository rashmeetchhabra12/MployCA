import { Router } from 'express';
import { addUser, allUsers, editUser, me, removeUser } from '../controllers/user.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';

export const userRouter = Router();

userRouter.get('/me', requireAuth, me);
userRouter.get('/', requireAuth, requireAdmin, allUsers);
userRouter.post('/', requireAuth, requireAdmin, addUser);
userRouter.put('/:id', requireAuth, requireAdmin, editUser);
userRouter.delete('/:id', requireAuth, requireAdmin, removeUser);
