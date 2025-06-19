import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dish, DishWithIngredients } from '@app/core/model/data/dish';
import { DishService } from '@app/core/service/dish.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dishes',
  standalone: true,
  imports: [
    BasePageComponent,
    NgFor,
    NgIf,
    LucideAngularModule,
    RouterLink,
    BackBarComponent,
  ],
  templateUrl: './dishes.component.html',
  styleUrl: './dishes.component.css',
})
export class DishesComponent implements OnInit {
  dishes: DishWithIngredients[] = [];
  page = 1;
  pageSize = 4;
  hasMore = true;
  loading = false;

  constructor(
    private dishService: DishService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadDishes();
  }

  loadDishes(loadMore: boolean = false): void {
    if (this.loading) return;

    if (loadMore) {
      this.page++;
    }

    this.loading = true;

    this.dishService
      .getDishesWithIngredients(this.page, this.pageSize)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          const newData = response.data.content;

          if (loadMore) {
            this.dishes = [...this.dishes, ...newData];
          } else {
            this.dishes = newData;
          }

          this.hasMore = newData.length === this.pageSize;
        },
        error: (error) => {
          this.toastService.error('Error', error.message);
        },
      });
  }

  loadMore(): void {
    if (this.hasMore && !this.loading) {
      this.loadDishes(true);
    }
  }
}
