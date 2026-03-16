import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BackButtonComponent } from '../../components/back-button/back-button';
import { CreateOrderPayload, CreateOrderResponse, MenuItem } from '../../models/order.model';
import { MenuItemsService } from '../../services/menu-items.service';
import { OrdersService } from '../../services/orders.service';
import { OrderDraftService } from '../../services/order-draft.service';

@Component({
  selector: 'app-new-order-page',
  imports: [CommonModule, ReactiveFormsModule, BackButtonComponent],
  templateUrl: './new-order-page.html',
  styleUrl: './new-order-page.scss',
})
export class NewOrderPageComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly menuItemsService = inject(MenuItemsService);
  private readonly ordersService = inject(OrdersService);
  private readonly orderDraftService = inject(OrderDraftService);

  private formSubscription?: Subscription;

  menuItems: MenuItem[] = [];
  loadingMenuItems = false;
  saving = false;
  error = '';
  success = '';

  stockWarningMessage = '';
  stockWarningDetails: string[] = [];
  rejectedOrderId: number | null = null;

  form = this.fb.group({
    tableNumber: [1, [Validators.required, Validators.min(1)]],
    items: this.fb.array([this.createItemGroup()]),
  });

  ngOnInit(): void {
    this.loadDraftIntoForm();

    this.formSubscription = this.form.valueChanges.subscribe(() => {
      this.persistDraft();
    });

    this.loadMenuItems();
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

  get itemsFormArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get activeMenuItems(): MenuItem[] {
    return this.menuItems.filter((item) => item.active);
  }

  createItemGroup(item?: { menuItemId?: number | null; quantity?: number; notes?: string }) {
    return this.fb.group({
      menuItemId: [item?.menuItemId ?? null, [Validators.required]],
      quantity: [item?.quantity ?? 1, [Validators.required, Validators.min(1)]],
      notes: [item?.notes ?? ''],
    });
  }

  loadDraftIntoForm(): void {
    const draft = this.orderDraftService.getDraft();

    const controls =
      draft.items.length > 0
        ? draft.items.map((item) => this.createItemGroup(item))
        : [this.createItemGroup()];

    this.form.setControl('items', this.fb.array(controls));

    this.form.patchValue(
      {
        tableNumber: draft.tableNumber || 1,
      },
      { emitEvent: false },
    );
  }

  persistDraft(): void {
    const rawValue = this.form.getRawValue();

    const payload: CreateOrderPayload = {
      tableNumber: Number(rawValue.tableNumber) || 1,
      items: (rawValue.items ?? [])
        .filter((item) => item.menuItemId && Number(item.quantity) > 0)
        .map((item) => ({
          menuItemId: Number(item.menuItemId),
          quantity: Number(item.quantity),
          ...(item.notes?.trim() ? { notes: item.notes.trim() } : {}),
        })),
    };

    this.orderDraftService.setDraft(payload);
  }

  addItem(): void {
    this.itemsFormArray.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    if (this.itemsFormArray.length === 1) {
      return;
    }

    this.itemsFormArray.removeAt(index);
    this.persistDraft();
  }

  loadMenuItems(): void {
    this.loadingMenuItems = true;
    this.error = '';

    this.menuItemsService.getMenuItems().subscribe({
      next: (response) => {
        this.menuItems = response;
        this.loadingMenuItems = false;
      },
      error: () => {
        this.error = 'Erro ao carregar itens do cardápio';
        this.loadingMenuItems = false;
      },
    });
  }

  submitOrder(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();

    const payload: CreateOrderPayload = {
      tableNumber: Number(rawValue.tableNumber),
      items: (rawValue.items ?? []).map((item) => ({
        menuItemId: Number(item.menuItemId),
        quantity: Number(item.quantity),
        ...(item.notes?.trim() ? { notes: item.notes.trim() } : {}),
      })),
    };

    this.saving = true;
    this.error = '';
    this.success = '';
    this.stockWarningMessage = '';
    this.stockWarningDetails = [];
    this.rejectedOrderId = null;

    this.ordersService.createOrder(payload).subscribe({
      next: (response: CreateOrderResponse) => {
        this.saving = false;

        if (response.status === 'REJECTED_OUT_OF_STOCK') {
          this.stockWarningMessage =
            response.message || 'Pedido rejeitado por estoque insuficiente';
          this.stockWarningDetails = response.details ?? [];
          this.rejectedOrderId = response.orderId ?? null;
          return;
        }

        this.success = 'Pedido criado com sucesso';
        this.orderDraftService.clearDraft();
        this.resetForm();
      },
      error: (httpError) => {
        this.saving = false;

        const apiError = httpError?.error;

        if (apiError?.status === 'REJECTED_OUT_OF_STOCK') {
          this.stockWarningMessage =
            apiError.message || 'Pedido rejeitado por estoque insuficiente';
          this.stockWarningDetails = apiError.details ?? [];
          this.rejectedOrderId = apiError.orderId ?? null;
          return;
        }

        this.error = 'Erro ao criar pedido';
      },
    });
  }

  resetForm(): void {
    this.form.setControl('items', this.fb.array([this.createItemGroup()]));

    this.form.reset(
      {
        tableNumber: 1,
      },
      { emitEvent: false },
    );
  }
}
