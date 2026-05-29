import { AccessRecord, AppUser } from '../types.js';

export const seedUsers: AppUser[] = [
  {
    id: 'u-admin',
    userId: 'admin01',
    password: 'admin123',
    fullName: 'Aarav Mehta',
    email: 'aarav.admin@mployas.demo',
    role: 'Admin',
    department: 'Platform Operations',
    status: 'Active'
  },
  {
    id: 'u-user-1',
    userId: 'user01',
    password: 'user123',
    fullName: 'Nisha Rao',
    email: 'nisha.rao@mployas.demo',
    role: 'General User',
    department: 'Customer Success',
    status: 'Active'
  },
  {
    id: 'u-user-2',
    userId: 'user02',
    password: 'user123',
    fullName: 'Kabir Sinha',
    email: 'kabir.sinha@mployas.demo',
    role: 'General User',
    department: 'Finance',
    status: 'Active'
  }
];

export const seedRecords: AccessRecord[] = [
  {
    id: 'r-1001',
    title: 'Customer onboarding checklist',
    category: 'Customer Success',
    ownerUserId: 'user01',
    accessLevel: 'General User',
    status: 'Open',
    updatedAt: '2026-05-21'
  },
  {
    id: 'r-1002',
    title: 'Invoice reconciliation batch',
    category: 'Finance',
    ownerUserId: 'user02',
    accessLevel: 'General User',
    status: 'In Review',
    updatedAt: '2026-05-24'
  },
  {
    id: 'r-1003',
    title: 'Quarterly access audit',
    category: 'Security',
    ownerUserId: 'admin01',
    accessLevel: 'Admin',
    status: 'Open',
    updatedAt: '2026-05-26'
  },
  {
    id: 'r-1004',
    title: 'Shared service health report',
    category: 'Operations',
    ownerUserId: 'admin01',
    accessLevel: 'Shared',
    status: 'Closed',
    updatedAt: '2026-05-18'
  }
];
