import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders.repository';
import { ListOrdersQueryDto } from '../dto/list-orders.query.dto';

@Injectable()
export class ListOrdersUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  execute(query: ListOrdersQueryDto) {
    return this.ordersRepository.findAllWithFilters(query);
  }
}
