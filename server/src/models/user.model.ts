import mongoose, { Schema } from 'mongoose';
import { AppUser } from '../types.js';

const userSchema = new Schema<AppUser>(
  {
    userId: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['General User', 'Admin'], required: true },
    department: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    lastLogin: String
  },
  { timestamps: true }
);

userSchema.virtual('id').get(function () {
  return this._id.toString();
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    const output = ret as Partial<AppUser> & { _id?: unknown };
    delete output._id;
    delete output.password;
  }
});

export const UserModel = mongoose.model<AppUser>('User', userSchema);
