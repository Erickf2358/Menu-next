import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/src/lib/prisma";
import Heading from "@/components/ui/Heading";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { formatCurrency } from "@/src/utils";

async function getProducts() {
  return await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading>Administrar productos</Heading>
        <Link
          href="/admin/products/new"
          className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold uppercase text-sm px-5 py-3 rounded-lg"
        >
          Nuevo producto
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">Aún no hay productos</p>
      ) : (
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={`/products/${product.image}.jpg`}
                  alt={`Imagen del producto ${product.name}`}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-gray-500">
                  {product.category.name}
                </p>
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-xl font-black text-amber-500">
                  {formatCurrency(product.price)}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase text-sm px-3 py-2 rounded-lg"
                >
                  Editar
                </Link>
                <DeleteProductButton productId={product.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
