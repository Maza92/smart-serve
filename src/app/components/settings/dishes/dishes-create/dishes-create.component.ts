import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import { ItemSelectComponent } from '../../../../shared/item-select/item-select.component';
import { InventoryItem } from '@app/core/model/data/inventory-item';
import { CreateRecipeForDishRequest } from '@app/core/model/recipe/create-recipe-for-dish';
import { CreateDishRequest } from '@app/core/model/dish/create-dish-request';
import { DishService } from '@app/core/service/dish.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { Router } from '@angular/router';
import { CategoryItem } from '@app/core/model/data/category-item';
import { CategoryItemService } from '@app/core/service/category-item.service';
import { CategoryType } from '@app/core/enums/category-enums';

@Component({
  selector: 'app-dishes-create',
  standalone: true,
  imports: [
    BasePageComponent,
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dishes-create.component.html',
  styleUrl: './dishes-create.component.css',
})
export class DishesCreateComponent implements OnInit {
  ingredients: InventoryItem[] = [];
  categories: CategoryItem[] = [];
  dishForm!: FormGroup;

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private dishService: DishService,
    private categoryService: CategoryItemService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.categoryService
      .getCategoryItemsByTipe(1, 100, 'name', 'asc', CategoryType.DISH)
      .subscribe(
        (response) => {
          this.categories = response.data.content;
        },
        (error) => {
          this.toastService.error(error.message);
        }
      );
  }

  private initForm() {
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      categoryId: [0, Validators.required],
      imageUrl: ['', Validators.required],
      preparationTime: [0, [Validators.required, Validators.min(0)]],
      ingredients: this.fb.array([]),
    });
  }

  get ingredientsFormArray() {
    return this.dishForm.get('ingredients') as FormArray;
  }

  selectedItem() {
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
        const item = result.data as InventoryItem;
        if (item) {
          this.ingredients.push(item);
          this.ingredientsFormArray.push(
            this.fb.group({
              inventoryItemId: [item.id],
              quantityRequired: [0, [Validators.required, Validators.min(0)]],
              notes: [''],
              preparationOrder: [
                this.ingredients.length,
                [Validators.required, Validators.min(1)],
              ],
            })
          );
        }
      });
  }

  removeIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsFormArray.removeAt(index);
  }

  onSubmit() {
    if (this.dishForm.valid) {
      const request: CreateDishRequest = this.dishForm.value;
      this.dishService.createDish(request).subscribe(
        (response) => {
          this.toastService.success(response.message);
          this.router.navigate(['/settings/dishes']);
        },
        (error) => {
          this.toastService.error(error.message);
        }
      );
    }
  }
}
