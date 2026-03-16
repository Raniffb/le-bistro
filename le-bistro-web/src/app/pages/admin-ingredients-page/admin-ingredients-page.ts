import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackButtonComponent } from '../../components/back-button/back-button';
import { Ingredient } from '../../models/order.model';
import { IngredientsService } from '../../services/ingredients.service';

@Component({
  selector: 'app-admin-ingredients-page',
  imports: [CommonModule, ReactiveFormsModule, BackButtonComponent],
  templateUrl: './admin-ingredients-page.html',
  styleUrl: './admin-ingredients-page.scss',
})
export class AdminIngredientsPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ingredientsService = inject(IngredientsService);

  ingredients: Ingredient[] = [];

  loading = false;
  saving = false;
  updatingStockId: number | null = null;
  editingIngredientId: number | null = null;

  error = '';
  success = '';

  form = this.fb.group({
    name: ['', [Validators.required]],
    unit: ['', [Validators.required]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.loadIngredients();
  }

  get isEditing(): boolean {
    return this.editingIngredientId !== null;
  }

  loadIngredients(showLoader = true): void {
    if (showLoader) {
      this.loading = true;
    }

    this.error = '';

    this.ingredientsService.getIngredients().subscribe({
      next: (response) => {
        this.ingredients = response;

        if (showLoader) {
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'Erro ao carregar ingredientes';

        if (showLoader) {
          this.loading = false;
        }
      },
    });
  }

  startEdit(ingredient: Ingredient): void {
    this.editingIngredientId = ingredient.id;
    this.error = '';
    this.success = '';

    this.form.reset({
      name: ingredient.name,
      unit: ingredient.unit,
      stockQuantity: ingredient.stockQuantity,
    });
  }

  cancelEdit(): void {
    this.editingIngredientId = null;
    this.form.reset({
      name: '',
      unit: '',
      stockQuantity: 0,
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();

    this.saving = true;
    this.error = '';
    this.success = '';

    const basePayload = {
      name: rawValue.name?.trim() || '',
      unit: rawValue.unit?.trim() || '',
    };

    const stockPayload = {
      stockQuantity: Number(rawValue.stockQuantity),
    };

    if (this.editingIngredientId !== null) {
      this.ingredientsService.updateIngredient(this.editingIngredientId, basePayload).subscribe({
        next: () => {
          this.ingredientsService
            .updateIngredientStock(this.editingIngredientId!, stockPayload)
            .subscribe({
              next: () => {
                this.saving = false;
                this.success = 'Ingrediente atualizado com sucesso';
                this.cancelEdit();
                this.loadIngredients(false);
              },
              error: () => {
                this.saving = false;
                this.error = 'Erro ao atualizar estoque do ingrediente';
              },
            });
        },
        error: () => {
          this.saving = false;
          this.error = 'Erro ao atualizar ingrediente';
        },
      });

      return;
    }

    this.ingredientsService
      .createIngredient({
        ...basePayload,
        stockQuantity: stockPayload.stockQuantity,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.success = 'Ingrediente criado com sucesso';
          this.form.reset({
            name: '',
            unit: '',
            stockQuantity: 0,
          });
          this.loadIngredients(false);
        },
        error: () => {
          this.saving = false;
          this.error = 'Erro ao criar ingrediente';
        },
      });
  }

  quickUpdateStock(ingredient: Ingredient, amount: number): void {
    const newQuantity = ingredient.stockQuantity + amount;

    if (newQuantity < 0) {
      return;
    }

    this.updatingStockId = ingredient.id;
    this.error = '';
    this.success = '';

    this.ingredientsService
      .updateIngredientStock(ingredient.id, {
        stockQuantity: newQuantity,
      })
      .subscribe({
        next: () => {
          this.updatingStockId = null;
          this.success = 'Estoque atualizado com sucesso';
          this.loadIngredients(false);
        },
        error: () => {
          this.updatingStockId = null;
          this.error = 'Erro ao atualizar estoque';
        },
      });
  }

  trackByIngredientId(index: number, ingredient: Ingredient): number {
    return ingredient.id;
  }
}
