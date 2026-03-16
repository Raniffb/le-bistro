import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RealtimeGateway } from '../../realtime/realtime.gateway';
import { UpdateMenuItemDto } from '../dto/update-menu-item.dto';
import { MenuItemsRepository } from '../repositories/menu-items.repository';

@Injectable()
export class UpdateMenuItemUseCase {
  constructor(
    private readonly menuItemsRepository: MenuItemsRepository,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async execute(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    const existingItem = await this.menuItemsRepository.findById(id);

    if (!existingItem) {
      throw new NotFoundException('Item do cardápio não encontrado');
    }

    const hasNoFieldsToUpdate =
      updateMenuItemDto.name === undefined &&
      updateMenuItemDto.price === undefined &&
      updateMenuItemDto.active === undefined;

    if (hasNoFieldsToUpdate) {
      throw new BadRequestException(
        'Informe ao menos um campo para atualização',
      );
    }

    const updatedMenuItem = await this.menuItemsRepository.update(id, {
      ...(updateMenuItemDto.name !== undefined
        ? { name: updateMenuItemDto.name }
        : {}),
      ...(updateMenuItemDto.price !== undefined
        ? { price: updateMenuItemDto.price }
        : {}),
      ...(updateMenuItemDto.active !== undefined
        ? { active: updateMenuItemDto.active }
        : {}),
    });

    this.realtimeGateway.emitMenuItemsUpdated();

    return updatedMenuItem;
  }
}
