
import { prisma } from '@/src/lib/prisma'
import CategoryIcon from '@/components/ui/Categoryicon'


async function getCategories() {
    return await prisma.category.findMany();

}

export default async function OrderSidebar() {

    const categories = await getCategories()

    return (
        <aside className="md:w-72 md:h-screen bg-white">
            {categories.map((category) => (
                <CategoryIcon key={category.id} category={category} />
            ))}
        </aside>

    )
}