import { Injectable } from '@nestjs/common';
import { IngredientsRepository } from '../repositories/ingredients.repository';

@Injectable()
export class ListIngredientsUseCase {
  constructor(private readonly ingredientsRepository: IngredientsRepository) {}

  execute() {
    return this.ingredientsRepository.findAll();
  }
}
