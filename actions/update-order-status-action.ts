"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";

export async function updateOrderStatus(orderId: number, status: boolean) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status, completedAt: status ? new Date() : null },
  });

  revalidatePath("/admin/orders");
}
