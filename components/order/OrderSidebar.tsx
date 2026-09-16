
import { prisma } from '@/src/lib/prisma'
import CategoryIcon from '@/components/ui/Categoryicon'
import Logo from '../ui/Logo';
import TableSessionControls from './TableSessionControls';
import type { getCurrentTableSession } from '@/actions/table-session-actions';


async function getCategories() {
    return await prisma.category.findMany();

}

type OrderSidebarProps = {
    tableSession: NonNullable<Awaited<ReturnType<typeof getCurrentTableSession>>>;
};

export default async function OrderSidebar({ tableSession }: OrderSidebarProps) {

    const categories = await getCategories()

    return (
        <aside className="md:w-72 md:h-screen bg-white">
            <Logo />
            <TableSessionControls
                tableNumber={tableSession.tableNumber}
                orders={tableSession.orders}
            />
            {categories.map((category) => (
                <CategoryIcon key={category.id} category={category} />
            ))}
        </aside>

    )
}