"use server";

import { prisma } from "@/src/lib/prisma";
import { OrderSchema } from "@/src/schema/lib";
import { getActiveTableSessionId } from "@/actions/table-session-actions";

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

  const tableSessionId = await getActiveTableSessionId();
  if (!tableSessionId) {
    return {
      error:
        "Tu sesión de mesa expiró o no es válida. Vuelve a ingresar tu número de mesa.",
    };
  }

  await prisma.order.create({
    data: {
      name,
      total: realTotal,
      tableSessionId,
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
