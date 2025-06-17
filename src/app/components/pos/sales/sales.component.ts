import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '@app/core/service/navigation.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';

// Interfaces para el manejo de platos y órdenes
interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

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
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent implements OnInit {
  activeTab: number = 1;

  dishes: Dish[] = [
    {
      id: 1,
      name: 'Pescado a la parrilla',
      description: 'Pescado fresco a la parrilla con guarnición',
      price: 150,
      image:
        'https://media.istockphoto.com/id/2191090089/photo/grilled-fish-served-in-a-fine-restaurant-with-green-beans-mash-cherry-tomatoes-olives-and.jpg?s=1024x1024&w=is&k=20&c=QFnyxhysSOOWJBEZ2G_MYktmtSxFw6gMwSCLOqTlk60=',
      category: 'Comidas',
    },
    {
      id: 2,
      name: 'Ensalada César',
      description: 'Ensalada fresca con pollo, crutones y aderezo César',
      price: 120,
      image:
        'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'Comidas',
    },
    {
      id: 3,
      name: 'Café Americano',
      description: 'Café negro recién preparado',
      price: 50,
      image:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'Bebidas',
    },
    {
      id: 4,
      name: 'Tarta de chocolate',
      description: 'Deliciosa tarta de chocolate con frutos rojos',
      price: 80,
      image:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'Postres',
    },
  ];

  selectedDishes: OrderItem[] = [];

  path: string | null = null;

  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.path = this.navigationService.getCurrentComponentPath();
    this.navigationService.addExclusions(
      ['Pos', 'Caja', 'Reportes', 'Clientes', 'Proveedores', 'Notificaciones'],
      this.path
    );
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
      (total, item) => total + item.dish.price * item.quantity,
      0
    );
  }

  proceedToOrder(): void {
    console.log('Procediendo con la orden:', this.selectedDishes);
  }
}
