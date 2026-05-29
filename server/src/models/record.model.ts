import mongoose, { Schema } from 'mongoose';
import { AccessRecord } from '../types.js';

const recordSchema = new Schema<AccessRecord>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    ownerUserId: { type: String, required: true },
    accessLevel: { type: String, enum: ['General User', 'Admin', 'Shared'], required: true },
    status: { type: String, enum: ['Open', 'In Review', 'Closed'], required: true },
    updatedAt: { type: String, required: true }
  },
  { timestamps: true }
);

recordSchema.virtual('id').get(function () {
  return this._id.toString();
});

recordSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    delete (ret as Partial<AccessRecord> & { _id?: unknown })._id;
  }
});

export const RecordModel = mongoose.model<AccessRecord>('Record', recordSchema);
