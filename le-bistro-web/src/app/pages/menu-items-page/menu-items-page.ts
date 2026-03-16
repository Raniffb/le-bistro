import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItem } from '../../models/order.model';
import { MenuItemsService } from '../../services/menu-items.service';
import { BackButtonComponent } from '../../components/back-button/back-button';
import { OrderDraftService } from '../../services/order-draft.service';

@Component({
  selector: 'app-menu-items-page',
  imports: [CommonModule, BackButtonComponent],
  templateUrl: './menu-items-page.html',
  styleUrl: './menu-items-page.scss',
})
export class MenuItemsPageComponent implements OnInit {
  private readonly menuItemsService = inject(MenuItemsService);
  private readonly router = inject(Router);
  private readonly orderDraftService = inject(OrderDraftService);

  menuItems: MenuItem[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    this.loading = true;
    this.error = '';

    this.menuItemsService.getMenuItems().subscribe({
      next: (response) => {
        this.menuItems = response;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar os itens do cardápio';
        this.loading = false;
      },
    });
  }

  goToNewOrder(menuItemId: number): void {
    this.orderDraftService.addMenuItem(menuItemId);
    this.router.navigate(['/orders/new']);
  }

  formatPrice(price: string): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(price));
  }

  trackByMenuItemId(index: number, item: MenuItem): number {
    return item.id;
  }
}
