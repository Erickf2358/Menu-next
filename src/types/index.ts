import type { Product } from "@/src/generated/prisma/client";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Store = {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (productId: Product["id"], quantity: number) => void;
  removeItem: (productId: Product["id"]) => void;
  clear: () => void;
};