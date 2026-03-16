import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateIngredientStockDto } from '../dto/update-ingredient-stock.dto';
import { IngredientsRepository } from '../repositories/ingredients.repository';

@Injectable()
export class UpdateIngredientStockUseCase {
  constructor(private readonly ingredientsRepository: IngredientsRepository) {}

  async execute(
    id: number,
    updateIngredientStockDto: UpdateIngredientStockDto,
  ) {
    const ingredient = await this.ingredientsRepository.findById(id);

    if (!ingredient) {
      throw new NotFoundException('Ingrediente não encontrado');
    }

    await this.ingredientsRepository.upsertStock(
      id,
      updateIngredientStockDto.stockQuantity,
    );

    return this.ingredientsRepository.findById(id);
  }
}
