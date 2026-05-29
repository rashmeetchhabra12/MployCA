import mongoose from 'mongoose';
import dns from 'node:dns';

export async function connectDb() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI not found. API will run with seeded in-memory data.');
    return false;
  }

  const dnsServers = process.env.DNS_SERVERS?.split(',').map((server) => server.trim()).filter(Boolean);
  if (dnsServers?.length) {
    dns.setServers(dnsServers);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB Atlas');
  return true;
}

export function isMongoReady() {
  return mongoose.connection.readyState === 1;
}
