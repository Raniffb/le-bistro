import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateOrderPayload,
  CreateOrderResponse,
  KitchenOrder,
  OrderDetails,
  OrderSummary,
} from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/orders';

  getKitchenOrders(): Observable<KitchenOrder[]> {
    return this.http.get<KitchenOrder[]>(`${this.apiUrl}/kitchen`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<unknown> {
    return this.http.patch(`${this.apiUrl}/${orderId}/status`, { status });
  }

  createOrder(payload: CreateOrderPayload): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(this.apiUrl, payload);
  }

  getOrders(filters?: {
    status?: string;
    tableNumber?: number | null;
    startDate?: string;
    endDate?: string;
  }): Observable<OrderSummary[]> {
    let params = new HttpParams();

    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    if (filters?.tableNumber) {
      params = params.set('tableNumber', filters.tableNumber);
    }

    if (filters?.startDate) {
      params = params.set('startDate', filters.startDate);
    }

    if (filters?.endDate) {
      params = params.set('endDate', filters.endDate);
    }

    return this.http.get<OrderSummary[]>(this.apiUrl, { params });
  }

  getOrderById(orderId: number): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`${this.apiUrl}/${orderId}`);
  }
}
