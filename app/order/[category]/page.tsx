import { prisma } from "@/src/lib/prisma";
import ProductCard from "@/components/products/ProductCard";

type OrderPageProps = {
  params: Promise<{ category: string }>;
};

async function getProductsByCategory(slug: string) {
  return await prisma.product.findMany({
    where: {
      category: {
        slug,
      },
    },
  });
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { category } = await params;
  const products = await getProductsByCategory(category);

  return (
    <>
      <h1 className="text-3xl font-bold text-center">
        Elige y personaliza tu pedido
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}