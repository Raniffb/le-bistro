import { Routes } from '@angular/router';
import { HomeMenuPageComponent } from './pages/home-menu-page/home-menu-page';
import { KitchenDashboardComponent } from './pages/kitchen-dashboard/kitchen-dashboard';
import { NewOrderPageComponent } from './pages/new-order-page/new-order-page';
import { OrderHistoryPageComponent } from './pages/order-history-page/order-history-page';
import { MenuItemsPageComponent } from './pages/menu-items-page/menu-items-page';
import { AdminMenuItemsPageComponent } from './pages/admin-menu-items-page/admin-menu-items-page';
import { AdminIngredientsPageComponent } from './pages/admin-ingredients-page/admin-ingredients-page';

export const routes: Routes = [
  {
    path: '',
    component: HomeMenuPageComponent,
  },
  {
    path: 'kitchen',
    component: KitchenDashboardComponent,
  },
  {
    path: 'orders/new',
    component: NewOrderPageComponent,
  },
  {
    path: 'orders/history',
    component: OrderHistoryPageComponent,
  },
  {
    path: 'menu-items',
    component: MenuItemsPageComponent,
  },
  {
    path: 'menu-items/admin',
    component: AdminMenuItemsPageComponent,
  },
  {
    path: 'ingredients/admin',
    component: AdminIngredientsPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
