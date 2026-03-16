import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type PrismaExecutor = PrismaService | Prisma.TransactionClient;

@Injectable()
export class IngredientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const ingredients = await this.prisma.ingredient.findMany({
      include: {
        stock: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return ingredients.map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      unit: ingredient.unit,
      stockQuantity: ingredient.stock?.quantityAvailable ?? 0,
    }));
  }

  async findById(id: number) {
    return await this.prisma.ingredient.findUnique({
      where: { id },
      include: {
        stock: true,
      },
    });
  }

  async create(
    data: Prisma.IngredientCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client: PrismaExecutor = tx ?? this.prisma;

    return await client.ingredient.create({
      data,
    });
  }

  async update(
    id: number,
    data: Prisma.IngredientUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client: PrismaExecutor = tx ?? this.prisma;

    return await client.ingredient.update({
      where: { id },
      data,
    });
  }

  async upsertStock(
    ingredientId: number,
    quantityAvailable: number,
    tx?: Prisma.TransactionClient,
  ) {
    const client: PrismaExecutor = tx ?? this.prisma;

    return await client.stock.upsert({
      where: {
        ingredientId,
      },
      update: {
        quantityAvailable,
      },
      create: {
        ingredientId,
        quantityAvailable,
      },
    });
  }
}
