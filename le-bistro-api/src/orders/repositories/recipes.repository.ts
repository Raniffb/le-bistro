import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecipesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByMenuItemIds(
    menuItemIds: number[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return await client.recipe.findMany({
      where: {
        menuItemId: {
          in: menuItemIds,
        },
      },
      include: {
        ingredient: true,
        menuItem: true,
      },
    });
  }
}
