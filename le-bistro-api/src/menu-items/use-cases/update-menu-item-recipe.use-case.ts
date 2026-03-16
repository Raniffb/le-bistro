import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RealtimeGateway } from '../../realtime/realtime.gateway';
import { IngredientsRepository } from '../../ingredients/repositories/ingredients.repository';
import { UpdateMenuItemRecipeDto } from '../dto/update-menu-item-recipe.dto';
import { MenuItemsRepository } from '../repositories/menu-items.repository';

@Injectable()
export class UpdateMenuItemRecipeUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly menuItemsRepository: MenuItemsRepository,
    private readonly ingredientsRepository: IngredientsRepository,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async execute(id: number, updateMenuItemRecipeDto: UpdateMenuItemRecipeDto) {
    const menuItem = await this.menuItemsRepository.findById(id);

    if (!menuItem) {
      throw new NotFoundException('Item do cardápio não encontrado');
    }

    const ingredientIds = updateMenuItemRecipeDto.ingredients.map(
      (item) => item.ingredientId,
    );

    const uniqueIngredientIds = new Set(ingredientIds);

    if (uniqueIngredientIds.size !== ingredientIds.length) {
      throw new BadRequestException(
        'A receita não pode conter ingredientes repetidos',
      );
    }

    const allIngredients = await this.ingredientsRepository.findAll();
    const existingIngredientIds = new Set(
      allIngredients.map((item) => item.id),
    );

    const invalidIngredientIds = ingredientIds.filter(
      (ingredientId) => !existingIngredientIds.has(ingredientId),
    );

    if (invalidIngredientIds.length > 0) {
      throw new BadRequestException({
        message: 'Existem ingredientes inválidos na receita',
        invalidIngredientIds,
      });
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.recipe.deleteMany({
        where: {
          menuItemId: id,
        },
      });

      await tx.recipe.createMany({
        data: updateMenuItemRecipeDto.ingredients.map((item) => ({
          menuItemId: id,
          ingredientId: item.ingredientId,
          quantityRequired: item.quantityRequired,
        })),
      });
    });

    this.realtimeGateway.emitMenuItemsUpdated();

    return this.menuItemsRepository.findById(id);
  }
}
