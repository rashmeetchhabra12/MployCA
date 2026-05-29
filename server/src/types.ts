export type Role = 'General User' | 'Admin';

export interface AppUser {
  id: string;
  userId: string;
  password?: string;
  fullName: string;
  email: string;
  role: Role;
  department: string;
  status: 'Active' | 'Inactive';
  lastLogin?: string;
}

export interface AccessRecord {
  id: string;
  title: string;
  category: string;
  ownerUserId: string;
  accessLevel: Role | 'Shared';
  status: 'Open' | 'In Review' | 'Closed';
  updatedAt: string;
}

export interface TokenPayload {
  id: string;
  userId: string;
  role: Role;
}
