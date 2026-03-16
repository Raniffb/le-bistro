import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ListOrdersQueryDto } from './dto/list-orders.query.dto';
import { CreateOrderUseCase } from './use-cases/create-order.use-case';
import { ListOrdersUseCase } from './use-cases/list-orders.use-case';
import { ListKitchenOrdersUseCase } from './use-cases/list-kitchen-orders.use-case';
import { UpdateOrderStatusUseCase } from './use-cases/update-order-status.use-case';
import { GetOrderHistoryUseCase } from './use-cases/get-order-history.use-case';
import { GetOrderByIdUseCase } from './use-cases/get-order-by-id.use-case';

@ApiTags('Orders')
@Controller('Orders')
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly listOrdersUseCase: ListOrdersUseCase,
    private readonly listKitchenOrdersUseCase: ListKitchenOrdersUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly getOrderHistoryUseCase: GetOrderHistoryUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.createOrderUseCase.execute(createOrderDto);
  }

  @Get()
  findAll(@Query() query: ListOrdersQueryDto) {
    return this.listOrdersUseCase.execute(query);
  }

  @Get('kitchen')
  findKitchenOrders() {
    return this.listKitchenOrdersUseCase.execute();
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.updateOrderStatusUseCase.execute(
      id,
      updateOrderStatusDto.status,
    );
  }

  @Get(':id/history')
  findOrderHistory(@Param('id', ParseIntPipe) id: number) {
    return this.getOrderHistoryUseCase.execute(id);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.getOrderByIdUseCase.execute(id);
  }
}
