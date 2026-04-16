// ─── Core Data Types (mirrors firebaseService.ts from mobile) ────────────────

export interface Location {
  state: string;
  city: string;
  area: string;
}

export interface DeliveryOptions {
  withinState: number;
  outsideState: number;
  allowsPickup: boolean;
  pickupAddress?: string;
  estimatedDays: { withinState: string; outsideState: string };
}

export interface WholesaleConfig {
  enabled: boolean;
  minQty?: number;
  price?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  imageUrls: string | string[];
  sellerId: string;
  sellerBusinessName?: string;
  stock: number;
  discount?: number;
  location: Location;
  brand?: string;
  weight?: string;
  condition?: "Brand New" | "Used";
  colors?: string[];
  warranty?: string;
  deliveryOptions?: DeliveryOptions;
  wholesale?: WholesaleConfig;
  createdAt: number;
  status?: "active" | "pending_review" | "rejected";
  isFeatured?: boolean;
  isPrescriptionRequired?: boolean;
  tags?: string[];
}

export interface ServiceProvider {
  uid: string;
  businessName: string;
  businessPhone: string;
  whatsappNumber?: string;
  serviceCategory: string;
  serviceSubcategory?: string;
  serviceDescription?: string;
  imageUrl?: string;
  isVerified?: boolean;
  isAvailable?: boolean;
  rating?: number;
  totalReviewsAllTime?: number;
  location?: Location;
  yearsOfExperience?: number;
  certifications?: string[];
  rcNumber?: string;
  instagramUsername?: string;
  tiktokUsername?: string;
  subscriptionExpiresAt?: number;
}

export interface Seller {
  uid: string;
  name: string;
  businessName?: string;
  businessAddress?: string;
  location?: Location;
  imageUrl?: string;
  rating?: number;
  totalReviews?: number;
  rcNumber?: string;
  createdAt: number;
}

export interface Review {
  id: string;
  buyerName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export interface FilterState {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  state?: string;
  city?: string;
  condition?: string;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
}

export type GatedFeature =
  | "cart"
  | "checkout"
  | "orders"
  | "wallet"
  | "wishlist"
  | "auth"
  | "dispute"
  | "seller_dashboard";

export interface AppGateConfig {
  feature: GatedFeature;
  title: string;
  description: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ProductsResponse {
  products: Product[];
  hasMore: boolean;
  nextCursor?: number | null;
  total?: number;
}

export interface ProductResponse {
  product: Product | null;
  relatedProducts: Product[];
}
