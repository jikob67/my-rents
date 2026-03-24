
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export interface LocationDetail {
  lat: number;
  lng: number;
  address: string;
  country: string;
  city: string;
  district: string;
}

export interface PayoutMethods {
  solana?: string;
  ethereum?: string;
  monad?: string;
  base?: string;
  sui?: string;
  polygon?: string;
  bitcoin?: string;
  paypal?: string;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string;
  gender: Gender;
  birthDate: string;
  location: LocationDetail;
  status: string;
  points: number;
  listingsCount: number;
  walletBalance: number;
  currencyPreference: string;
  trustScore: number;
  badges: string[];
  subscription?: {
    tier: string;
    expiresAt: string;
  };
  payoutMethods: PayoutMethods;
  blockedUsers: string[];
  isVerified?: boolean;
}

export enum ListingType {
  RENT = 'RENT'
}

export enum CurrencyType {
  CRYPTO = 'CRYPTO',
  LOCAL = 'LOCAL'
}

export enum RentalPeriod {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR'
}

export interface Listing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerUsername: string;
  ownerAvatar: string;
  title: string;
  description: string;
  type: ListingType;
  price: number;
  currency: string;
  currencyType: CurrencyType;
  payoutMethod: 'PAYPAL' | 'CRYPTO';
  payoutAddress: string;
  cryptoCurrency?: string;
  category: string;
  location: LocationDetail;
  images: string[];
  video?: string;
  createdAt: string;
  rentalPeriod: RentalPeriod;
  views: number;
  likes: number;
  rating: number;
  isAiApproved: boolean;
  unavailableDates: string[];
  status: 'DRAFT' | 'AI_REVIEW' | 'PUBLISHED' | 'REJECTED';
  visibility: 'PUBLIC' | 'PRIVATE';
  review_state: 'PENDING' | 'APPROVED' | 'REJECTED';
  published_at: string | null;
  updated_at: string;
  is_deleted: boolean;
}

export interface GroupChat {
  id: string;
  name: string;
  description: string;
  image: string;
  adminId: string;
  members: string[];
}

// Fix: Define and export SubscriptionPlan used in constants.ts
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  isSpecial?: boolean;
  pricing: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  features: string[];
}
