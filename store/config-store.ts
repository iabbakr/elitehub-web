/**
 * lib/config-store.ts
 * Web equivalent of mobile's useConfigStore.ts
 * ─────────────────────────────────────────────
 * Fetches categories & locations from /system/config at runtime.
 * Falls back to the local constants.ts values when the API is unavailable.
 * All styling/design decisions live in the components — this is data-only.
 */

import { create } from "zustand";
import {
  SELLER_CATEGORIES,
  SERVICE_CATEGORIES,
  NIGERIAN_LOCATIONS,
} from "@/lib/categories";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

// ── Types ─────────────────────────────────────────────────────────────────────

export type LocationData = Record<string, Record<string, string[]>>;

export interface Category {
  name: string;
  label: string;
  icon: string;
  subcategories: readonly string[];
}

interface ConfigState {
  sellerCategories: readonly Category[];
  serviceCategories: readonly Category[];
  locations: LocationData;
  isLoaded: boolean;
  fetchConfig: () => Promise<void>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export const getAllStates = (locations: LocationData): string[] =>
  Object.keys(locations).sort();

export const getCities = (locations: LocationData, state: string): string[] =>
  state && locations[state] ? Object.keys(locations[state]).sort() : [];

export const getAreas = (
  locations: LocationData,
  state: string,
  city: string
): string[] => {
  if (!state || !city) return [];
  return locations[state]?.[city] ?? [];
};

// ── Store ─────────────────────────────────────────────────────────────────────

export const useConfigStore = create<ConfigState>((set, get) => ({
  // Local constants as initial / fallback values
  sellerCategories: SELLER_CATEGORIES as readonly Category[],
  serviceCategories: SERVICE_CATEGORIES as readonly Category[],
  locations: NIGERIAN_LOCATIONS as LocationData,
  isLoaded: false,

  fetchConfig: async () => {
    // Don't refetch if already loaded
    if (get().isLoaded) return;
    try {
      const res = await fetch(`${API_BASE}/system/config`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && data.data) {
        set({
          sellerCategories:
            data.data.sellerCategories ?? SELLER_CATEGORIES,
          serviceCategories:
            data.data.serviceCategories ?? SERVICE_CATEGORIES,
          // Merge: remote additions override local, but local is always the base
          locations: {
            ...(NIGERIAN_LOCATIONS as LocationData),
            ...(data.data.locations ?? {}),
          },
          isLoaded: true,
        });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      // Silent — keep local fallbacks, mark as loaded so we don't hammer the API
      set({ isLoaded: true });
    }
  },
}));