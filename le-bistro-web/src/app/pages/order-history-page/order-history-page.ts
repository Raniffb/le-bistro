import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BackButtonComponent } from '../../components/back-button/back-button';
import { OrdersService } from '../../services/orders.service';
import { RealtimeService } from '../../services/realtime.service';
import { OrderDetails, OrderHistoryEntry, OrderSummary } from '../../models/order.model';

@Component({
  selector: 'app-order-history-page',
  imports: [CommonModule, FormsModule, BackButtonComponent],
  templateUrl: './order-history-page.html',
  styleUrl: './order-history-page.scss',
})
export class OrderHistoryPageComponent implements OnInit, OnDestroy {
  private readonly ordersService = inject(OrdersService);
  private readonly realtimeService = inject(RealtimeService);

  private realtimeSubscription?: Subscription;

  orders: OrderSummary[] = [];
  selectedOrder: OrderDetails | null = null;

  loadingOrders = false;
  loadingSelectedOrder = false;
  error = '';

  filters = {
    status: '',
    tableNumber: null as number | null,
    startDate: '',
    endDate: '',
  };

  ngOnInit(): void {
    this.loadOrders();
    this.listenRealtimeUpdates();
  }

  ngOnDestroy(): void {
    this.realtimeSubscription?.unsubscribe();
  }

  listenRealtimeUpdates(): void {
    this.realtimeSubscription = this.realtimeService.onOrdersUpdated().subscribe(() => {
      if (!this.loadingOrders) {
        this.loadOrders(false);
      }

      if (this.selectedOrder && !this.loadingSelectedOrder) {
        this.reloadSelectedOrder(this.selectedOrder.id);
      }
    });
  }

  loadOrders(showLoader = true): void {
    if (showLoader) {
      this.loadingOrders = true;
    }

    this.error = '';

    this.ordersService
      .getOrders({
        status: this.filters.status || undefined,
        tableNumber: this.filters.tableNumber,
        startDate: this.filters.startDate || undefined,
        endDate: this.filters.endDate || undefined,
      })
      .subscribe({
        next: (response) => {
          this.orders = response;

          if (showLoader) {
            this.loadingOrders = false;
          }
        },
        error: () => {
          this.error = 'Erro ao carregar pedidos';

          if (showLoader) {
            this.loadingOrders = false;
          }
        },
      });
  }

  clearFilters(): void {
    this.filters = {
      status: '',
      tableNumber: null,
      startDate: '',
      endDate: '',
    };

    this.loadOrders();
    this.selectedOrder = null;
  }

  selectOrder(orderId: number): void {
    this.loadingSelectedOrder = true;
    this.error = '';

    this.ordersService.getOrderById(orderId).subscribe({
      next: (response) => {
        this.selectedOrder = response;
        this.loadingSelectedOrder = false;
      },
      error: () => {
        this.error = 'Erro ao carregar detalhes do pedido';
        this.loadingSelectedOrder = false;
      },
    });
  }

  reloadSelectedOrder(orderId: number): void {
    this.ordersService.getOrderById(orderId).subscribe({
      next: (response) => {
        this.selectedOrder = response;
      },
      error: () => {
        this.error = 'Erro ao atualizar detalhes do pedido';
      },
    });
  }

  getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      PENDING: 'Pendente',
      CONFIRMED: 'Confirmado',
      IN_PREPARATION: 'Em preparo',
      READY: 'Pronto',
      DELIVERED: 'Entregue',
      REJECTED_OUT_OF_STOCK: 'Sem estoque',
    };

    return statusMap[status] ?? status;
  }

  getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      PENDING: 'status-pending',
      CONFIRMED: 'status-confirmed',
      IN_PREPARATION: 'status-in-preparation',
      READY: 'status-ready',
      DELIVERED: 'status-delivered',
      REJECTED_OUT_OF_STOCK: 'status-rejected',
    };

    return classMap[status] ?? 'status-default';
  }

  getPreviousStatus(entry: OrderHistoryEntry): string {
    const value = entry.previousStatus ?? entry.fromStatus ?? null;
    return value ? this.getStatusLabel(String(value)) : 'Inicial';
  }

  getCurrentStatus(entry: OrderHistoryEntry): string {
    const value = entry.newStatus ?? entry.toStatus ?? null;
    return value ? this.getStatusLabel(String(value)) : 'Não informado';
  }

  getHistoryDate(entry: OrderHistoryEntry): string | null {
    const value = entry.changedAt ?? entry.createdAt ?? entry.updatedAt ?? null;
    return value ? String(value) : null;
  }

  formatPrice(price: string): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(price));
  }

  trackByOrderId(index: number, order: OrderSummary): number {
    return order.id;
  }

  trackByHistory(index: number, entry: OrderHistoryEntry): number | string {
    return entry.id ?? `${index}-${this.getHistoryDate(entry) ?? 'history'}`;
  }
}
