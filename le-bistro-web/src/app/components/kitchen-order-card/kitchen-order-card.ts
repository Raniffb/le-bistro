import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KitchenOrder } from '../../models/order.model';

@Component({
  selector: 'app-kitchen-order-card',
  imports: [CommonModule],
  templateUrl: './kitchen-order-card.html',
  styleUrl: './kitchen-order-card.scss',
})
export class KitchenOrderCardComponent {
  @Input({ required: true }) order!: KitchenOrder;
  @Input() isUpdating = false;

  @Output() advanceStatus = new EventEmitter<number>();

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
      CONFIRMED: 'status-confirmed',
      IN_PREPARATION: 'status-in-preparation',
      READY: 'status-ready',
      DELIVERED: 'status-delivered',
      PENDING: 'status-pending',
      REJECTED_OUT_OF_STOCK: 'status-rejected',
    };

    return classMap[status] ?? 'status-default';
  }

  getNextActionLabel(status: string): string {
    const actionMap: Record<string, string> = {
      CONFIRMED: 'Iniciar preparo',
      IN_PREPARATION: 'Marcar como pronto',
      READY: 'Marcar como entregue',
    };

    return actionMap[status] ?? '';
  }

  canAdvanceStatus(status: string): boolean {
    return ['CONFIRMED', 'IN_PREPARATION', 'READY'].includes(status);
  }

  onAdvanceStatus(): void {
    if (this.isUpdating) {
      return;
    }

    this.advanceStatus.emit(this.order.id);
  }
}
