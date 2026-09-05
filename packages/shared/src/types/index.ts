// === API Response Types ===
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// === Auth Types ===
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF';

// === Product Types ===
export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  price: number;
  originalPrice?: number | null;
  offerPrice?: number | null;
  isOnSale?: boolean;
  saleStatus?: 'LIVE' | 'COMING_SOON' | 'ENDED' | null;
  portionSize: string | null;
  unit: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  isVegetarian?: boolean;
  spiceLevel?: number;
  preparationTimeMinutes?: number;
  sortOrder: number;
  tag?: string;
  offerStartDate?: string;
  offerEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  categoryId: string;
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  offerPrice?: number;
  portionSize?: string;
  unit?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  isVegetarian?: boolean;
  isOnSale?: boolean;
  spiceLevel?: number;
  preparationTimeMinutes?: number;
  tag?: string;
  offerStartDate?: string | null;
  offerEndDate?: string | null;
  sortOrder?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

// === Product Category Types ===
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}

// === Festival Types ===
export interface Festival {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bannerImageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFestivalRequest {
  name: string;
  description?: string;
  bannerImageUrl?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface FestivalProduct {
  id: string;
  festivalId: string;
  productId: string;
  product?: Product;
}

// === Order Types ===
export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'ReadyForPickup'
  | 'OutForDelivery'
  | 'Completed'
  | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryAddress: string | null;
  orderType: 'pickup' | 'delivery';
  status: OrderStatus;
  totalAmount: number;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  orderType: 'pickup' | 'delivery';
  notes?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

// === Cart Types ===
export interface CartItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
}

export interface AddCartItemRequest {
  productId: string;
  quantity: number;
}

// === Corporate Enquiry Types ===
export type EnquiryStatus = 'New' | 'Contacted' | 'QuoteSent' | 'Confirmed' | 'Completed' | 'Closed';

export interface CorporateEnquiry {
  id: string;
  name: string;
  company: string;
  designation: string | null;
  phone: string;
  email: string;
  numberOfPeople: number;
  dateRequired: string;
  preferredDeliveryPickupTime: string | null;
  itemsInterestedIn: string | null;
  budgetPerPerson: number | null;
  specialRequirements: string | null;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCorporateEnquiryRequest {
  name: string;
  company: string;
  designation?: string;
  phone: string;
  email: string;
  numberOfPeople: number;
  dateRequired: string;
  preferredDeliveryPickupTime?: string;
  itemsInterestedIn?: string;
  budgetPerPerson?: number;
  specialRequirements?: string;
}

// === Contact Enquiry Types ===
export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactEnquiryRequest {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

// === Review Types ===
export interface Review {
  id: string;
  customerName: string;
  customerLocation: string | null;
  rating: number;
  content: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  customerName: string;
  customerLocation?: string;
  rating: number;
  content: string;
  isPublished?: boolean;
  sortOrder?: number;
}

// === FAQ Types ===
export interface Faq {
  id: string;
  question: string;
  answer: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFaqRequest {
  question: string;
  answer: string;
  isPublished?: boolean;
  sortOrder?: number;
}

// === Blog Types ===
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// === Business Settings Types ===
export interface BusinessSettings {
  id: string;
  businessName: string;
  tagline?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
  googleMapsUrl: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  swiggyUrl: string | null;
  zomatoUrl: string | null;
  deliveryInformation: string | null;
  fssaiNumber: string | null;
  udyamRegistered: boolean;
  openingSoonEnabled: boolean;
  openingDate: string | null;
  isCartEnabled: boolean;
  updatedAt: string;
}

export interface UpdateBusinessSettingsRequest extends Partial<Omit<BusinessSettings, 'id' | 'updatedAt'>> {}

export interface MarketingSettings {
  announcementText?: string;
  announcementLink?: string;
  isAnnouncementActive?: boolean;
  isGlobalSaleActive?: boolean;
  isSaleWidgetActive?: boolean;
  offerPreVisibilityDays: number;
  offerPostVisibilityDays: number;
  saleStartDate?: string | null;
  saleEndDate?: string | null;
  saleProductIds?: string[];
}

export interface SalesCampaign {
  id: string;
  name: string;
  announcementText: string | null;
  announcementLink: string | null;
  isAnnouncementActive: boolean;
  isGlobalSaleActive: boolean;
  isSaleWidgetActive: boolean;
  preVisibilityDays: number;
  postVisibilityDays: number;
  startDate: string | null;
  endDate: string | null;
  productIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalesCampaignRequest {
  name: string;
  announcementText?: string;
  announcementLink?: string;
  isAnnouncementActive?: boolean;
  isGlobalSaleActive?: boolean;
  isSaleWidgetActive?: boolean;
  preVisibilityDays?: number;
  postVisibilityDays?: number;
  startDate?: string;
  endDate?: string;
  productIds?: string[];
  isActive?: boolean;
}

export interface UpdateSalesCampaignRequest extends Partial<CreateSalesCampaignRequest> {}

export interface HeroSlide {
  id: string;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  secondaryCtaText: string | null;
  secondaryCtaLink: string | null;
  isImageOnly: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHeroSlideRequest extends Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'> {}
export interface UpdateHeroSlideRequest extends Partial<CreateHeroSlideRequest> {}
