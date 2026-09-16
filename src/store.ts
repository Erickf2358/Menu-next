import { create } from "zustand";
import type { Store } from "@/src/types";

export const useStore = create<Store>((set) => ({
  items: [],

  addItem: (product, quantity) =>
    set((state) => {
      const existing = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return { items: [...state.items, { product, quantity }] };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: quantity === 0
        ? state.items.filter((item) => item.product.id !== productId)
        : state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
    })),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),

  clear: () => set({ items: [] }),
}));