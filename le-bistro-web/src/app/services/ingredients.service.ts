import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateIngredientPayload,
  Ingredient,
  UpdateIngredientPayload,
  UpdateIngredientStockPayload,
} from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/ingredients';

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.apiUrl);
  }

  createIngredient(payload: CreateIngredientPayload): Observable<Ingredient> {
    return this.http.post<Ingredient>(this.apiUrl, payload);
  }

  updateIngredient(id: number, payload: UpdateIngredientPayload): Observable<Ingredient> {
    return this.http.patch<Ingredient>(`${this.apiUrl}/${id}`, payload);
  }

  updateIngredientStock(id: number, payload: UpdateIngredientStockPayload): Observable<Ingredient> {
    return this.http.patch<Ingredient>(`${this.apiUrl}/${id}/stock`, payload);
  }
}
