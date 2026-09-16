import { prisma } from "@/src/lib/prisma";
import OrderCard from "@/components/admin/OrderCard";
import Heading from "@/components/ui/Heading";

const COMPLETED_VISIBLE_HOURS = 2;

async function getOrders() {
  const twoHoursAgo = new Date(Date.now() - COMPLETED_VISIBLE_HOURS * 60 * 60 * 1000);

  const orders = await prisma.order.findMany({
    where: {
      OR: [{ status: false }, { completedAt: { gte: twoHoursAgo } }],
    },
    include: {
      orderProducts: {
        include: { product: true },
      },
    },
    orderBy: { date: "desc" },
  });

  return {
    pending: orders.filter((order) => !order.status),
    completed: orders
      .filter((order) => order.status)
      .sort(
        (a, b) => (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0)
      ),
  };
}

export default async function OrdersPage() {
  const { pending, completed } = await getOrders();

  return (
    <>
      <Heading>Pedidos</Heading>

      {pending.length === 0 && completed.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">Aún no hay pedidos</p>
      ) : (
        <>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pending.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {completed.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-bold text-gray-500 uppercase">
                Completados recientemente
              </h3>
              <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {completed.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
