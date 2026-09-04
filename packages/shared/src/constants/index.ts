// === Brand Colors ===
export const BRAND_COLORS = {
  heritageGreen: '#2C4A3B',
  warmCream: '#FAF4E6',
  antiqueBrass: '#B8925A',
  darkBrown: '#3E2C22',
  terracotta: '#B85C3E',
} as const;

// === Business Defaults (from source brief — confirmed values) ===
export const BUSINESS_DEFAULTS = {
  name: "Grandma's Ladle",
  tagline: 'Traditional goodness, from our kitchen to yours.',
  emotionalStatement: 'What our grandmothers made with their hands, we bring to your table.',
  storyAnchor: 'It started with a silver glass.',
  phone: '9841207516',
  whatsapp: '9841207516',
  email: 'grandmasladle1269@gmail.com',
  address: 'No.26/2, 4th Cross, Sawmill Road, New Thippasandra, Bangalore-560075',
  openingHours: '10:00 AM TO 8:00 PM',
  fssaiNumber: '21226010006642',
  domain: 'grandmasladle.com',
} as const;

// === Order Statuses ===
export const ORDER_STATUSES: readonly string[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'ReadyForPickup',
  'OutForDelivery',
  'Completed',
  'Cancelled',
] as const;

// === Enquiry Statuses ===
export const ENQUIRY_STATUSES: readonly string[] = [
  'New',
  'Contacted',
  'QuoteSent',
  'Confirmed',
  'Completed',
  'Closed',
] as const;

// === User Roles ===
export const USER_ROLES: readonly string[] = [
  'ADMIN',
  'MANAGER',
  'STAFF',
] as const;

// === Pagination Defaults ===
export const PAGINATION_DEFAULTS = {
  page: 1,
  pageSize: 20,
  maxPageSize: 100,
} as const;

// === API Cache Times (ms) ===
export const CACHE_TIMES = {
  products: 60_000,        // 1 minute
  categories: 300_000,     // 5 minutes
  festivals: 60_000,       // 1 minute
  reviews: 300_000,        // 5 minutes
  faqs: 900_000,           // 15 minutes
  businessSettings: 300_000, // 5 minutes
} as const;

// === Brand Lines / Copy Bank (from source brief — do not modify) ===
export const BRAND_LINES = {
  tagline: 'Traditional goodness, from our kitchen to yours.',
  silverGlass: 'It started with a silver glass.',
  twoGrandmothers: 'Two grandmothers. One legacy.',
  notJustFood: 'Not just food. A piece of home.',
  fromHands: 'From our grandmothers\' hands to your table.',
  whatGrandmothersMade: 'What our grandmothers made with their hands, we bring to your table.',
  smallBeginnings: 'Small beginnings. Honest work. A lasting legacy.',
  madeWithCare: 'Made with the care of a grandmother\'s kitchen.',
  traditionalFood: 'Traditional food. Timeless memories.',
  ladleFull: 'A ladle full of tradition.',
} as const;
