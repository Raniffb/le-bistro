import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpa dados dependentes para evitar conflito de FK
  await prisma.orderHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.menuItem.deleteMany();

  console.log('🧹 Tabelas limpas.');

  // Menu items
  await prisma.menuItem.createMany({
    data: [
      {
        name: 'Risoto de Cogumelos',
        price: new Prisma.Decimal('42.90'),
        active: true,
      },
      {
        name: 'Filé ao Molho Madeira',
        price: new Prisma.Decimal('58.50'),
        active: true,
      },
      {
        name: 'Salmão Grelhado',
        price: new Prisma.Decimal('61.00'),
        active: true,
      },
      {
        name: 'Penne ao Pesto',
        price: new Prisma.Decimal('36.90'),
        active: true,
      },
    ],
  });

  console.log('🍽️ Menu items inseridos.');

  // Ingredients
  await prisma.ingredient.createMany({
    data: [
      { name: 'Arroz Arbóreo', unit: 'porção' },
      { name: 'Cogumelo', unit: 'porção' },
      { name: 'Creme de Leite', unit: 'porção' },
      { name: 'Filé Mignon', unit: 'porção' },
      { name: 'Molho Madeira', unit: 'porção' },
      { name: 'Manteiga', unit: 'porção' },
      { name: 'Salmão', unit: 'porção' },
      { name: 'Limão', unit: 'porção' },
      { name: 'Penne', unit: 'porção' },
      { name: 'Pesto', unit: 'porção' },
    ],
  });

  console.log('🥬 Ingredientes inseridos.');

  const menuItems = await prisma.menuItem.findMany();
  const ingredients = await prisma.ingredient.findMany();

  const menuItemMap = Object.fromEntries(
    menuItems.map((item) => [item.name, item.id]),
  );

  const ingredientMap = Object.fromEntries(
    ingredients.map((ingredient) => [ingredient.name, ingredient.id]),
  );

  // Stock
  await prisma.stock.createMany({
    data: [
      {
        ingredientId: ingredientMap['Arroz Arbóreo'],
        quantityAvailable: 10,
      },
      {
        ingredientId: ingredientMap['Cogumelo'],
        quantityAvailable: 8,
      },
      {
        ingredientId: ingredientMap['Creme de Leite'],
        quantityAvailable: 6,
      },
      {
        ingredientId: ingredientMap['Filé Mignon'],
        quantityAvailable: 12,
      },
      {
        ingredientId: ingredientMap['Molho Madeira'],
        quantityAvailable: 5,
      },
      {
        ingredientId: ingredientMap['Manteiga'],
        quantityAvailable: 4,
      },
      {
        ingredientId: ingredientMap['Salmão'],
        quantityAvailable: 7,
      },
      {
        ingredientId: ingredientMap['Limão'],
        quantityAvailable: 2,
      },
      {
        ingredientId: ingredientMap['Penne'],
        quantityAvailable: 9,
      },
      {
        ingredientId: ingredientMap['Pesto'],
        quantityAvailable: 2,
      },
    ],
  });

  console.log('📦 Estoque inserido.');

  // Recipes
  await prisma.recipe.createMany({
    data: [
      // Risoto de Cogumelos
      {
        menuItemId: menuItemMap['Risoto de Cogumelos'],
        ingredientId: ingredientMap['Arroz Arbóreo'],
        quantityRequired: 3,
      },
      {
        menuItemId: menuItemMap['Risoto de Cogumelos'],
        ingredientId: ingredientMap['Cogumelo'],
        quantityRequired: 2,
      },
      {
        menuItemId: menuItemMap['Risoto de Cogumelos'],
        ingredientId: ingredientMap['Creme de Leite'],
        quantityRequired: 1,
      },

      // Filé ao Molho Madeira
      {
        menuItemId: menuItemMap['Filé ao Molho Madeira'],
        ingredientId: ingredientMap['Filé Mignon'],
        quantityRequired: 3,
      },
      {
        menuItemId: menuItemMap['Filé ao Molho Madeira'],
        ingredientId: ingredientMap['Molho Madeira'],
        quantityRequired: 1,
      },
      {
        menuItemId: menuItemMap['Filé ao Molho Madeira'],
        ingredientId: ingredientMap['Manteiga'],
        quantityRequired: 1,
      },

      // Salmão Grelhado
      {
        menuItemId: menuItemMap['Salmão Grelhado'],
        ingredientId: ingredientMap['Salmão'],
        quantityRequired: 3,
      },
      {
        menuItemId: menuItemMap['Salmão Grelhado'],
        ingredientId: ingredientMap['Limão'],
        quantityRequired: 1,
      },
      {
        menuItemId: menuItemMap['Salmão Grelhado'],
        ingredientId: ingredientMap['Manteiga'],
        quantityRequired: 1,
      },

      // Penne ao Pesto
      {
        menuItemId: menuItemMap['Penne ao Pesto'],
        ingredientId: ingredientMap['Penne'],
        quantityRequired: 2,
      },
      {
        menuItemId: menuItemMap['Penne ao Pesto'],
        ingredientId: ingredientMap['Pesto'],
        quantityRequired: 1,
      },
    ],
  });

  console.log('📖 Receitas inseridas.');
  console.log('✅ Seed finalizada com sucesso.');
}

main()
  .catch((error) => {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
