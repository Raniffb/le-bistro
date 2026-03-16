import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrderHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createHistory(
    data: {
      orderId: number;
      fromStatus?: OrderStatus | null;
      toStatus: OrderStatus;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return await client.orderHistory.create({
      data: {
        orderId: data.orderId,
        fromStatus: data.fromStatus ?? null,
        toStatus: data.toStatus,
      },
    });
  }

  async findByOrderId(orderId: number) {
    return await this.prisma.orderHistory.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
