import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { IngredientsRepository } from '../repositories/ingredients.repository';

@Injectable()
export class CreateIngredientUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ingredientsRepository: IngredientsRepository,
  ) {}

  async execute(createIngredientDto: CreateIngredientDto) {
    return await this.prisma.$transaction(async (tx) => {
      const ingredient = await this.ingredientsRepository.create(
        {
          name: createIngredientDto.name,
          unit: createIngredientDto.unit,
        },
        tx,
      );

      await this.ingredientsRepository.upsertStock(
        ingredient.id,
        createIngredientDto.stockQuantity ?? 0,
        tx,
      );

      return this.ingredientsRepository.findById(ingredient.id);
    });
  }
}
