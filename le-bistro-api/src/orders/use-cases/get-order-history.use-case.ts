import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders.repository';
import { OrderHistoryRepository } from '../repositories/order-history.repository';

@Injectable()
export class GetOrderHistoryUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderHistoryRepository: OrderHistoryRepository,
  ) {}

  async execute(orderId: number) {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return await this.orderHistoryRepository.findByOrderId(orderId);
  }
}
