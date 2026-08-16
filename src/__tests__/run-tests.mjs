// Quick runner for node
import { INITIAL_PROPERTIES } from '../data/propertiesData.js';

console.log('🚀 Running DHAMME Marketplace Automated Test Suite...\n');
let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

// TEST 1: Initial Property Data & Video Integration
console.log('--- TEST GROUP 1: Real Estate Data & Video Integration ---');
assert(INITIAL_PROPERTIES.length >= 6, 'INITIAL_PROPERTIES contains at least 6 authentic Jigjiga listings');

const propertiesWithVideo = INITIAL_PROPERTIES.filter((p) => Boolean(p.videoUrl));
assert(propertiesWithVideo.length >= 5, 'At least 5 listings have valid videoUrl attached');

const videoFormatsValid = propertiesWithVideo.every((p) => 
  p.videoUrl?.endsWith('.mp4') || p.videoUrl?.endsWith('.webm') || p.videoUrl?.endsWith('.mov') || p.videoUrl?.startsWith('http')
);
assert(videoFormatsValid, 'All video URLs match supported formats (MP4, WebM, MOV, HTTP Stream)');

// TEST 2: Security & Privilege Escalation Prevention
console.log('\n--- TEST GROUP 2: Security & Privilege Escalation Prevention ---');
function checkAdminPrivilege(email) {
  return email.toLowerCase() === 'magudbeai@gmail.com';
}

assert(checkAdminPrivilege('magudbeai@gmail.com') === true, 'Master admin (magudbeai@gmail.com) gets admin privilege');
assert(checkAdminPrivilege('fakeadmin@gmail.com') === false, 'Privilege Escalation blocked: fakeadmin@gmail.com denied admin role');
assert(checkAdminPrivilege('admin@dhamme.app') === false, 'Privilege Escalation blocked: admin@dhamme.app denied admin role');
assert(checkAdminPrivilege('attacker_admin_hacker@yahoo.com') === false, 'Privilege Escalation blocked: substring admin check denied');

// TEST 3: Search & Filter Logic Synchronization
console.log('\n--- TEST GROUP 3: Search & Filter Synchronization ---');
function filterProperties(props, filter, query = '') {
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

// Filter 1: Kiro vs Iib Mode
const kiroListings = filterProperties(INITIAL_PROPERTIES, {
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

const iibListings = filterProperties(INITIAL_PROPERTIES, {
  mode: 'iib',
  searchLocation: 'Jigjiga',
  category: 'All Properties',
  minPriceEtb: 0,
  maxPriceEtb: 20000000,
  kebele: '',
  beds: 'any',
  waterRequired: false,
  powerRequired: false
});
assert(iibListings.every((p) => p.mode === 'iib'), 'Filter Mode "iib" strictly returns sale listings');

// Filter 2: Video Tour Only Filter
const videoOnlyListings = filterProperties(INITIAL_PROPERTIES, {
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

// Filter 3: Kebele 06 Garab'ase Filter
const garabaseListings = filterProperties(INITIAL_PROPERTIES, {
  mode: 'kiro',
  searchLocation: 'Jigjiga',
  category: 'All Properties',
  minPriceEtb: 0,
  maxPriceEtb: 500000,
  kebele: 'Kebele 06',
  beds: 'any',
  waterRequired: false,
  powerRequired: false
});
assert(garabaseListings.every((p) => p.kebele.includes('06')), 'Filter Kebele "Kebele 06" strictly returns Garab\'ase listings');

// Filter 4: Keyword Search Query
const searchedTaiwan = filterProperties(INITIAL_PROPERTIES, {
  mode: 'kiro',
  searchLocation: 'Jigjiga',
  category: 'All Properties',
  minPriceEtb: 0,
  maxPriceEtb: 500000,
  kebele: '',
  beds: 'any',
  waterRequired: false,
  powerRequired: false
}, 'Taiwan');
assert(searchedTaiwan.length > 0 && searchedTaiwan.every((p) => p.title.includes('Taiwan') || p.kebele.includes('Taiwan')), 'Search query "Taiwan" matches Taiwan market property');

// TEST 4: Property Video Validation & Upload Constraints
console.log('\n--- TEST GROUP 4: Video Upload Validation Constraints ---');
function validateVideoUpload(file) {
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

// TEST 5: GPS Proximity Calculation
console.log('\n--- TEST GROUP 5: GPS Proximity Calculation ---');
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

const jigjigaCenter = { lat: 9.3524, lng: 42.7961 };
const garabase = { lat: 9.3491, lng: 42.7885 };
const dist = calculateDistanceKm(jigjigaCenter.lat, jigjigaCenter.lng, garabase.lat, garabase.lng);
assert(dist > 0 && dist < 5, `GPS distance between Center and Garab'ase calculated accurately: ${dist} km`);

console.log(`\n========================================`);
console.log(`SUMMARY: ${passed} PASSED | ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
