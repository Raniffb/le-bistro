import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsRepository } from './repositories/menu-items.repository';
import { ListMenuItemsUseCase } from './use-cases/list-menu-items.use-case';
import { ListAllMenuItemsUseCase } from './use-cases/list-all-menu-items.use-case';
import { CreateMenuItemUseCase } from './use-cases/create-menu-item.use-case';
import { UpdateMenuItemStatusUseCase } from './use-cases/update-menu-item-status.use-case';
import { UpdateMenuItemUseCase } from './use-cases/update-menu-item.use-case';
import { UpdateMenuItemRecipeUseCase } from './use-cases/update-menu-item-recipe.use-case';

@Module({
  imports: [PrismaModule, IngredientsModule],
  controllers: [MenuItemsController],
  providers: [
    MenuItemsRepository,
    ListMenuItemsUseCase,
    ListAllMenuItemsUseCase,
    CreateMenuItemUseCase,
    UpdateMenuItemStatusUseCase,
    UpdateMenuItemUseCase,
    UpdateMenuItemRecipeUseCase,
  ],
})
export class MenuItemsModule {}
