import { Injectable } from '@angular/core';
import { CreateOrderPayload } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderDraftService {
  private draft: CreateOrderPayload = {
    tableNumber: 1,
    items: [],
  };

  getDraft(): CreateOrderPayload {
    return {
      tableNumber: this.draft.tableNumber,
      items: this.draft.items.map((item) => ({ ...item })),
    };
  }

  setDraft(draft: CreateOrderPayload): void {
    this.draft = {
      tableNumber: draft.tableNumber,
      items: draft.items.map((item) => ({ ...item })),
    };
  }

  clearDraft(): void {
    this.draft = {
      tableNumber: 1,
      items: [],
    };
  }

  addMenuItem(menuItemId: number): void {
    const existingItem = this.draft.items.find((item) => item.menuItemId === menuItemId);

    if (existingItem) {
      existingItem.quantity += 1;
      return;
    }

    this.draft.items.push({
      menuItemId,
      quantity: 1,
      notes: '',
    });
  }
}
