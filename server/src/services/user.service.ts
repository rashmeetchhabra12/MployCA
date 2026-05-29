import { isMongoReady } from '../config/db.js';
import { UserModel } from '../models/user.model.js';
import { AppUser } from '../types.js';
import { seedUsers } from './seed-data.js';

let memoryUsers: AppUser[] = seedUsers.map((user) => ({ ...user }));
type MongoUser = AppUser & { _id: unknown };

const publicUser = (user: AppUser): AppUser => {
  const { password: _password, ...safeUser } = user;
  return safeUser;
};

export async function seedUserStore() {
  if (!isMongoReady()) {
    memoryUsers = seedUsers.map((user) => ({ ...user }));
    return;
  }

  const existingCount = await UserModel.countDocuments();
  if (existingCount === 0) {
    await UserModel.insertMany(seedUsers);
  }
}

export async function findUserForLogin(userId: string, password: string, role: AppUser['role']) {
  if (!isMongoReady()) {
    const found = memoryUsers.find((user) => user.userId === userId && user.password === password && user.role === role);
    return found ? publicUser(found) : null;
  }

  const found = await UserModel.findOne({ userId, password, role, status: 'Active' }).lean<MongoUser>();
  return found ? publicUser({ ...found, id: String(found._id) }) : null;
}

export async function touchLastLogin(userId: string) {
  const lastLogin = new Date().toISOString();

  if (!isMongoReady()) {
    memoryUsers = memoryUsers.map((user) => (user.userId === userId ? { ...user, lastLogin } : user));
    return;
  }

  await UserModel.updateOne({ userId }, { lastLogin });
}

export async function getUserByUserId(userId: string) {
  if (!isMongoReady()) {
    const found = memoryUsers.find((user) => user.userId === userId);
    return found ? publicUser(found) : null;
  }

  const found = await UserModel.findOne({ userId }).lean<MongoUser>();
  return found ? publicUser({ ...found, id: String(found._id) }) : null;
}

export async function listUsers() {
  if (!isMongoReady()) {
    return memoryUsers.map(publicUser);
  }

  const users = await UserModel.find().sort({ role: 1, fullName: 1 }).lean<MongoUser[]>();
  return users.map((user) => publicUser({ ...user, id: String(user._id) }));
}

export async function createUser(input: Omit<AppUser, 'id'>) {
  if (!isMongoReady()) {
    const user: AppUser = { ...input, id: `u-${Date.now()}` };
    memoryUsers = [...memoryUsers, user];
    return publicUser(user);
  }

  const created = await UserModel.create(input);
  return created.toJSON();
}

export async function updateUser(id: string, input: Partial<AppUser>) {
  if (!isMongoReady()) {
    memoryUsers = memoryUsers.map((user) => (user.id === id ? { ...user, ...input, id } : user));
    const updated = memoryUsers.find((user) => user.id === id);
    return updated ? publicUser(updated) : null;
  }

  const updated = await UserModel.findByIdAndUpdate(id, input, { new: true });
  return updated ? updated.toJSON() : null;
}

export async function deleteUser(id: string) {
  if (!isMongoReady()) {
    const before = memoryUsers.length;
    memoryUsers = memoryUsers.filter((user) => user.id !== id);
    return memoryUsers.length !== before;
  }

  const deleted = await UserModel.findByIdAndDelete(id);
  return Boolean(deleted);
}
