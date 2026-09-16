"use client";

import Image from "next/image";
import type { Product } from "@/src/generated/prisma/client";
import { formatCurrency } from "@/src/utils";
import { useStore } from "@/src/store";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useStore((state) => state.addItem);

  return (
    <div className="border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={`/products/${product.image}.jpg`}
          alt={`Imagen del producto ${product.name}`}
          fill
          className="object-cover"
        />
      </div>

        <div className="mt-3 space-y-1">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-2xl font-black text-amber-500">
            {formatCurrency(product.price)}
            </p>
        </div>
      <button 
      type="button" 
      className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer"
      onClick={() => addItem(product, 1)}
      >Agregar </button>
    </div>
  );
}
