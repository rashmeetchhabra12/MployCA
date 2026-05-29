import { isMongoReady } from '../config/db.js';
import { RecordModel } from '../models/record.model.js';
import { AccessRecord, AppUser } from '../types.js';
import { seedRecords } from './seed-data.js';

let memoryRecords: AccessRecord[] = seedRecords.map((record) => ({ ...record }));

export async function seedRecordStore() {
  if (!isMongoReady()) {
    memoryRecords = seedRecords.map((record) => ({ ...record }));
    return;
  }

  const existingCount = await RecordModel.countDocuments();
  if (existingCount === 0) {
    await RecordModel.insertMany(seedRecords);
  }
}

export async function listRecordsForUser(user: Pick<AppUser, 'userId' | 'role'>) {
  const filterFor = (record: AccessRecord) =>
    user.role === 'Admin' || record.ownerUserId === user.userId || record.accessLevel === 'Shared';

  if (!isMongoReady()) {
    return memoryRecords.filter(filterFor);
  }

  if (user.role === 'Admin') {
    return RecordModel.find().sort({ updatedAt: -1 });
  }

  return RecordModel.find({
    $or: [{ ownerUserId: user.userId }, { accessLevel: 'Shared' }]
  }).sort({ updatedAt: -1 });
}
