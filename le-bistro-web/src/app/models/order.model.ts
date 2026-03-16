export interface MenuItemRecipeIngredient {
  ingredientId: number;
  ingredientName: string;
  unit: string;
  quantityRequired: number;
  stockQuantity: number;
}

export interface MenuItem {
  id: number;
  name: string;
  price: string;
  active: boolean;
  ingredients?: MenuItemRecipeIngredient[];
}

export interface Ingredient {
  id: number;
  name: string;
  unit: string;
  stockQuantity: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  notes?: string;
  menuItem: MenuItem;
}

export interface KitchenOrder {
  id: number;
  tableNumber: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderItemPayload {
  menuItemId: number;
  quantity: number;
  notes?: string;
}

export interface CreateOrderPayload {
  tableNumber: number;
  items: CreateOrderItemPayload[];
}

export interface CreateOrderResponse {
  message: string;
  orderId: number;
  status: string;
  details?: string[];
}

export interface OrderHistoryEntry {
  id?: number;
  orderId?: number;
  previousStatus?: string | null;
  fromStatus?: string | null;
  newStatus?: string;
  toStatus?: string;
  changedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface OrderSummary {
  id: number;
  tableNumber: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  itemsCount: number;
}

export interface OrderDetails {
  id: number;
  tableNumber: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  history: OrderHistoryEntry[];
}

export interface CreateMenuItemPayload {
  name: string;
  price: number;
  active?: boolean;
}

export interface UpdateMenuItemPayload {
  name?: string;
  price?: number;
  active?: boolean;
}

export interface UpdateMenuItemRecipePayload {
  ingredients: {
    ingredientId: number;
    quantityRequired: number;
  }[];
}

export interface CreateIngredientPayload {
  name: string;
  unit: string;
  stockQuantity?: number;
}

export interface UpdateIngredientPayload {
  name?: string;
  unit?: string;
}

export interface UpdateIngredientStockPayload {
  stockQuantity: number;
}
