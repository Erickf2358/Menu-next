"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { ProductSchema } from "@/src/schema/lib";

type ProductInput = {
  name: string;
  price: number;
  image: string;
  categoryId: number;
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(data: ProductInput) {
  const result = ProductSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const category = await prisma.category.findUnique({
    where: { id: result.data.categoryId },
  });
  if (!category) {
    return { error: "La categoría seleccionada no existe" };
  }

  await prisma.product.create({
    data: {
      ...result.data,
      slug: slugify(result.data.name),
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/order/[category]", "page");
  return { success: true };
}

export async function updateProduct(productId: number, data: ProductInput) {
  const result = ProductSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const category = await prisma.category.findUnique({
    where: { id: result.data.categoryId },
  });
  if (!category) {
    return { error: "La categoría seleccionada no existe" };
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      ...result.data,
      slug: slugify(result.data.name),
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/order/[category]", "page");
  return { success: true };
}

export async function deleteProduct(productId: number) {
  try {
    await prisma.product.delete({ where: { id: productId } });
  } catch {
    return {
      error:
        "No se pudo eliminar el producto. Puede que tenga pedidos asociados.",
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/order/[category]", "page");
  return { success: true };
}
