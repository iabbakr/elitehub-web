"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WebCartItem {
  id:               string;  // productId (or productId-color)
  productId:        string;
  name:             string;
  price:            number;
  discount?:        number;
  quantity:         number;
  imageUrl:         string;
  sellerId:         string;
  sellerBusinessName?: string;
  stock:            number;
  location:         { state: string; city: string; area: string };
  deliveryOptions?: {
    withinState:  number;
    outsideState: number;
    allowsPickup: boolean;
  };
  selectedColor?:   string;
}

interface CartState {
  items: WebCartItem[];

  addItem:        (item: WebCartItem) => void;
  removeItem:     (itemId: string)    => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart:      ()                  => void;

  getSubtotal:    ()                  => number;
  getTotalItems:  ()                  => number;
  isInCart:       (productId: string, color?: string) => boolean;
  getItemQty:     (productId: string, color?: string) => number;
}

function effectivePrice(item: WebCartItem) {
  return item.discount ? item.price * (1 - item.discount / 100) : item.price;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (incoming) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === incoming.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === incoming.id
                  ? { ...i, quantity: Math.min(i.quantity + incoming.quantity, i.stock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, incoming] };
        });
      },

      removeItem: (itemId) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== itemId) })),

      updateQuantity: (itemId, qty) => {
        if (qty <= 0) { get().removeItem(itemId); return; }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity: Math.min(qty, i.stock) } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + effectivePrice(i) * i.quantity, 0),

      getTotalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      isInCart: (productId, color) => {
        const id = color
          ? `${productId}-${color.toLowerCase().replace(/\s+/g, "_")}`
          : productId;
        return get().items.some((i) => i.id === id);
      },

      getItemQty: (productId, color) => {
        const id = color
          ? `${productId}-${color.toLowerCase().replace(/\s+/g, "_")}`
          : productId;
        return get().items.find((i) => i.id === id)?.quantity ?? 0;
      },
    }),
    {
      name:    "elitehub-web-cart",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);