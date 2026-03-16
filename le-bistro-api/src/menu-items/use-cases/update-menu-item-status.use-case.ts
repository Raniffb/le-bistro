import { Injectable, NotFoundException } from '@nestjs/common';
import { RealtimeGateway } from '../../realtime/realtime.gateway';
import { MenuItemsRepository } from '../repositories/menu-items.repository';

@Injectable()
export class UpdateMenuItemStatusUseCase {
  constructor(
    private readonly menuItemsRepository: MenuItemsRepository,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async execute(id: number, active: boolean) {
    const menuItems = await this.menuItemsRepository.findAll();
    const existingItem = menuItems.find((item) => item.id === id);

    if (!existingItem) {
      throw new NotFoundException('Item do cardápio não encontrado');
    }

    const menuItem = await this.menuItemsRepository.updateStatus(id, active);

    this.realtimeGateway.emitMenuItemsUpdated();

    return menuItem;
  }
}
