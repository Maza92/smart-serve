import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryType } from '@app/core/enums/category-enums';
import { CategoryItem } from '@app/core/model/data/category-item';
import { Dish } from '@app/core/model/data/dish';
import {
  BaseFilterOptions,
  DishFilterOptions,
} from '@app/core/model/filter-options';
import { OrderItem } from '@app/core/model/order-state/order-state';
import { CreateDraftOrderRequest } from '@app/core/model/order/create-draft-order';
import { UpdateOrderWithDetailsRequest } from '@app/core/model/order/update-order-with-details';
import { CategoryItemService } from '@app/core/service/category-item.service';
import { DishService } from '@app/core/service/dish.service';
import { NavigationService } from '@app/core/service/navigation.service';
import { OrderStateService } from '@app/core/service/order-state.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

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
  orderId: number | null = null;

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

  public selectedItems$: Observable<OrderItem[]>;
  public totalItems$: Observable<number>;
  public totalPrice$: Observable<number>;

  private destroy$ = new Subject<void>();

  path: string | null = null;

  constructor(
    private navigationService: NavigationService,
    private dishService: DishService,
    private categoryService: CategoryItemService,
    private router: Router,
    private route: ActivatedRoute,
    private orderStateService: OrderStateService
  ) {
    this.selectedItems$ = this.orderStateService.items$;
    this.totalItems$ = this.orderStateService.totalItems$;
    this.totalPrice$ = this.orderStateService.totalPrice$;
  }

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchText) => {
        this.filters.search = searchText;
        this.loadDishes();
      });

    this.orderId = this.route.snapshot.params['orderId'];
    console.log('Order ID:', this.orderId);

    this.navigationService.configureNavbar(['home', 'settings']);
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
    this.orderStateService.addDish(dish);
  }

  increaseQuantity(item: OrderItem): void {
    this.orderStateService.updateItemQuantity(item.dishId, item.quantity + 1);
  }

  decreaseQuantity(item: OrderItem): void {
    this.orderStateService.updateItemQuantity(item.dishId, item.quantity - 1);
  }

  proceedToOrder(): void {
    this.navigationService.goTo('order');
  }

  goBack(): void {
    this.orderStateService.resetState();
    this.navigationService.goTo('tables');
  }
}
