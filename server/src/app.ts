import cors from 'cors';
import express from 'express';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { authRouter } from './routes/auth.routes.js';
import { recordRouter } from './routes/record.routes.js';
import { userRouter } from './routes/user.routes.js';

export function createApp() {
  const app = express();
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const clientDist = resolve(currentDir, '..', '..', 'client', 'dist', 'client', 'browser');

  app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:4200' }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'mployas-api' }));
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/records', recordRouter);

  if (existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(join(clientDist, 'index.html')));
  }

  app.use((_req, res) => res.status(404).json({ message: 'API route not found.' }));

  return app;
}
