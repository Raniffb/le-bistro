import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders.repository';

@Injectable()
export class GetOrderByIdUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute(id: number) {
    const order = await this.ordersRepository.findDetailedById(id);

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }
}
