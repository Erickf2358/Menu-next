"use client";

import { MinusIcon, PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import type { CartItem } from "@/src/types";
import { useStore } from "@/src/store";
import { formatCurrency } from "@/src/utils";

type ProductDetailsProps = {
  item: CartItem;
};

export default function ProductDetails({ item }: ProductDetailsProps) {
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeItem = useStore((state) => state.removeItem);

  return (
    <div className="shadow space-y-1 p-4 bg-white border-t border-gray-200">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <p className="text-xl font-bold">{item.product.name}</p>

          <button
            type="button"
            onClick={() => removeItem(item.product.id)}
          >
            <XCircleIcon className="text-red-600 h-8 w-8" />
          </button>
        </div>
        <p className="text-2xl text-amber-500 font-black">
          {formatCurrency(item.product.price)}
        </p>
        <div className="flex gap-5 px-10 py-2 bg-gray-100 w-fit rounded-lg">
          <button
            type="button"
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          >
            <MinusIcon className="h-6 w-6" />
          </button>

          <p className="text-lg font-black">{item.quantity}</p>

          <button
            type="button"
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </div>
        <p className="text-xl font-black text-gray-700">
          Subtotal: {""}
          <span className="font-normal">
            {formatCurrency(item.product.price * item.quantity)}
          </span>
        </p>
      </div>
    </div>
  );
}