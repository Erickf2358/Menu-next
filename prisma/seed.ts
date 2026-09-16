import { categories } from './data/categories'
import { products } from './data/products'
import { prisma } from '@/src/lib/prisma'

function slugify(name: string) {
    return name
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

async function main() {
    try{
        await prisma.product.deleteMany()
        await prisma.category.deleteMany()
        await prisma.$executeRawUnsafe('ALTER SEQUENCE "Category_id_seq" RESTART WITH 1')
        await prisma.$executeRawUnsafe('ALTER SEQUENCE "Product_id_seq" RESTART WITH 1')

        await prisma.category.createMany({
            data: categories
        })
        await prisma.product.createMany({
            data: products.map((product) => ({
                ...product,
                slug: slugify(product.name),
            }))
        })
        console.log('Seeded successfully')

    } catch (error){
    console.log(error)
    }
}

main()
    .then( async () => {
        await prisma.$disconnect();
        process.exit(0)
    })
    .catch(async (e)=> {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })