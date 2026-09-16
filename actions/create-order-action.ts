"use server";

import { prisma } from "@/src/lib/prisma";
import { OrderSchema } from "@/src/schema/lib";

type OrderItemInput = {
  productId: number;
  quantity: number;
  price: number;
};

export async function createOrder(
  name: string,
  items: OrderItemInput[],
  total: number
) {
  const result = OrderSchema.safeParse({ name, items, total });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((item) => item.productId) } },
  });

  if (products.length !== items.length) {
    return { error: "Uno o más productos ya no están disponibles" };
  }

  const realTotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  if (Math.abs(realTotal - total) > 0.01) {
    return { error: "El total no coincide con el precio de los productos" };
  }

  await prisma.order.create({
    data: {
      name,
      total: realTotal,
      orderProducts: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });

  return { success: true };
}
