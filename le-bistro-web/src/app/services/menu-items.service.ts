import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateMenuItemPayload,
  MenuItem,
  UpdateMenuItemPayload,
  UpdateMenuItemRecipePayload,
} from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class MenuItemsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/menu-items';

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl);
  }

  getAdminMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/admin`);
  }

  createMenuItem(payload: CreateMenuItemPayload): Observable<MenuItem> {
    return this.http.post<MenuItem>(this.apiUrl, payload);
  }

  updateMenuItem(id: number, payload: UpdateMenuItemPayload): Observable<MenuItem> {
    return this.http.patch<MenuItem>(`${this.apiUrl}/${id}`, payload);
  }

  updateMenuItemStatus(id: number, active: boolean): Observable<MenuItem> {
    return this.http.patch<MenuItem>(`${this.apiUrl}/${id}/status`, { active });
  }

  updateMenuItemRecipe(id: number, payload: UpdateMenuItemRecipePayload): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/${id}/recipe`, payload);
  }
}
