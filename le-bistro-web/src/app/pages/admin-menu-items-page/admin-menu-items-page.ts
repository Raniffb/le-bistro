import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BackButtonComponent } from '../../components/back-button/back-button';
import { Ingredient, MenuItem } from '../../models/order.model';
import { MenuItemsService } from '../../services/menu-items.service';
import { IngredientsService } from '../../services/ingredients.service';
import { RealtimeService } from '../../services/realtime.service';

@Component({
  selector: 'app-admin-menu-items-page',
  imports: [CommonModule, ReactiveFormsModule, BackButtonComponent],
  templateUrl: './admin-menu-items-page.html',
  styleUrl: './admin-menu-items-page.scss',
})
export class AdminMenuItemsPageComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly menuItemsService = inject(MenuItemsService);
  private readonly ingredientsService = inject(IngredientsService);
  private readonly realtimeService = inject(RealtimeService);

  private realtimeSubscription?: Subscription;

  menuItems: MenuItem[] = [];
  ingredients: Ingredient[] = [];

  loading = false;
  loadingIngredients = false;
  saving = false;
  savingRecipe = false;
  updatingStatusId: number | null = null;
  editingItemId: number | null = null;

  error = '';
  success = '';

  form = this.fb.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    active: [true],
  });

  recipeForm = this.fb.group({
    ingredients: this.fb.array([]),
  });

  ngOnInit(): void {
    this.loadMenuItems();
    this.loadIngredients();

    this.realtimeSubscription = this.realtimeService.onMenuItemsUpdated().subscribe(() => {
      this.loadMenuItems(false);
    });
  }

  ngOnDestroy(): void {
    this.realtimeSubscription?.unsubscribe();
  }

  get isEditing(): boolean {
    return this.editingItemId !== null;
  }

  get recipeIngredientsFormArray(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  loadMenuItems(showLoader = true): void {
    if (showLoader) {
      this.loading = true;
    }

    this.error = '';

    this.menuItemsService.getAdminMenuItems().subscribe({
      next: (response) => {
        this.menuItems = response;
        if (showLoader) {
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'Erro ao carregar itens do cardápio';
        if (showLoader) {
          this.loading = false;
        }
      },
    });
  }

  loadIngredients(): void {
    this.loadingIngredients = true;

    this.ingredientsService.getIngredients().subscribe({
      next: (response) => {
        this.ingredients = response;
        this.loadingIngredients = false;
      },
      error: () => {
        this.error = 'Erro ao carregar ingredientes';
        this.loadingIngredients = false;
      },
    });
  }

  createRecipeIngredientGroup(item?: { ingredientId?: number | null; quantityRequired?: number }) {
    return this.fb.group({
      ingredientId: [item?.ingredientId ?? null, [Validators.required]],
      quantityRequired: [item?.quantityRequired ?? 1, [Validators.required, Validators.min(1)]],
    });
  }

  addRecipeIngredient(item?: { ingredientId?: number | null; quantityRequired?: number }): void {
    this.recipeIngredientsFormArray.push(this.createRecipeIngredientGroup(item));
  }

  removeRecipeIngredient(index: number): void {
    if (this.recipeIngredientsFormArray.length === 1) {
      return;
    }

    this.recipeIngredientsFormArray.removeAt(index);
  }

  resetRecipeForm(): void {
    while (this.recipeIngredientsFormArray.length > 0) {
      this.recipeIngredientsFormArray.removeAt(0);
    }

    this.addRecipeIngredient();
  }

  startEdit(item: MenuItem): void {
    this.editingItemId = item.id;
    this.error = '';
    this.success = '';

    this.form.reset({
      name: item.name,
      price: Number(item.price),
      active: item.active,
    });

    while (this.recipeIngredientsFormArray.length > 0) {
      this.recipeIngredientsFormArray.removeAt(0);
    }

    if (item.ingredients && item.ingredients.length > 0) {
      item.ingredients.forEach((ingredient) => {
        this.addRecipeIngredient({
          ingredientId: ingredient.ingredientId,
          quantityRequired: ingredient.quantityRequired,
        });
      });
    } else {
      this.addRecipeIngredient();
    }
  }

  cancelEdit(): void {
    this.editingItemId = null;
    this.form.reset({
      name: '',
      price: 0,
      active: true,
    });
    this.resetRecipeForm();
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

    const payload = {
      name: rawValue.name?.trim() || '',
      price: Number(rawValue.price),
      active: !!rawValue.active,
    };

    if (this.editingItemId !== null) {
      this.menuItemsService.updateMenuItem(this.editingItemId, payload).subscribe({
        next: () => {
          this.saving = false;
          this.success = 'Item atualizado com sucesso';
          this.loadMenuItems(false);
        },
        error: () => {
          this.saving = false;
          this.error = 'Erro ao atualizar item do cardápio';
        },
      });

      return;
    }

    this.menuItemsService.createMenuItem(payload).subscribe({
      next: () => {
        this.saving = false;
        this.success = 'Item criado com sucesso';
        this.form.reset({
          name: '',
          price: 0,
          active: true,
        });
        this.loadMenuItems(false);
      },
      error: () => {
        this.saving = false;
        this.error = 'Erro ao criar item do cardápio';
      },
    });
  }

  saveRecipe(): void {
    if (this.editingItemId === null) {
      return;
    }

    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    const rawValue = this.recipeForm.getRawValue();
    const ingredients = (rawValue.ingredients ?? []) as Array<{
      ingredientId: number | string | null;
      quantityRequired: number | string | null;
    }>;

    this.savingRecipe = true;
    this.error = '';
    this.success = '';

    this.menuItemsService
      .updateMenuItemRecipe(this.editingItemId, {
        ingredients: ingredients.map((item) => ({
          ingredientId: Number(item.ingredientId),
          quantityRequired: Number(item.quantityRequired),
        })),
      })
      .subscribe({
        next: () => {
          this.savingRecipe = false;
          this.success = 'Receita atualizada com sucesso';
          this.loadMenuItems(false);
        },
        error: () => {
          this.savingRecipe = false;
          this.error = 'Erro ao atualizar receita do item';
        },
      });
  }

  toggleStatus(item: MenuItem): void {
    this.updatingStatusId = item.id;
    this.error = '';
    this.success = '';

    this.menuItemsService.updateMenuItemStatus(item.id, !item.active).subscribe({
      next: () => {
        this.updatingStatusId = null;
        this.success = item.active ? 'Item inativado com sucesso' : 'Item ativado com sucesso';
        this.loadMenuItems(false);
      },
      error: () => {
        this.updatingStatusId = null;
        this.error = 'Erro ao atualizar status do item';
      },
    });
  }

  getIngredientName(ingredientId: number): string {
    const ingredient = this.ingredients.find((item) => item.id === ingredientId);
    return ingredient ? `${ingredient.name} (${ingredient.unit})` : `Ingrediente #${ingredientId}`;
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
