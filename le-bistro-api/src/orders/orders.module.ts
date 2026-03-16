import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './repositories/orders.repository';
import { RecipesRepository } from './repositories/recipes.repository';
import { StockRepository } from './repositories/stock.repository';
import { OrderHistoryRepository } from './repositories/order-history.repository';
import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { ListOrdersUseCase } from './use-cases/list-orders.use-case';
import { ListKitchenOrdersUseCase } from './use-cases/list-kitchen-orders.use-case';
import { UpdateOrderStatusUseCase } from './use-cases/update-order-status.use-case';
import { GetOrderHistoryUseCase } from './use-cases/get-order-history.use-case';
import { GetOrderByIdUseCase } from './use-cases/get-order-by-id.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [OrdersController],
  providers: [
    OrdersRepository,
    RecipesRepository,
    StockRepository,
    OrderHistoryRepository,
    CreateOrderUseCase,
    ListOrdersUseCase,
    ListKitchenOrdersUseCase,
    UpdateOrderStatusUseCase,
    GetOrderHistoryUseCase,
    GetOrderByIdUseCase,
  ],
})
export class OrdersModule {}
