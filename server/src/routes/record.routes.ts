import { Router } from 'express';
import { records } from '../controllers/record.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const recordRouter = Router();

recordRouter.get('/', requireAuth, records);
