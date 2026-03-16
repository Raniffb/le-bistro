import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IngredientsController } from './ingredients.controller';
import { IngredientsRepository } from './repositories/ingredients.repository';
import { CreateIngredientUseCase } from './use-cases/create-ingredient.use-case';
import { ListIngredientsUseCase } from './use-cases/list-ingredients.use-case';
import { UpdateIngredientUseCase } from './use-cases/update-ingredient.use-case';
import { UpdateIngredientStockUseCase } from './use-cases/update-ingredient-stock.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [IngredientsController],
  providers: [
    IngredientsRepository,
    ListIngredientsUseCase,
    CreateIngredientUseCase,
    UpdateIngredientUseCase,
    UpdateIngredientStockUseCase,
  ],
  exports: [IngredientsRepository],
})
export class IngredientsModule {}
