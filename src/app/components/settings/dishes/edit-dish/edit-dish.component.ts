import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryItem } from '@app/core/model/data/category-item';
import { InventoryItem } from '@app/core/model/data/inventory-item';
import { IngredientSummary } from '@app/core/model/data/recipe';
import { UpdateDishRequest } from '@app/core/model/dish/update-dish-request';
import { CategoryItemService } from '@app/core/service/category-item.service';
import { DishService } from '@app/core/service/dish.service';
import { RecipeService } from '@app/core/service/recipe.service';
import { CategoryType } from '@app/core/enums/category-enums';
import { ToastService } from '@app/lib/toast/toast.service';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import { ItemSelectComponent } from '../../../../shared/item-select/item-select.component';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  Subscription,
} from 'rxjs';
import { CreateRecipeRequest } from '@app/core/model/recipe/create-recipe';
import { UpdateRecipeRequest } from '@app/core/model/recipe/update-recipe';
import {
  IngredientStatus,
  IngredientWithStatus,
} from '@app/core/model/util/Ingredient';
import { AlertService } from '@app/lib/alert/alert.service';

@Component({
  selector: 'app-edit-dish',
  standalone: true,
  imports: [
    BasePageComponent,
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './edit-dish.component.html',
  styleUrls: ['./edit-dish.component.css'],
})
export class EditDishComponent implements OnInit {
  ingredients: IngredientWithStatus[] = [];
  categories: CategoryItem[] = [];
  dishForm!: FormGroup;
  id: number | null = null;
  loading = false;
  savingDish = false;

  private dishFormSubscription?: Subscription;
  private dishSaveTimeout?: any;

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private dishService: DishService,
    private recipeService: RecipeService,
    private categoryService: CategoryItemService,
    private toastService: ToastService,
    private alertService: AlertService,
    private route: ActivatedRoute
  ) {
    this.id = Number(this.route.snapshot.params['id']);
    this.initForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    if (this.id) {
      this.loadDishData();
      this.setupAutoSave();
    }
  }

  ngOnDestroy(): void {
    this.dishFormSubscription?.unsubscribe();
    if (this.dishSaveTimeout) {
      clearTimeout(this.dishSaveTimeout);
    }
  }

  private setupAutoSave(): void {
    const dishFieldsOnly = this.dishForm.get([
      'name',
      'description',
      'basePrice',
      'categoryId',
      'imageUrl',
      'preparationTime',
    ]);

    this.dishFormSubscription = dishFieldsOnly?.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ),
        filter(() => this.dishForm.valid && !this.savingDish)
      )
      .subscribe(() => {
        this.autoSaveDish();
      });
  }

  private autoSaveDish(): void {
    if (!this.id || this.savingDish) return;

    this.savingDish = true;
    const dishUpdateRequest: UpdateDishRequest = {
      name: this.dishForm.value.name,
      description: this.dishForm.value.description,
      basePrice: this.dishForm.value.basePrice,
      categoryId: this.dishForm.value.categoryId.toString(),
      imageUrl: this.dishForm.value.imageUrl,
      preparationTime: this.dishForm.value.preparationTime,
    };

    this.dishService.updateDish(this.id, dishUpdateRequest).subscribe({
      next: () => {
        this.toastService.success('Cambios guardados automáticamente');
        this.savingDish = false;
      },
      error: (error) => {
        this.toastService.error('Error al guardar: ' + error.message);
        this.savingDish = false;
      },
    });
  }

  private loadDishData(): void {
    this.loading = true;
    if (!this.id) return;

    this.dishService.getDishWithIngredientsById(this.id).subscribe({
      next: (response) => {
        const dish = response.data;
        this.dishForm.patchValue({
          name: dish.name,
          description: dish.description,
          basePrice: dish.basePrice,
          categoryId: dish.categoryId,
          imageUrl: dish.imageUrl,
          preparationTime: dish.preparationTime,
        });

        this.ingredients = dish.ingredients.map((ingredient) => ({
          ...ingredient,
          status: 'existing' as IngredientStatus,
          isUpdating: false,
        }));

        this.loading = false;
      },
      error: (error) => {
        this.toastService.error(error.message);
        this.loading = false;
      },
    });
  }

  async addIngredient(): Promise<void> {
    this.modalService
      .open(ItemSelectComponent, {
        modal: {
          enter: 'enter-scaling 0.1s ease-out',
          leave: 'fade-out 0.1s ease-out',
          top: '50',
          left: '50%',
        },
        overlay: {
          enter: 'fade-in 0.3s ease-out',
          leave: 'fade-out 0.2s ease-in',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        size: {
          width: '100%',
          maxHeight: '80vh',
        },
        actions: {
          escape: true,
          click: true,
        },
      })
      .then((result) => {
        if (!result || !result.data) return;
        const item = result.data as InventoryItem;
        const newIngredient: IngredientWithStatus = {
          recipeId: 0,
          inventoryItemId: item.id,
          inventoryItemName: item.name,
          quantityRequired: 0,
          notes: '',
          preparationOrder: this.ingredients.length + 1,
          status: 'creating',
          isUpdating: true,
        };

        this.ingredients.push(newIngredient);

        if (!this.id) return;
        const createRequest: CreateRecipeRequest = {
          inventoryItemId: item.id,
          quantityRequired: 1,
          notes: '',
          preparationOrder: this.ingredients.length,
          dishId: this.id,
        };

        this.recipeService.createRecipe(createRequest).subscribe({
          next: (response) => {
            const index = this.ingredients.length - 1;
            this.ingredients[index] = {
              ...this.ingredients[index],
              recipeId: response.data.id,
              status: 'existing',
              isUpdating: false,
            };
            this.toastService.success('Ingrediente agregado');
          },
          error: (error) => {
            this.ingredients.pop();
            this.toastService.error(
              'Error al agregar ingrediente: ' + error.message
            );
          },
        });
      });
  }

  updateIngredient(index: number, field: any, event: Event): void {
    const ingredient = this.ingredients[index];
    if (!ingredient.recipeId || ingredient.status === 'creating') return;

    ingredient.isUpdating = true;
    const value = (event.target as HTMLInputElement).value;
    switch (field) {
      case 'quantityRequired':
        ingredient.quantityRequired = Number(value);
        break;
      case 'notes':
        ingredient.notes = value;
        break;
      case 'preparationOrder':
        ingredient.preparationOrder = Number(value);
        break;
    }

    if (ingredient.updateTimeout) {
      clearTimeout(ingredient.updateTimeout);
    }

    ingredient.updateTimeout = setTimeout(() => {
      const updateRequest: UpdateRecipeRequest = {
        inventoryItemId: ingredient.inventoryItemId,
        quantityRequired: ingredient.quantityRequired,
        notes: ingredient.notes,
        preparationOrder: ingredient.preparationOrder,
      };

      this.recipeService
        .updateRecipe(ingredient.recipeId, updateRequest)
        .subscribe({
          next: () => {
            ingredient.isUpdating = false;
            this.toastService.success('Ingrediente actualizado');
          },
          error: (error) => {
            ingredient.isUpdating = false;
            this.toastService.error('Error al actualizar: ' + error.message);
          },
        });
    }, 1000);
  }

  removeIngredient(index: number): void {
    this.alertService.warning(
      '¿Estás seguro de que deseas eliminar este ingrediente?',
      'Confirmación',
      {
        buttons: [
          {
            text: 'Cancelar',
            action: () => {
              return;
            },
          },
          {
            text: 'Eliminar',
            action: () => {
              const ingredient = this.ingredients[index];

              if (ingredient.status === 'creating') {
                this.ingredients.splice(index, 1);
                return;
              }

              if (!ingredient.recipeId) return;

              ingredient.isUpdating = true;
              ingredient.status = 'deleting';

              this.recipeService.deleteRecipe(ingredient.recipeId).subscribe({
                next: () => {
                  this.ingredients.splice(index, 1);
                  this.toastService.success('Ingrediente eliminado');
                },
                error: (error) => {
                  ingredient.isUpdating = false;
                  ingredient.status = 'existing';
                  this.toastService.error(
                    'Error al eliminar: ' + error.message
                  );
                },
              });
            },
          },
        ],
      }
    );
  }

  saveAllChanges(): void {
    if (this.dishForm.valid && !this.savingDish) {
      this.autoSaveDish();
    }
  }

  private initForm(): void {
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      categoryId: [0, Validators.required],
      imageUrl: ['', Validators.required],
      preparationTime: [0, [Validators.required, Validators.min(0)]],
    });
  }

  private loadCategories(): void {
    this.categoryService
      .getCategoryItemsByTipe(1, 100, 'name', 'asc', CategoryType.DISH)
      .subscribe({
        next: (response) => {
          this.categories = response.data.content;
        },
        error: (error) => {
          this.toastService.error(error.message);
        },
      });
  }
}
