import { prisma } from "@/src/lib/prisma";
import Heading from "@/components/ui/Heading";
import ProductForm from "@/components/admin/ProductForm";

async function getCategories() {
  return await prisma.category.findMany({ orderBy: { name: "asc" } });
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <>
      <Heading>Nuevo producto</Heading>
      <ProductForm categories={categories} />
    </>
  );
}
