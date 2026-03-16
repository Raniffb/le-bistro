import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersRepository } from '../repositories/orders.repository';
import { RecipesRepository } from '../repositories/recipes.repository';
import { StockRepository } from '../repositories/stock.repository';
import { OrderHistoryRepository } from '../repositories/order-history.repository';
import { CreateOrderDto } from '../dto/create-order.dto';
import { RealtimeGateway } from '../../realtime/realtime.gateway';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersRepository: OrdersRepository,
    private readonly recipesRepository: RecipesRepository,
    private readonly stockRepository: StockRepository,
    private readonly orderHistoryRepository: OrderHistoryRepository,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async execute(createOrderDto: CreateOrderDto) {
    const { tableNumber, items } = createOrderDto;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('O pedido deve possuir ao menos um item');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const order = await this.ordersRepository.createOrder(
        {
          tableNumber,
          status: 'PENDING',
          items: {
            create: items.map((item) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              notes: item.notes,
            })),
          },
        },
        tx,
      );

      await this.orderHistoryRepository.createHistory(
        {
          orderId: order.id,
          fromStatus: null,
          toStatus: 'PENDING',
        },
        tx,
      );

      const menuItemIds = items.map((item) => item.menuItemId);

      const recipes = await this.recipesRepository.findByMenuItemIds(
        menuItemIds,
        tx,
      );

      const requiredIngredients = new Map<number, number>();

      for (const item of items) {
        const itemRecipes = recipes.filter(
          (recipe) => recipe.menuItemId === item.menuItemId,
        );

        if (!itemRecipes.length) {
          await this.ordersRepository.updateStatus(
            order.id,
            'REJECTED_OUT_OF_STOCK',
            tx,
          );

          await this.orderHistoryRepository.createHistory(
            {
              orderId: order.id,
              fromStatus: 'PENDING',
              toStatus: 'REJECTED_OUT_OF_STOCK',
            },
            tx,
          );

          return {
            message: 'Pedido rejeitado por falta de receita cadastrada',
            orderId: order.id,
            status: 'REJECTED_OUT_OF_STOCK',
          };
        }

        for (const recipe of itemRecipes) {
          const current = requiredIngredients.get(recipe.ingredientId) ?? 0;
          const required = Number(recipe.quantityRequired) * item.quantity;

          requiredIngredients.set(recipe.ingredientId, current + required);
        }
      }

      const ingredientIds = Array.from(requiredIngredients.keys());

      const stockItems = await this.stockRepository.findByIngredientIds(
        ingredientIds,
        tx,
      );

      const insufficientStock: string[] = [];

      for (const stock of stockItems) {
        const required = requiredIngredients.get(stock.ingredientId) ?? 0;
        const available = Number(stock.quantityAvailable);

        if (available < required) {
          insufficientStock.push(
            `${stock.ingredient.name} (necessário: ${required}, disponível: ${available})`,
          );
        }
      }

      const missingIngredients = ingredientIds.filter(
        (ingredientId) =>
          !stockItems.some((stock) => stock.ingredientId === ingredientId),
      );

      if (missingIngredients.length > 0) {
        insufficientStock.push(
          `Ingredientes sem estoque cadastrado: ${missingIngredients.join(', ')}`,
        );
      }

      if (insufficientStock.length > 0) {
        await this.ordersRepository.updateStatus(
          order.id,
          'REJECTED_OUT_OF_STOCK',
          tx,
        );

        await this.orderHistoryRepository.createHistory(
          {
            orderId: order.id,
            fromStatus: 'PENDING',
            toStatus: 'REJECTED_OUT_OF_STOCK',
          },
          tx,
        );

        return {
          message: 'Pedido rejeitado por estoque insuficiente',
          orderId: order.id,
          status: 'REJECTED_OUT_OF_STOCK',
          details: insufficientStock,
        };
      }

      const stockToDecrement = Array.from(requiredIngredients.entries()).map(
        ([ingredientId, quantity]) => ({
          ingredientId,
          quantity,
        }),
      );

      await this.stockRepository.decrementStock(stockToDecrement, tx);

      const confirmedOrder = await this.ordersRepository.updateStatus(
        order.id,
        'CONFIRMED',
        tx,
      );

      await this.orderHistoryRepository.createHistory(
        {
          orderId: order.id,
          fromStatus: 'PENDING',
          toStatus: 'CONFIRMED',
        },
        tx,
      );

      return confirmedOrder;
    });

    this.realtimeGateway.emitOrdersUpdated();

    return result;
  }
}
