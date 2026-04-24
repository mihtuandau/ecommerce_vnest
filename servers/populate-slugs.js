
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('Starting slug population...');

  // Update Categories
  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    const slug = slugify(cat.name);
    await prisma.category.update({
      where: { id: cat.id },
      data: { slug }
    });
    console.log(`Updated Category: ${cat.name} -> ${slug}`);
  }

  // Update Products
  const products = await prisma.product.findMany();
  for (const prod of products) {
    const slug = slugify(prod.name);
    await prisma.product.update({
      where: { id: prod.id },
      data: { slug }
    });
    console.log(`Updated Product: ${prod.name} -> ${slug}`);
  }

  console.log('Finished slug population.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
