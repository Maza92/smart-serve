import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ingredient } from '@app/core/model/data/recipe';
import {
  OrderModification,
  OrderModificationAction,
} from '@app/core/model/order/modifications';
import { DishService } from '@app/core/service/dish.service';
import { OrderStateService } from '@app/core/service/order-state.service';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ingredient-editor',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './ingredient-editor.component.html',
  styleUrl: './ingredient-editor.component.css',
})
export class IngredientEditorComponent implements OnInit {
  @Input() dishId!: number;
  @Input() currentModifications: OrderModification[] = [];

  ingredients: Ingredient[] = [];
  modifications: OrderModification[] = [];
  notes: string = '';
  loading = true;

  // Ingredientes extras comunes que se pueden agregar
  extraIngredients: Ingredient[] = [
    {
      inventoryItemId: 100,
      name: 'Bacon',
      quantityRequired: 50,
      unitId: 1,
      unitName: 'gramos',
      unitAbbreviation: 'g',
      unitCost: 3.0,
    },
    {
      inventoryItemId: 101,
      name: 'Huevo',
      quantityRequired: 1,
      unitId: 1,
      unitName: 'gramos',
      unitAbbreviation: 'g',
      unitCost: 1.5,
    },
    {
      inventoryItemId: 102,
      name: 'Aguacate',
      quantityRequired: 50,
      unitId: 1,
      unitName: 'gramos',
      unitAbbreviation: 'g',
      unitCost: 2.5,
    },
    {
      inventoryItemId: 103,
      name: 'Queso Extra',
      quantityRequired: 30,
      unitId: 1,
      unitName: 'gramos',
      unitAbbreviation: 'g',
      unitCost: 2.0,
    },
    {
      inventoryItemId: 104,
      name: 'Jalapeños',
      quantityRequired: 20,
      unitId: 1,
      unitName: 'gramos',
      unitAbbreviation: 'g',
      unitCost: 1.0,
    },
  ];

  constructor(
    private dishService: DishService,
    private modalService: ModalService,
    private orderStateService: OrderStateService
  ) {}

  ngOnInit(): void {
    this.loadIngredients();
    this.modifications = [...this.currentModifications];

    const noteModification = this.modifications.find(
      (m) => m.action === OrderModificationAction.NOTE
    );
    if (noteModification) {
      this.notes = noteModification.ingredientName;
    }
  }

  loadIngredients(): void {
    this.dishService.getDishIngredients(this.dishId).subscribe({
      next: (response) => {
        if (response) {
          this.ingredients = response.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  isIngredientRemoved(ingredientId: number): boolean {
    return this.modifications.some(
      (m) =>
        m.inventoryItemId === ingredientId &&
        m.action === OrderModificationAction.REMOVE
    );
  }

  getIngredientQuantityChange(ingredientId: number): number {
    const modification = this.modifications.find(
      (m) =>
        m.inventoryItemId === ingredientId &&
        (m.action === OrderModificationAction.EXTRA ||
          m.action === OrderModificationAction.LESS)
    );
    return modification ? modification.quantityChange : 0;
  }

  isExtraIngredientAdded(ingredientId: number): boolean {
    return this.modifications.some(
      (m) =>
        m.inventoryItemId === ingredientId &&
        m.action === OrderModificationAction.ADD
    );
  }

  toggleRemoveIngredient(ingredient: Ingredient): void {
    const existingIndex = this.modifications.findIndex(
      (m) =>
        m.inventoryItemId === ingredient.inventoryItemId &&
        m.action === OrderModificationAction.REMOVE
    );

    if (existingIndex >= 0) {
      this.modifications.splice(existingIndex, 1);
    } else {
      this.modifications = this.modifications.filter(
        (m) =>
          !(
            m.inventoryItemId === ingredient.inventoryItemId &&
            (m.action === OrderModificationAction.EXTRA ||
              m.action === OrderModificationAction.LESS)
          )
      );

      this.modifications.push({
        inventoryItemId: ingredient.inventoryItemId,
        ingredientName: ingredient.name,
        action: OrderModificationAction.REMOVE,
        quantityChange: -ingredient.quantityRequired,
        unitId: 2,
        priceAdjustment: 0,
      });
    }
  }

  adjustIngredientQuantity(ingredient: Ingredient, change: number): void {
    if (this.isIngredientRemoved(ingredient.inventoryItemId)) {
      return;
    }

    const existingIndex = this.modifications.findIndex(
      (m) =>
        m.inventoryItemId === ingredient.inventoryItemId &&
        (m.action === OrderModificationAction.EXTRA ||
          m.action === OrderModificationAction.LESS)
    );

    const currentChange = this.getIngredientQuantityChange(
      ingredient.inventoryItemId
    );
    const newChange = Math.max(0, currentChange + change);

    if (existingIndex >= 0) {
      if (newChange === 0) {
        this.modifications.splice(existingIndex, 1);
      } else {
        this.modifications[existingIndex].quantityChange = newChange;
        this.modifications[existingIndex].action =
          OrderModificationAction.EXTRA;
        this.modifications[existingIndex].priceAdjustment =
          (newChange / ingredient.quantityRequired) * ingredient.unitCost;
      }
    } else if (newChange > 0) {
      this.modifications.push({
        inventoryItemId: ingredient.inventoryItemId,
        ingredientName: ingredient.name,
        action: OrderModificationAction.EXTRA,
        quantityChange: newChange,
        unitId: 2,
        priceAdjustment:
          (newChange / ingredient.quantityRequired) * ingredient.unitCost,
      });
    }
  }

  toggleExtraIngredient(ingredient: Ingredient): void {
    const existingIndex = this.modifications.findIndex(
      (m) =>
        m.inventoryItemId === ingredient.inventoryItemId &&
        m.action === OrderModificationAction.ADD
    );

    if (existingIndex >= 0) {
      this.modifications.splice(existingIndex, 1);
    } else {
      this.modifications.push({
        inventoryItemId: ingredient.inventoryItemId,
        ingredientName: ingredient.name,
        action: OrderModificationAction.ADD,
        quantityChange: ingredient.quantityRequired,
        unitId: 2,
        priceAdjustment: ingredient.unitCost,
      });
    }
  }

  updateNotes(): void {
    this.modifications = this.modifications.filter(
      (m) => m.action !== OrderModificationAction.NOTE
    );

    if (this.notes.trim()) {
      this.modifications.push({
        inventoryItemId: 0,
        ingredientName: this.notes.trim(),
        action: OrderModificationAction.NOTE,
        quantityChange: 0,
        unitId: 0,
        priceAdjustment: 0,
      });
    }
  }

  saveModifications(): void {
    this.updateNotes();
    this.orderStateService.updateItemModifications(
      this.dishId,
      this.modifications
    );
    this.modalService.close();
  }

  cancel(): void {
    this.modalService.close();
  }

  getTotalPriceAdjustment(): number {
    return this.modifications.reduce(
      (total, mod) => total + mod.priceAdjustment,
      0
    );
  }
}
