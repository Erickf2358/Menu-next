import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import Heading from "@/components/ui/Heading";
import ProductForm from "@/components/admin/ProductForm";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

async function getProduct(id: number) {
  return await prisma.product.findUnique({ where: { id } });
}

async function getCategories() {
  return await prisma.category.findMany({ orderBy: { name: "asc" } });
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  const [product, categories] = await Promise.all([
    getProduct(productId),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Heading>Editar producto</Heading>
      <ProductForm categories={categories} product={product} />
    </>
  );
}
