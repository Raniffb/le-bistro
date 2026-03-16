import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StockRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByIngredientIds(
    ingredientIds: number[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return await client.stock.findMany({
      where: {
        ingredientId: {
          in: ingredientIds,
        },
      },
      include: {
        ingredient: true,
      },
    });
  }

  async decrementStock(
    items: { ingredientId: number; quantity: number }[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    for (const item of items) {
      await client.stock.update({
        where: {
          ingredientId: item.ingredientId,
        },
        data: {
          quantityAvailable: {
            decrement: item.quantity,
          },
        },
      });
    }
  }
}
