
import { SubscriptionPlan } from './types';

export const WALLETS = {
  SOLANA: 'F2UJS1wNzsfcQTknPsxBk7B25qWbU9JtiRW1eRgdwLJY',
  ETHEREUM: '0xC5BC11e19D3De81a1365259A99AF4D88c62a8C50',
  MONAD: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  BASE: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  SUI: '0x1e3f885f8e5898989b5898a89b89b89b89b89b89',
  POLYGON: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  BITCOIN: 'bc1q9s855ehn959s5t2g6kjt9q7pt5t55n9gq7gpd7'
};

export const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1, label: 'US Dollar' },
  { code: 'SAR', symbol: 'ر.س', rate: 3.75, label: 'Saudi Riyal' },
  { code: 'AED', symbol: 'د.إ', rate: 3.67, label: 'UAE Dirham' },
  { code: 'EGP', symbol: 'ج.م', rate: 48.5, label: 'Egyptian Pound' },
  { code: 'EUR', symbol: '€', rate: 0.92, label: 'Euro' }
];

export const CONTACT_EMAIL = 'jikob67@gmail.com';

export const SUPPORT_LINKS = [
  { name: 'Help Center', url: 'https://jacobalcadiapps.wordpress.com' },
  { name: 'Safety Guide', url: 'https://jacobalcadiapps.blogspot.com' }
];

export const CATEGORIES = [
  'Cars', 'Cameras', 'Garden Tools', 'Real Estate', 'Books', 'Electronics', 'Appliances', 'Other'
];

export const POINTS_SYSTEM = {
  CREATE_LISTING: 50,
  MESSAGE: 5,
  ATTACHMENT: 5,
  LIKE: 2,
  SHARE: 10,
  RATE: 15
};

export const PLANS: (SubscriptionPlan & { pointsCost: number })[] = [
  {
    id: 'starter',
    name: 'Starter Tier',
    description: 'Perfect for casual renters and community beginners.',
    isSpecial: false,
    pointsCost: 100,
    pricing: { daily: 0.49, monthly: 4.99, yearly: 45.00 },
    features: [
      'Up to 10 Active Listings',
      'Verified Profile Badge',
      'Community Group Access',
      'Basic AI Content Screening'
    ]
  },
  {
    id: 'standard',
    name: 'Standard Tier',
    description: 'Boost your visibility and media capabilities.',
    isSpecial: true,
    pointsCost: 1500,
    pricing: { daily: 1.49, monthly: 12.99, yearly: 120.00 },
    features: [
      'Up to 50 Active Listings',
      'Video Upload Support',
      'Priority Search Placement',
      'Global Crypto Payouts',
      'Ad-Free Browsing'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Tier',
    description: 'The ultimate toolkit for rental professionals.',
    pointsCost: 5000,
    pricing: { daily: 2.99, monthly: 24.99, yearly: 240.00 },
    features: [
      'Unlimited Active Listings',
      'Pro Analytics Dashboard',
      'Exclusive Manager Support',
      'AI Trust-Score Accelerator',
      'Early Access to Features'
    ]
  }
];
