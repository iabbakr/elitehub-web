import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" });
}

export const APP_STORE_URL = "https://apps.apple.com/app/elitehubng";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.elitehubng";

export const GATED_FEATURES = {
  cart: {
    title: "Add to Cart — Get the App",
    description: "Download EliteHub NG to add items to your cart, checkout securely with escrow protection, and track your orders in real time.",
  },
  checkout: {
    title: "Checkout on Mobile",
    description: "Our secure escrow checkout is available on the EliteHub NG mobile app. Download now to complete your purchase.",
  },
  orders: {
    title: "Track Your Orders",
    description: "View and track all your orders, chat with sellers, and confirm deliveries — all in the EliteHub NG app.",
  },
  wallet: {
    title: "EliteHub Wallet",
    description: "Fund your wallet, withdraw earnings, and enjoy fast checkout — all in the app.",
  },
  wishlist: {
    title: "Save to Wishlist",
    description: "Save products you love and get notified of price drops in the EliteHub NG app.",
  },
  auth: {
    title: "Sign In Required",
    description: "Create your account or sign in on the EliteHub NG mobile app for the full marketplace experience.",
  },
  dispute: {
    title: "Open a Dispute",
    description: "Dispute resolution and buyer protection are managed through the EliteHub NG app.",
  },
  seller_dashboard: {
    title: "Sell on EliteHub",
    description: "Manage your products, view orders, and grow your business from the EliteHub NG seller app.",
  },
} as const;
