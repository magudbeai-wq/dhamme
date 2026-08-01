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
  | 'ai';

export type ListingMode = 'kiro' | 'iib'; // Kiro = Rent, Iib = Sale

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
}

export interface PropertyListing {
  id: string;
  title: string;
  priceEtb: number;
  priceLocalFormatted: string; // e.g. "25,000 ETB/mo"
  mode: ListingMode;
  category: PropertyCategory;
  city: string; // Jigjiga
  kebele: string; // Kebele 01 - Kebele 10, Garab'ase, Taiwan Area
  beds: number;
  baths: number;
  areaSqm?: number;
  water: boolean | string;
  electricity: boolean | string;
  pool: boolean | string;
  isFeatured?: boolean;
  images: string[];
  description: string;
  agentName: string;
  agentPhone: string;
  agentAvatar: string;
  postedDate: string;
  ownerEmail?: string;
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
}
