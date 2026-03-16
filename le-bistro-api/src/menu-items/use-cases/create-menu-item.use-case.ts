import { Injectable } from '@nestjs/common';
import { RealtimeGateway } from '../../realtime/realtime.gateway';
import { CreateMenuItemDto } from '../dto/create-menu-item.dto';
import { MenuItemsRepository } from '../repositories/menu-items.repository';

@Injectable()
export class CreateMenuItemUseCase {
  constructor(
    private readonly menuItemsRepository: MenuItemsRepository,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async execute(createMenuItemDto: CreateMenuItemDto) {
    const menuItem = await this.menuItemsRepository.create({
      name: createMenuItemDto.name,
      price: createMenuItemDto.price,
      active: createMenuItemDto.active ?? true,
    });

    this.realtimeGateway.emitMenuItemsUpdated();

    return menuItem;
  }
}
