import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RealtimeGateway } from '../../realtime/realtime.gateway';
import { OrdersRepository } from '../repositories/orders.repository';
import { OrderHistoryRepository } from '../repositories/order-history.repository';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersRepository: OrdersRepository,
    private readonly orderHistoryRepository: OrderHistoryRepository,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  private readonly allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ['CONFIRMED'],
    CONFIRMED: ['IN_PREPARATION'],
    IN_PREPARATION: ['READY'],
    READY: ['DELIVERED'],
    DELIVERED: [],
    REJECTED_OUT_OF_STOCK: [],
  };

  async execute(id: number, status: OrderStatus) {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    const allowedNextStatuses = this.allowedTransitions[order.status] ?? [];

    if (!allowedNextStatuses.includes(status)) {
      throw new BadRequestException({
        message: 'Transição de status inválida',
        currentStatus: order.status,
        attemptedStatus: status,
        allowedNextStatuses,
      });
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedOrder = await this.ordersRepository.updateStatus(
        id,
        status,
        tx,
      );

      await this.orderHistoryRepository.createHistory(
        {
          orderId: id,
          fromStatus: order.status,
          toStatus: status,
        },
        tx,
      );

      return updatedOrder;
    });

    this.realtimeGateway.emitOrdersUpdated();

    return result;
  }
}
