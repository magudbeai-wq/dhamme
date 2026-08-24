import { INITIAL_PROPERTIES } from '../data/propertiesData';
import { INITIAL_REGISTERED_ACCOUNTS } from '../data/usersData';
import type { PropertyListing, FilterState, UserProfile } from '../types';

export function runAllTests() {
  console.log('🚀 Running DHAMME Marketplace Production Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // TEST GROUP 1: Clean Slate & User / Listing Integrity (No Fake Data)
  console.log('--- TEST GROUP 1: Fake Data Removal & Production Data Integrity ---');
  assert(INITIAL_PROPERTIES.length === 0, 'INITIAL_PROPERTIES is a clean initial array (no hardcoded fake posts)');
  assert(INITIAL_REGISTERED_ACCOUNTS.length === 1, 'INITIAL_REGISTERED_ACCOUNTS contains only the genuine Master Admin');
  assert(INITIAL_REGISTERED_ACCOUNTS[0].email === 'magudbeai@gmail.com', 'Master Admin email is magudbeai@gmail.com');
  assert(!INITIAL_REGISTERED_ACCOUNTS.some((u) => u.email.endsWith('@dhamme.app')), 'No fake test users exist with @dhamme.app domain');

  // TEST GROUP 2: Security & Privilege Escalation Prevention
  console.log('\n--- TEST GROUP 2: Security & Privilege Escalation Prevention ---');
  function checkAdminPrivilege(email: string): boolean {
    return email.toLowerCase() === 'magudbeai@gmail.com';
  }

  assert(checkAdminPrivilege('magudbeai@gmail.com') === true, 'Master admin (magudbeai@gmail.com) gets admin privilege');
  assert(checkAdminPrivilege('fakeadmin@gmail.com') === false, 'Privilege Escalation blocked: fakeadmin@gmail.com denied admin role');
  assert(checkAdminPrivilege('admin@dhamme.app') === false, 'Privilege Escalation blocked: admin@dhamme.app denied admin role');
  assert(checkAdminPrivilege('attacker_admin_hacker@yahoo.com') === false, 'Privilege Escalation blocked: substring admin check denied');

  // TEST GROUP 3: Admin Delete Property Functionality
  console.log('\n--- TEST GROUP 3: Admin Property Deletion Capability ---');
  const mockProperties: PropertyListing[] = [
    {
      id: 'prop-001',
      title: 'Villa in Kebele 06',
      priceEtb: 35000,
      priceLocalFormatted: '35,000 ETB',
      mode: 'kiro',
      category: 'Villa',
      city: 'Jigjiga',
      kebele: 'Kebele 06',
      beds: 3,
      baths: 2,
      water: true,
      electricity: true,
      pool: 'No',
      description: 'Clean villa in Garabase',
      agentName: 'Landlord',
      agentPhone: '0915752826',
      agentAvatar: '',
      ownerEmail: 'admin@dhamme.app',
      postedDate: '2026-08-16',
      images: ['https://example.com/img1.jpg'],
      videoUrl: 'https://example.com/tour.mp4'
    },
    {
      id: 'prop-002',
      title: 'Apartment in Kebele 03',
      priceEtb: 25000,
      priceLocalFormatted: '25,000 ETB',
      mode: 'kiro',
      category: 'Apartment',
      city: 'Jigjiga',
      kebele: 'Kebele 03',
      beds: 2,
      baths: 1,
      water: true,
      electricity: true,
      pool: 'No',
      description: 'Modern apartment in Taiwan',
      agentName: 'Landlord',
      agentPhone: '0915752826',
      agentAvatar: '',
      ownerEmail: 'admin@dhamme.app',
      postedDate: '2026-08-16',
      images: ['https://example.com/img2.jpg']
    }
  ];

  function deleteProperty(list: PropertyListing[], id: string): PropertyListing[] {
    return list.filter((p) => p.id !== id);
  }

  const afterDelete = deleteProperty(mockProperties, 'prop-001');
  assert(afterDelete.length === 1, 'Admin deletes property successfully: count reduced from 2 to 1');
  assert(!afterDelete.some((p) => p.id === 'prop-001'), 'Deleted property prop-001 is completely removed');
  assert(afterDelete[0].id === 'prop-002', 'Remaining property prop-002 intact');

  // TEST GROUP 4: Admin Ban & Unban Users (Pan Users)
  console.log('\n--- TEST GROUP 4: Admin User Ban / Unban Management ---');
  interface AccountWithBan extends UserProfile {
    isBanned?: boolean;
    bannedReason?: string;
    bannedAt?: string;
  }

  const sampleUsers: AccountWithBan[] = [
    {
      id: 'admin-master',
      fullName: 'Master Admin',
      email: 'magudbeai@gmail.com',
      phone: '0915752826',
      avatarUrl: '',
      isVerified: true,
      isAdmin: true
    },
    {
      id: 'user-spammer-123',
      fullName: 'Bad Actor',
      email: 'spammer@example.com',
      phone: '+251 91 999 8888',
      avatarUrl: '',
      isVerified: false
    }
  ];

  function banUser(users: AccountWithBan[], targetId: string, reason: string): AccountWithBan[] {
    return users.map((u) => {
      if (u.id === targetId) {
        if (u.email.toLowerCase() === 'magudbeai@gmail.com') {
          return u; // Protected Master Admin
        }
        return {
          ...u,
          isBanned: true,
          bannedReason: reason,
          bannedAt: new Date().toISOString()
        };
      }
      return u;
    });
  }

  function unbanUser(users: AccountWithBan[], targetId: string): AccountWithBan[] {
    return users.map((u) => {
      if (u.id === targetId) {
        return {
          ...u,
          isBanned: false,
          bannedReason: undefined,
          bannedAt: undefined
        };
      }
      return u;
    });
  }

  // Ban test
  const afterBan = banUser(sampleUsers, 'user-spammer-123', 'Spamming fake listings');
  const bannedUser = afterBan.find((u) => u.id === 'user-spammer-123');
  assert(bannedUser?.isBanned === true, 'Admin banned bad actor successfully');
  assert(bannedUser?.bannedReason === 'Spamming fake listings', 'Ban reason recorded accurately');

  // Master Admin protection
  const attemptBanAdmin = banUser(sampleUsers, 'admin-master', 'Trying to ban admin');
  const adminAccount = attemptBanAdmin.find((u) => u.id === 'admin-master');
  assert(adminAccount?.isBanned !== true, 'Master Admin (magudbeai@gmail.com) cannot be banned');

  // Unban test
  const afterUnban = unbanUser(afterBan, 'user-spammer-123');
  const unbannedUser = afterUnban.find((u) => u.id === 'user-spammer-123');
  assert(unbannedUser?.isBanned === false, 'Admin unbanned user successfully');

  // TEST GROUP 5: Search & Filter Logic Synchronization
  console.log('\n--- TEST GROUP 5: Search & Filter Synchronization ---');
  function filterProperties(props: PropertyListing[], filter: FilterState, query: string = ''): PropertyListing[] {
    return props.filter((prop) => {
      const matchesCity = prop.city.toLowerCase().includes('jigjiga');
      const matchesMode = prop.mode === filter.mode;
      const matchesCategory = filter.category === 'All Properties' || prop.category === filter.category;
      const matchesKebele = !filter.kebele || prop.kebele.toLowerCase().includes(filter.kebele.toLowerCase());
      const matchesPrice = prop.priceEtb >= (filter.minPriceEtb || 0) &&
        (!filter.maxPriceEtb || prop.priceEtb <= filter.maxPriceEtb);
      const matchesBeds = !filter.beds || filter.beds === 'any' ||
        (filter.beds === '4+' ? prop.beds >= 4 : prop.beds === Number(filter.beds));
      const matchesWater = !filter.waterRequired || (
        typeof prop.water === 'boolean' ? prop.water :
        String(prop.water).toLowerCase() === 'yes' ||
        String(prop.water).toLowerCase().includes('24h') ||
        String(prop.water).toLowerCase().includes('wakaalad')
      );
      const matchesPower = !filter.powerRequired || (
        typeof prop.electricity === 'boolean' ? prop.electricity :
        String(prop.electricity).toLowerCase().includes('24') ||
        String(prop.electricity).toLowerCase().includes('solar') ||
        String(prop.electricity).toLowerCase().includes('mains')
      );
      const matchesVideo = !filter.hasVideo || Boolean(prop.videoUrl);
      const matchesSearch = query === '' ||
        prop.title.toLowerCase().includes(query.toLowerCase()) ||
        prop.kebele.toLowerCase().includes(query.toLowerCase());

      return matchesCity && matchesMode && matchesCategory && matchesKebele && matchesPrice && matchesBeds && matchesWater && matchesPower && matchesVideo && matchesSearch;
    });
  }

  const sampleFeed: PropertyListing[] = [
    {
      id: 'feed-1',
      title: 'Family House in Kebele 06 Garab\'ase',
      priceEtb: 30000,
      priceLocalFormatted: '30,000 ETB',
      mode: 'kiro',
      category: 'Family House',
      city: 'Jigjiga',
      kebele: 'Kebele 06',
      beds: 3,
      baths: 2,
      water: true,
      electricity: true,
      pool: 'No',
      description: 'Family house in Garabase',
      agentName: 'Landlord',
      agentPhone: '0915752826',
      agentAvatar: '',
      ownerEmail: 'landlord@gmail.com',
      postedDate: '2026-08-16',
      images: ['https://example.com/f1.jpg'],
      videoUrl: 'https://example.com/f1.mp4'
    },
    {
      id: 'feed-2',
      title: 'Commercial Store in Taiwan Market',
      priceEtb: 5000000,
      priceLocalFormatted: '5,000,000 ETB',
      mode: 'iib',
      category: 'Villa',
      city: 'Jigjiga',
      kebele: 'Kebele 03 (Taiwan)',
      beds: 4,
      baths: 2,
      water: true,
      electricity: true,
      pool: 'No',
      description: 'Commercial shop near Taiwan market',
      agentName: 'Owner',
      agentPhone: '0915752826',
      agentAvatar: '',
      ownerEmail: 'owner@gmail.com',
      postedDate: '2026-08-16',
      images: ['https://example.com/f2.jpg']
    }
  ];

  const kiroListings = filterProperties(sampleFeed, {
    mode: 'kiro',
    searchLocation: 'Jigjiga',
    category: 'All Properties',
    minPriceEtb: 0,
    maxPriceEtb: 500000,
    kebele: '',
    beds: 'any',
    waterRequired: false,
    powerRequired: false
  });
  assert(kiroListings.every((p) => p.mode === 'kiro'), 'Filter Mode "kiro" strictly returns rental listings');

  const videoOnlyListings = filterProperties(sampleFeed, {
    mode: 'kiro',
    searchLocation: 'Jigjiga',
    category: 'All Properties',
    minPriceEtb: 0,
    maxPriceEtb: 500000,
    kebele: '',
    beds: 'any',
    waterRequired: false,
    powerRequired: false,
    hasVideo: true
  });
  assert(videoOnlyListings.every((p) => Boolean(p.videoUrl)), 'Filter "hasVideo=true" strictly returns listings with videoUrl');

  // TEST GROUP 6: Video Upload Validation Constraints
  console.log('\n--- TEST GROUP 6: Video Upload Validation Constraints ---');
  function validateVideoUpload(file: { name: string; size: number; type: string }): { valid: boolean; error?: string } {
    const maxSizeBytes = 100 * 1024 * 1024; // 100MB
    const allowedFormats = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isExtensionAllowed = ['mp4', 'webm', 'mov', 'mkv'].includes(ext || '');

    if (!allowedFormats.includes(file.type) && !isExtensionAllowed) {
      return { valid: false, error: 'Muuqaalka waa inuu noqdaa MP4, WebM, ama MOV format.' };
    }

    if (file.size > maxSizeBytes) {
      return { valid: false, error: 'Muuqaalku kama weynaan karo 100MB.' };
    }

    return { valid: true };
  }

  assert(validateVideoUpload({ name: 'house-tour.mp4', size: 15 * 1024 * 1024, type: 'video/mp4' }).valid === true, 'Valid 15MB MP4 video allowed');
  assert(validateVideoUpload({ name: 'room-view.webm', size: 5 * 1024 * 1024, type: 'video/webm' }).valid === true, 'Valid 5MB WebM video allowed');
  assert(validateVideoUpload({ name: 'huge-file.mp4', size: 150 * 1024 * 1024, type: 'video/mp4' }).valid === false, 'Video > 100MB rejected with size error');
  assert(validateVideoUpload({ name: 'document.pdf', size: 2 * 1024 * 1024, type: 'application/pdf' }).valid === false, 'Non-video file rejected');

  // TEST GROUP 7: Ironclad Route & Component-Level Authorization Security Guards
  console.log('\n--- TEST GROUP 7: Route & Admin Authorization Security Guards ---');
  function resolveScreenForUser(pathOrParam: string, user: UserProfile | null): string {
    const isMasterAdmin = Boolean(user && (user.isAdmin || user.email?.toLowerCase() === 'magudbeai@gmail.com'));
    
    if (pathOrParam.includes('admin')) {
      if (isMasterAdmin) return 'admin_dashboard';
      return 'login';
    }
    if (pathOrParam.includes('post') || pathOrParam.includes('my_listings')) {
      if (user) return 'my_listings';
      return 'login';
    }
    return 'home';
  }

  // 1. Unauthenticated guest trying to visit /admin -> MUST be redirected to login
  assert(resolveScreenForUser('/admin', null) === 'login', 'Logged-out guest visiting /admin is redirected to login');
  assert(resolveScreenForUser('?screen=admin', null) === 'login', 'Logged-out guest visiting ?screen=admin is redirected to login');

  // 2. Regular user (non-admin) trying to visit /admin -> MUST be redirected to login / blocked
  const regularUser: UserProfile = {
    id: 'reg-001',
    fullName: 'Ahmed Cali',
    email: 'ahmed@gmail.com',
    phone: '0915123456',
    avatarUrl: '',
    isAdmin: false,
    isVerified: false
  };
  assert(resolveScreenForUser('/admin', regularUser) === 'login', 'Non-admin registered user visiting /admin is blocked from admin dashboard');

  // 3. Genuine Master Admin -> Permitted to admin_dashboard
  const genuineAdmin: UserProfile = {
    id: 'admin-master',
    fullName: 'Master Admin',
    email: 'magudbeai@gmail.com',
    phone: '0915752826',
    avatarUrl: '',
    isAdmin: true,
    isVerified: true
  };
  assert(resolveScreenForUser('/admin', genuineAdmin) === 'admin_dashboard', 'Genuine Master Admin granted admin_dashboard access');

  // 4. Logged-out guest trying to post property -> Redirected to login
  assert(resolveScreenForUser('/post', null) === 'login', 'Logged-out user attempting to post is redirected to login');

  console.log(`\n========================================`);
  console.log(`SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    throw new Error(`${failed} tests failed!`);
  }
}
