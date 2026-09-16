import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { getCurrentTableSession } from "@/actions/table-session-actions";
import TableSessionGate from "@/components/order/TableSessionGate";

async function getCategories() {
  return await prisma.category.findMany();
}

export default async function Home() {
  const tableSession = await getCurrentTableSession();

  if (!tableSession) {
    return <TableSessionGate />;
  }

  const categories = await getCategories();

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold">Bienvenido a Quiosco</h1>
        <p className="text-lg text-gray-500 mt-2">
          Elige una categoria para empezar tu pedido
        </p>
      </div>

      {categories.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/order/${category.slug}`}
              className="flex flex-col items-center gap-3 bg-white rounded-lg border border-gray-200 p-5 hover:bg-amber-400 transition-colors"
            >
              <div className="relative size-20">
                <Image
                  src={`/icon_${category.slug}.svg`}
                  alt={`Imagen de la categoria: ${category.name}`}
                  fill
                />
              </div>
              <span className="text-lg font-bold">{category.name}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No hay categorias disponibles por el momento.
        </p>
      )}
    </div>
  );
}
