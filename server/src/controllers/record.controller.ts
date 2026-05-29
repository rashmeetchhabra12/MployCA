import { Request, Response } from 'express';
import { listRecordsForUser } from '../services/record.service.js';
import { parseDelay, wait } from '../utils/delay.js';

export async function records(req: Request, res: Response) {
  const delayMs = parseDelay(req.query.delayMs);
  await wait(delayMs);

  if (!req.authUser) {
    return res.status(401).json({ message: 'Authentication token is required.' });
  }

  return res.json(await listRecordsForUser(req.authUser));
}
