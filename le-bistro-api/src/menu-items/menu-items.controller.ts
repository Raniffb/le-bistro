import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListMenuItemsUseCase } from './use-cases/list-menu-items.use-case';
import { ListAllMenuItemsUseCase } from './use-cases/list-all-menu-items.use-case';
import { CreateMenuItemUseCase } from './use-cases/create-menu-item.use-case';
import { UpdateMenuItemStatusUseCase } from './use-cases/update-menu-item-status.use-case';
import { UpdateMenuItemUseCase } from './use-cases/update-menu-item.use-case';
import { UpdateMenuItemRecipeUseCase } from './use-cases/update-menu-item-recipe.use-case';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemStatusDto } from './dto/update-menu-item-status.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { UpdateMenuItemRecipeDto } from './dto/update-menu-item-recipe.dto';

@ApiTags('Menu-items')
@Controller('menu-items')
export class MenuItemsController {
  constructor(
    private readonly listMenuItemsUseCase: ListMenuItemsUseCase,
    private readonly listAllMenuItemsUseCase: ListAllMenuItemsUseCase,
    private readonly createMenuItemUseCase: CreateMenuItemUseCase,
    private readonly updateMenuItemStatusUseCase: UpdateMenuItemStatusUseCase,
    private readonly updateMenuItemUseCase: UpdateMenuItemUseCase,
    private readonly updateMenuItemRecipeUseCase: UpdateMenuItemRecipeUseCase,
  ) {}

  @Get()
  findAll() {
    return this.listMenuItemsUseCase.execute();
  }

  @Get('admin')
  findAllAdmin() {
    return this.listAllMenuItemsUseCase.execute();
  }

  @Post()
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.createMenuItemUseCase.execute(createMenuItemDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.updateMenuItemUseCase.execute(id, updateMenuItemDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemStatusDto: UpdateMenuItemStatusDto,
  ) {
    return this.updateMenuItemStatusUseCase.execute(
      id,
      updateMenuItemStatusDto.active,
    );
  }

  @Put(':id/recipe')
  updateRecipe(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemRecipeDto: UpdateMenuItemRecipeDto,
  ) {
    return this.updateMenuItemRecipeUseCase.execute(
      id,
      updateMenuItemRecipeDto,
    );
  }
}
