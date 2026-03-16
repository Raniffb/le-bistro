import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders.repository';

@Injectable()
export class ListKitchenOrdersUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute() {
    return await this.ordersRepository.findKitchenOrders();
  }
}
