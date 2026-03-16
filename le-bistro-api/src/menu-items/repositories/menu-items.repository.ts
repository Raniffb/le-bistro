import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllActive() {
    return await this.prisma.menuItem.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAll() {
    const items = await this.prisma.menuItem.findMany({
      include: {
        recipes: {
          include: {
            ingredient: {
              include: {
                stock: true,
              },
            },
          },
          orderBy: {
            ingredient: {
              name: 'asc',
            },
          },
        },
      },
      orderBy: [{ active: 'desc' }, { name: 'asc' }],
    });

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      active: item.active,
      ingredients: item.recipes.map((recipe) => ({
        ingredientId: recipe.ingredientId,
        ingredientName: recipe.ingredient.name,
        unit: recipe.ingredient.unit,
        quantityRequired: recipe.quantityRequired,
        stockQuantity: recipe.ingredient.stock?.quantityAvailable ?? 0,
      })),
    }));
  }

  async findById(id: number) {
    return await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        recipes: {
          include: {
            ingredient: {
              include: {
                stock: true,
              },
            },
          },
        },
      },
    });
  }

  async create(
    data: Prisma.MenuItemCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return await client.menuItem.create({
      data,
    });
  }

  async update(
    id: number,
    data: Prisma.MenuItemUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return await client.menuItem.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: number, active: boolean) {
    return await this.prisma.menuItem.update({
      where: { id },
      data: { active },
    });
  }
}
