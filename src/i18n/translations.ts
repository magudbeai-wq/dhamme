export type Language = 'so' | 'en' | 'am';

export interface Translations {
  home: string;
  favorites: string;
  postListing: string;
  myListings: string;
  profile: string;
  searchPlaceholder: string;
  allProperties: string;
  forRent: string;
  forSale: string;
  listView: string;
  mapView: string;
  beds: string;
  baths: string;
  area: string;
  water24h: string;
  power24h: string;
  contactLandlord: string;
  callNow: string;
  whatsApp: string;
  leaseAgreement: string;
  aiHelper: string;
  adminPanel: string;
  sessionExpired: string;
  signIn: string;
  signUp: string;
  signOut: string;
  jigjigaProperties: string;
}

export const translations: Record<Language, Translations> = {
  so: {
    home: 'Guri',
    favorites: 'Dooro',
    postListing: 'Soo Dhig',
    myListings: 'Guryahayga',
    profile: 'Koontada',
    searchPlaceholder: 'Raadi Kebele, Qiimo ama Magac guri...',
    allProperties: 'Dhamaan Guryaha',
    forRent: 'Kiro (Rent)',
    forSale: 'Iib (Sale)',
    listView: 'Liis (List)',
    mapView: 'Khariidad (Map)',
    beds: 'Qolalka',
    baths: 'Suuliga',
    area: 'Bedka',
    water24h: 'Biyaha 24h',
    power24h: 'Korontada 24h',
    contactLandlord: 'La Xiriir Milkiilaha',
    callNow: 'Wac Nambarka',
    whatsApp: 'WhatsApp',
    leaseAgreement: 'Heshiiska Kirada',
    aiHelper: 'AI Helper',
    adminPanel: '👑 Admin Panel',
    sessionExpired: 'Kalfadhigii Waa Dhacay',
    signIn: 'Soo Gal (Sign In)',
    signUp: 'Samayso Account',
    signOut: 'Ka Bax (Sign Out)',
    jigjigaProperties: 'Guryaha Jigjiga'
  },
  en: {
    home: 'Home',
    favorites: 'Favorites',
    postListing: 'Post Listing',
    myListings: 'My Listings',
    profile: 'Profile',
    searchPlaceholder: 'Search Kebele, price or property name...',
    allProperties: 'All Properties',
    forRent: 'For Rent',
    forSale: 'For Sale',
    listView: 'List View',
    mapView: 'Map View',
    beds: 'Beds',
    baths: 'Baths',
    area: 'Area',
    water24h: '24h Water',
    power24h: '24h Electricity',
    contactLandlord: 'Contact Landlord',
    callNow: 'Call Now',
    whatsApp: 'WhatsApp',
    leaseAgreement: 'Lease Agreement',
    aiHelper: 'AI Helper',
    adminPanel: '👑 Admin Panel',
    sessionExpired: 'Session Expired',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    jigjigaProperties: 'Jigjiga Properties'
  },
  am: {
    home: 'መኖሪያ',
    favorites: 'የተመረጡ',
    postListing: 'ቤት ለጥፍ',
    myListings: 'የእኔ ቤቶች',
    profile: 'መገለጫ',
    searchPlaceholder: 'ቀበሌ፣ ዋጋ ወይም የቤት ስም ይፈልጉ...',
    allProperties: 'ሁሉም ቤቶች',
    forRent: 'ለኪራይ',
    forSale: 'ለሽያጭ',
    listView: 'ዝርዝር እይታ',
    mapView: 'ካርታ እይታ',
    beds: 'ክፍሎች',
    baths: 'መታጠቢያ',
    area: 'ስፋት',
    water24h: '24ሰ የውሃ',
    power24h: '24ሰ መብራት',
    contactLandlord: 'ባለቤቱን ያነጋግሩ',
    callNow: 'አሁኑኑ ይደውሉ',
    whatsApp: 'WhatsApp',
    leaseAgreement: 'የኪራይ ውል',
    aiHelper: 'AI ረዳት',
    adminPanel: '👑 አስተዳዳሪ',
    sessionExpired: 'ክፍለ ጊዜው አልፏል',
    signIn: 'ይግቡ',
    signUp: 'ይምዝገቡ',
    signOut: 'ውጣ',
    jigjigaProperties: 'የጅጅጋ ቤቶች'
  }
};
