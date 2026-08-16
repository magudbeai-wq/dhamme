export type ScreenName = 
  | 'splash' 
  | 'onboarding' 
  | 'login' 
  | 'signup' 
  | 'otp' 
  | 'forgot_password' 
  | 'home' 
  | 'details' 
  | 'filter' 
  | 'post_step1' 
  | 'post_step2' 
  | 'post_step3' 
  | 'post_step4' 
  | 'post_step5' 
  | 'favorites' 
  | 'my_listings' 
  | 'profile' 
  | 'ai'
  | 'privacy'
  | 'terms'
  | 'admin_dashboard';

export type ListingMode = 'kiro' | 'iib'; // Kiro = Rent, Iib = Sale
export type ListingStatus = 'active' | 'sold' | 'rented';

export type PropertyCategory = 
  | 'All Properties'
  | 'Family House' 
  | 'Single Room' 
  | 'Studio' 
  | 'Villa' 
  | 'Apartment';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
  bio?: string;
  isVerified: boolean;
  isAdmin?: boolean;
  isBanned?: boolean;
  bannedReason?: string;
  bannedAt?: string;
  joinedDate?: string;
}

export interface PropertyListing {
  id: string;
  title: string;
  priceEtb: number;
  priceLocalFormatted: string; // e.g. "25,000 ETB/mo" or "2,000,000 ETB"
  mode: ListingMode;
  category: PropertyCategory;
  city: string; // Strictly Jigjiga
  kebele: string; // Kebele 01 - Kebele 10, Garab'ase, Taiwan Area, Airport Road
  beds: number;
  baths: number;
  areaSqm?: number;
  water: boolean | string;
  electricity: boolean | string;
  pool: boolean | string;
  isFeatured?: boolean;
  images: string[];
  // Property Video Tour Fields
  videoUrl?: string; // e.g. MP4/WebM URL or blob/data URI
  videoThumbnail?: string;
  videoDuration?: number; // duration in seconds
  videoStatus?: 'ready' | 'active' | 'pending' | 'flagged';
  description: string;
  agentName: string;
  agentPhone: string;
  agentAvatar: string;
  postedDate: string;
  ownerEmail?: string;
  // GPS Location Fields
  gpsCoords?: string; // e.g. "9.3500° N, 42.8000° E"
  nearDistance?: string; // e.g. "0.8 km from Taiwan Market"
  lat?: number; // e.g. 9.3500
  lng?: number; // e.g. 42.8000
  // Dashboard Analytics & Status Fields
  status?: ListingStatus; // 'active' | 'sold' | 'rented'
  viewsCount?: number; // e.g. 420
  inquiriesCount?: number; // e.g. 18
}

export interface FilterState {
  mode: ListingMode;
  searchLocation: string;
  category: PropertyCategory;
  minPriceEtb: number;
  maxPriceEtb: number;
  kebele: string;
  beds: string;
  waterRequired: boolean;
  powerRequired: boolean;
  hasVideo?: boolean;
}

export interface NewListingDraft {
  title: string;
  mode: ListingMode;
  category: PropertyCategory;
  priceEtb: number;
  city: string;
  kebele: string;
  beds: number;
  baths: number;
  areaSqm: number;
  description: string;
  water: boolean;
  electricity: boolean;
  images: string[];
  videoUrl?: string;
  videoThumbnail?: string;
  videoDuration?: number;
  gpsCoords?: string;
  nearDistance?: string;
}

