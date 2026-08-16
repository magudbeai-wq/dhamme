import type { UserProfile } from '../types';

export interface RegisteredAccount extends UserProfile {
  passwordHash: string;
}

// Only Real Master Administrator Account - All fake test users removed
export const INITIAL_REGISTERED_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'admin-master-magudbe',
    fullName: 'Magudbe Master Admin',
    email: 'magudbeai@gmail.com',
    phone: '0915752826',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    isAdmin: true,
    joinedDate: '2026-08-01',
    passwordHash: 'Bookh.112233'
  }
];

