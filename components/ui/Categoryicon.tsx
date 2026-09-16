"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/src/generated/prisma/client";

type CategoryIconProps = {
  category: Category;
};

export default function CategoryIcon({ category }: CategoryIconProps) {
  const pathname = usePathname();
  const isActive = pathname === `/order/${category.slug}`;

  return (
    <div
      className={`flex items-center gap-4 w-full border-t border-gray-200 p-3 last-of-type:border-b ${
        isActive ? "bg-amber-400" : ""
      }`}
    >
      <div className="relative size-16">
        <Image
          src={`/icon_${category.slug}.svg`}
          alt={`Imagen de la categoria: ${category.name}`}
          fill
        />
      </div>
      <Link className="text-lg font-bold" href={`/order/${category.slug}`}>
        {category.name}
      </Link>
    </div>
  );
}
