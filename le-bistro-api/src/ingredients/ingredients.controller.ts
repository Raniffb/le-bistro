import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { UpdateIngredientStockDto } from './dto/update-ingredient-stock.dto';
import { CreateIngredientUseCase } from './use-cases/create-ingredient.use-case';
import { ListIngredientsUseCase } from './use-cases/list-ingredients.use-case';
import { UpdateIngredientUseCase } from './use-cases/update-ingredient.use-case';
import { UpdateIngredientStockUseCase } from './use-cases/update-ingredient-stock.use-case';

@ApiTags('Ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(
    private readonly listIngredientsUseCase: ListIngredientsUseCase,
    private readonly createIngredientUseCase: CreateIngredientUseCase,
    private readonly updateIngredientUseCase: UpdateIngredientUseCase,
    private readonly updateIngredientStockUseCase: UpdateIngredientStockUseCase,
  ) {}

  @Get()
  findAll() {
    return this.listIngredientsUseCase.execute();
  }

  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.createIngredientUseCase.execute(createIngredientDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.updateIngredientUseCase.execute(id, updateIngredientDto);
  }

  @Patch(':id/stock')
  updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIngredientStockDto: UpdateIngredientStockDto,
  ) {
    return this.updateIngredientStockUseCase.execute(
      id,
      updateIngredientStockDto,
    );
  }
}
