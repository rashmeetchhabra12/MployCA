import 'dotenv/config';
import { createApp } from './app.js';
import { connectDb } from './config/db.js';
import { seedRecordStore } from './services/record.service.js';
import { seedUserStore } from './services/user.service.js';

const port = Number(process.env.PORT ?? 4000);

async function bootstrap() {
  await connectDb();
  await seedUserStore();
  await seedRecordStore();

  createApp().listen(port, () => {
    console.log(`API ready at http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start API', error);
  process.exit(1);
});
