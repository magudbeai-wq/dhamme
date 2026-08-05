import type { UserProfile } from '../types';

export interface RegisteredAccount extends UserProfile {
  passwordHash: string;
}

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
  },
  {
    id: 'usr-cabdiqaadir',
    fullName: 'Cabdiqaadir Xasan',
    email: 'cabdiqaadir.xasan@dhamme.app',
    phone: '+251 91 555 1234',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    joinedDate: '2026-08-02',
    passwordHash: 'dhamme123'
  },
  {
    id: 'usr-fartuun',
    fullName: 'Fartuun Axmed',
    email: 'fartuun.axmed@dhamme.app',
    phone: '+251 92 333 4455',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    joinedDate: '2026-08-03',
    passwordHash: 'dhamme123'
  },
  {
    id: 'usr-khadar',
    fullName: 'Khadar Jaamac',
    email: 'khadar.jaamac@dhamme.app',
    phone: '+251 91 777 8899',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    joinedDate: '2026-08-03',
    passwordHash: 'dhamme123'
  },
  {
    id: 'usr-nimco',
    fullName: 'Nimco Cumar',
    email: 'nimco.cumar@dhamme.app',
    phone: '+251 93 111 2233',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    joinedDate: '2026-08-04',
    passwordHash: 'dhamme123'
  },
  {
    id: 'usr-mustafe',
    fullName: 'Mustafe Cali',
    email: 'mustafe.cali@gmail.com',
    phone: '+251 91 222 3344',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    joinedDate: '2026-08-04',
    passwordHash: 'dhamme123'
  },
  {
    id: 'usr-hamda',
    fullName: 'Hamda Xassan',
    email: 'hamda.xassan@gmail.com',
    phone: '+251 94 555 6677',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    joinedDate: '2026-08-05',
    passwordHash: 'dhamme123'
  }
];
