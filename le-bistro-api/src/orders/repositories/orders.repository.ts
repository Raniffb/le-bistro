import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ListOrdersQueryDto } from '../dto/list-orders.query.dto';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(
    data: Prisma.OrderCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return await client.order.create({
      data,
      include: {
        items: true,
      },
    });
  }

  async findKitchenOrders() {
    return await this.prisma.order.findMany({
      where: {
        status: {
          in: ['CONFIRMED', 'IN_PREPARATION', 'READY'],
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findAllWithFilters(query: ListOrdersQueryDto) {
    const where: Prisma.OrderWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.tableNumber) {
      where.tableNumber = query.tableNumber;
    }

    const createdAtFilter: Prisma.DateTimeFilter = {};

    if (query.startDate) {
      createdAtFilter.gte = new Date(`${query.startDate}T00:00:00.000Z`);
    }

    if (query.endDate) {
      createdAtFilter.lte = new Date(`${query.endDate}T23:59:59.999Z`);
    }

    if (query.startDate || query.endDate) {
      where.createdAt = createdAtFilter;
    }

    const orders = await this.prisma.order.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      tableNumber: order.tableNumber,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      itemsCount: order._count.items,
    }));
  }

  async findById(id: number) {
    return await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  }

  async updateStatus(
    id: number,
    status: OrderStatus,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return await client.order.update({
      where: { id },
      data: { status },
    });
  }

  async findDetailedById(id: number) {
    return await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        history: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }
}
