import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryType } from '@app/core/enums/category-enums';
import { CategoryItem } from '@app/core/model/data/category-item';
import { Dish } from '@app/core/model/data/dish';
import {
  BaseFilterOptions,
  DishFilterOptions,
} from '@app/core/model/filter-options';
import { CategoryItemService } from '@app/core/service/category-item.service';
import { DishService } from '@app/core/service/dish.service';
import { NavigationService } from '@app/core/service/navigation.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  Subject,
  takeUntil,
} from 'rxjs';

interface OrderItem {
  dish: Dish;
  quantity: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    BasePageComponent,
    BackBarComponent,
    CommonModule,
    LucideAngularModule,
    FormsModule,
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent implements OnInit, OnDestroy {
  dishes: Dish[] = [];
  categories: CategoryItem[] = [];
  activeTab: number = 1;
  page = 1;
  size = 5;
  hasMore = true;
  loading = false;

  filters: DishFilterOptions = {
    category: '',
    isFeatured: false,
    maxPrice: 0,
    minPrice: 0,
    sortBy: 'name',
    sortDirection: 'asc',
    search: '',
  };

  searchInput = '';
  searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  selectedDishes: OrderItem[] = [];

  path: string | null = null;

  constructor(
    private navigationService: NavigationService,
    private dishService: DishService,
    private categoryService: CategoryItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchText) => {
        this.filters.search = searchText;
        this.loadDishes();
      });

    this.loadDishes();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  filterBy(category: string): void {
    if (this.filters.category === category) {
      this.filters.category = '';
    } else {
      this.filters.category = category;
    }
    this.resetAndLoad();
  }

  loadDishes(loadMore: boolean = false) {
    if (this.loading) return;

    if (loadMore) {
      this.page++;
    }

    this.loading = true;

    this.dishService
      .getDishes(this.page, this.size, this.filters)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          const newData = response.data.content;

          if (loadMore) {
            this.dishes = [...this.dishes, ...newData];
          } else {
            this.dishes = newData;
          }

          this.hasMore = newData.length === this.size;
        },
        error: (error) => {
          console.error('Error al cargar platos:', error);
        },
      });
  }

  loadCategories() {
    this.categoryService
      .getCategoryItemsByTipe(1, 100, 'name', 'asc', CategoryType.DISH)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.categories = response.data.content;
        },
        error: (error) => {
          console.error('Error al cargar categorías:', error.message);
        },
      });
  }

  resetAndLoad(): void {
    this.page = 1;
    this.loadDishes();
  }

  loadMore(): void {
    if (this.hasMore && !this.loading) {
      this.loadDishes(true);
    }
  }

  addToOrder(dish: Dish): void {
    const existingItem = this.selectedDishes.find(
      (item) => item.dish.id === dish.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.selectedDishes.push({
        dish: dish,
        quantity: 1,
      });
    }
  }

  increaseQuantity(index: number): void {
    if (index >= 0 && index < this.selectedDishes.length) {
      this.selectedDishes[index].quantity += 1;
    }
  }

  decreaseQuantity(index: number): void {
    if (index >= 0 && index < this.selectedDishes.length) {
      if (this.selectedDishes[index].quantity > 1) {
        this.selectedDishes[index].quantity -= 1;
      } else {
        this.selectedDishes.splice(index, 1);
      }
    }
  }

  getTotalItems(): number {
    return this.selectedDishes.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  getTotalPrice(): number {
    return this.selectedDishes.reduce(
      (total, item) => total + item.dish.basePrice * item.quantity,
      0
    );
  }

  proceedToOrder(): void {
    console.log('Procediendo con la orden:', this.selectedDishes);
  }
}
