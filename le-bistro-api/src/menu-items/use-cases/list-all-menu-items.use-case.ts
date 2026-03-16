import { Injectable } from '@nestjs/common';
import { MenuItemsRepository } from '../repositories/menu-items.repository';

@Injectable()
export class ListAllMenuItemsUseCase {
  constructor(private readonly menuItemsRepository: MenuItemsRepository) {}

  execute() {
    return this.menuItemsRepository.findAll();
  }
}
