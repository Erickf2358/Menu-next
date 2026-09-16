"use server";

import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";
import { TableSessionSchema } from "@/src/schema/lib";

const COOKIE_NAME = "table_session_id";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_MS / 1000,
};

export async function startOrResumeTableSession(tableNumber: number) {
  const result = TableSessionSchema.safeParse({ tableNumber });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const now = new Date();

  // Find-then-create: two customers entering the same table number at the
  // exact same instant could each create their own active TableSession.
  // Accepted trade-off for a small kiosk app — worst case is two active
  // sessions for one table until the older one expires in 12h.
  const existing = await prisma.tableSession.findFirst({
    where: {
      tableNumber: result.data.tableNumber,
      closedAt: null,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
  });

  const session =
    existing ??
    (await prisma.tableSession.create({
      data: {
        tableNumber: result.data.tableNumber,
        expiresAt: new Date(now.getTime() + SESSION_TTL_MS),
      },
    }));

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session.id, cookieOptions);

  return { success: true, tableNumber: session.tableNumber };
}

export async function getActiveTableSessionId() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) return null;

  const session = await prisma.tableSession.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.closedAt || session.expiresAt < new Date()) {
    return null;
  }

  return session.id;
}

export async function getCurrentTableSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) return null;

  const session = await prisma.tableSession.findUnique({
    where: { id: sessionId },
    include: {
      orders: {
        include: { orderProducts: { include: { product: true } } },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!session || session.closedAt || session.expiresAt < new Date()) {
    return null;
  }

  return session;
}

export async function closeTableSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;

  if (sessionId) {
    await prisma.tableSession.updateMany({
      where: { id: sessionId, closedAt: null },
      data: { closedAt: new Date() },
    });
  }

  cookieStore.delete(COOKIE_NAME);
  return { success: true };
}
