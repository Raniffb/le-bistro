import { Injectable } from '@nestjs/common';
import { MenuItemsRepository } from '../repositories/menu-items.repository';

@Injectable()
export class ListMenuItemsUseCase {
  constructor(private readonly menuItemsRepository: MenuItemsRepository) {}

  async execute() {
    return await this.menuItemsRepository.findAllActive();
  }
}
