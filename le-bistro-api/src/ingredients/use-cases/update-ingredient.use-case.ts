import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';
import { IngredientsRepository } from '../repositories/ingredients.repository';

@Injectable()
export class UpdateIngredientUseCase {
  constructor(private readonly ingredientsRepository: IngredientsRepository) {}

  async execute(id: number, updateIngredientDto: UpdateIngredientDto) {
    const ingredient = await this.ingredientsRepository.findById(id);

    if (!ingredient) {
      throw new NotFoundException('Ingrediente não encontrado');
    }

    if (
      updateIngredientDto.name === undefined &&
      updateIngredientDto.unit === undefined
    ) {
      throw new BadRequestException(
        'Informe ao menos um campo para atualização',
      );
    }

    return await this.ingredientsRepository.update(id, {
      ...(updateIngredientDto.name !== undefined
        ? { name: updateIngredientDto.name }
        : {}),
      ...(updateIngredientDto.unit !== undefined
        ? { unit: updateIngredientDto.unit }
        : {}),
    });
  }
}
