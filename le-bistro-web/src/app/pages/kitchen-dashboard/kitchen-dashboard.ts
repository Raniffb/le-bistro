import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { OrdersService } from '../../services/orders.service';
import { RealtimeService } from '../../services/realtime.service';
import { KitchenOrder } from '../../models/order.model';
import { KitchenOrderCardComponent } from '../../components/kitchen-order-card/kitchen-order-card';
import { BackButtonComponent } from '../../components/back-button/back-button';

type KitchenStatusFilter = 'ALL' | 'CONFIRMED' | 'IN_PREPARATION' | 'READY';

@Component({
  selector: 'app-kitchen-dashboard',
  imports: [CommonModule, KitchenOrderCardComponent, BackButtonComponent],
  templateUrl: './kitchen-dashboard.html',
  styleUrl: './kitchen-dashboard.scss',
})
export class KitchenDashboardComponent implements OnInit, OnDestroy {
  private readonly ordersService = inject(OrdersService);
  private readonly realtimeService = inject(RealtimeService);

  private realtimeSubscription?: Subscription;

  orders: KitchenOrder[] = [];
  loading = false;
  error = '';
  updatingOrderId: number | null = null;
  statusFilter: KitchenStatusFilter = 'ALL';

  summary = {
    confirmed: 0,
    inPreparation: 0,
    ready: 0,
  };

  ngOnInit(): void {
    this.loadKitchenOrders();
    this.listenRealtimeUpdates();
  }

  ngOnDestroy(): void {
    this.realtimeSubscription?.unsubscribe();
  }

  get filteredOrders(): KitchenOrder[] {
    if (this.statusFilter === 'ALL') {
      return this.orders;
    }

    return this.orders.filter((order) => order.status === this.statusFilter);
  }

  loadKitchenOrders(showLoader = true): void {
    if (showLoader) {
      this.loading = true;
    }

    this.error = '';

    this.ordersService.getKitchenOrders().subscribe({
      next: (response) => {
        this.orders = response;
        this.updateSummary(response);

        if (showLoader) {
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'Erro ao carregar pedidos da cozinha';

        if (showLoader) {
          this.loading = false;
        }
      },
    });
  }

  listenRealtimeUpdates(): void {
    this.realtimeSubscription = this.realtimeService.onOrdersUpdated().subscribe(() => {
      if (this.loading) {
        return;
      }

      this.loadKitchenOrders(false);
    });
  }

  handleAdvanceStatus(orderId: number): void {
    const order = this.orders.find((item) => item.id === orderId);

    if (!order) {
      return;
    }

    const nextStatus = this.getNextStatus(order.status);

    if (!nextStatus) {
      return;
    }

    this.updatingOrderId = orderId;
    this.error = '';

    this.ordersService.updateOrderStatus(orderId, nextStatus).subscribe({
      next: () => {
        this.updatingOrderId = null;
        this.loadKitchenOrders(false);
      },
      error: () => {
        this.error = 'Erro ao atualizar status do pedido';
        this.updatingOrderId = null;
      },
    });
  }

  getNextStatus(currentStatus: string): string | null {
    const nextStatusMap: Record<string, string> = {
      CONFIRMED: 'IN_PREPARATION',
      IN_PREPARATION: 'READY',
      READY: 'DELIVERED',
    };

    return nextStatusMap[currentStatus] ?? null;
  }

  updateSummary(orders: KitchenOrder[]): void {
    this.summary = {
      confirmed: orders.filter((order) => order.status === 'CONFIRMED').length,
      inPreparation: orders.filter((order) => order.status === 'IN_PREPARATION').length,
      ready: orders.filter((order) => order.status === 'READY').length,
    };
  }

  setStatusFilter(filter: KitchenStatusFilter): void {
    this.statusFilter = filter;
  }

  isActiveFilter(filter: KitchenStatusFilter): boolean {
    return this.statusFilter === filter;
  }

  trackByOrderId(index: number, order: KitchenOrder): number {
    return order.id;
  }
}
