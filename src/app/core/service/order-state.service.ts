import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { Dish } from '@app/core/model/data/dish';
import { UpdateOrderDetailsRequest } from '../model/order/update-order-details';
import {
  initialState,
  OrderItem,
  OrderState,
} from '../model/order-state/order-state';
import { UpdateOrderWithDetailsRequest } from '../model/order/update-order-with-details';
import { LocalStorageService } from './local-storage.service';
import { OrderModification } from '../model/order/modifications';
import { OrderServiceType } from '../enums/order-enum';

@Injectable({
  providedIn: 'root',
})
export class OrderStateService {
  private localStorageService: LocalStorageService =
    inject(LocalStorageService);
  private readonly ORDERSTATE_KEY = 'orderState';

  private readonly orderStateSubject: BehaviorSubject<OrderState>;

  public readonly orderState$: Observable<OrderState>;
  public readonly items$: Observable<OrderItem[]>;
  public readonly totalItems$: Observable<number>;
  public readonly totalPrice$: Observable<number>;

  constructor() {
    const savedState = this.loadStateFromStorage();
    this.orderStateSubject = new BehaviorSubject<OrderState>(
      savedState || initialState
    );

    this.orderState$ = this.orderStateSubject.asObservable();

    this.orderState$.pipe(skip(1)).subscribe((state) => {
      this.saveStateToStorage(state);
    });

    this.items$ = this.orderState$.pipe(map((state) => state.items));
    this.totalItems$ = this.items$.pipe(
      map((items) => items.reduce((total, item) => total + item.quantity, 0))
    );
    this.totalPrice$ = this.items$.pipe(
      map((items) =>
        items.reduce(
          (total, item) => total + item.dish.basePrice * item.quantity,
          0
        )
      )
    );
  }

  public setOrderId(orderId: number): void {
    const currentState = this.orderStateSubject.getValue();
    this.orderStateSubject.next({ ...currentState, orderId });
  }

  public setCustomerName(customerName: string): void {
    const currentState = this.orderStateSubject.getValue();
    this.orderStateSubject.next({ ...currentState, customerName });
  }

  public setServiceType(serviceType: OrderServiceType): void {
    const currentState = this.orderStateSubject.getValue();
    this.orderStateSubject.next({ ...currentState, serviceType });
  }

  public setComments(comments: string): void {
    const currentState = this.orderStateSubject.getValue();
    this.orderStateSubject.next({ ...currentState, comments });
  }

  public addDish(dish: Dish): void {
    const currentState = this.orderStateSubject.getValue();
    const existingItem = currentState.items.find(
      (item) => item.dishId === dish.id
    );

    if (existingItem) {
      this.updateItemQuantity(dish.id, existingItem.quantity + 1);
    } else {
      const newItem: OrderItem = {
        dishId: dish.id,
        dish: dish,
        quantity: 1,
        modifications: [],
      };
      this.orderStateSubject.next({
        ...currentState,
        items: [...currentState.items, newItem],
      });
    }
  }

  public updateItemQuantity(dishId: number, newQuantity: number): void {
    const currentState = this.orderStateSubject.getValue();
    let updatedItems;

    if (newQuantity <= 0) {
      updatedItems = currentState.items.filter(
        (item) => item.dishId !== dishId
      );
    } else {
      updatedItems = currentState.items.map((item) =>
        item.dishId === dishId ? { ...item, quantity: newQuantity } : item
      );
    }

    this.orderStateSubject.next({ ...currentState, items: updatedItems });
  }

  public updateItemModifications(
    dishId: number,
    modifications: OrderModification[]
  ): void {
    const currentState = this.orderStateSubject.getValue();
    const updatedItems = currentState.items.map((item) =>
      item.dishId === dishId ? { ...item, modifications } : item
    );
    this.orderStateSubject.next({ ...currentState, items: updatedItems });
  }

  public removeItem(dishId: number): void {
    const currentState = this.orderStateSubject.getValue();
    const updatedItems = currentState.items.filter(
      (item) => item.dishId !== dishId
    );
    this.orderStateSubject.next({ ...currentState, items: updatedItems });
  }

  public buildUpdateRequest(): UpdateOrderWithDetailsRequest | null {
    const currentState = this.orderStateSubject.getValue();
    if (!currentState.orderId || !currentState.customerName) {
      if (!currentState.customerName) {
        currentState.customerName = 'anónimo';
      }
      if (!currentState.serviceType) {
        currentState.serviceType = OrderServiceType.DINE_IN;
      }
      if (!currentState.comments) {
        currentState.comments = 'Todo bien';
      }
      if (!currentState.orderId) {
        console.error('Falta el ID de la orden.');
        return null;
      }
    }

    const details: UpdateOrderDetailsRequest[] = currentState.items.map(
      (item) => ({
        dishId: item.dishId,
        quantity: item.quantity,
        modifications: item.modifications,
      })
    );

    return {
      customerName: currentState.customerName,
      serviceType: currentState.serviceType,
      comments: currentState.comments,
      details: details,
    };
  }

  public resetState(): void {
    this.localStorageService.remove(this.ORDERSTATE_KEY);
    this.orderStateSubject.next(initialState);
  }

  private saveStateToStorage(state: OrderState): void {
    try {
      const stateString = JSON.stringify(state);
      this.localStorageService.set(this.ORDERSTATE_KEY, stateString);
    } catch (e) {
      console.error('Error guardando el estado en LocalStorage:', e);
    }
  }

  private loadStateFromStorage(): OrderState | null {
    try {
      const savedStateString = this.localStorageService.get<string>(
        this.ORDERSTATE_KEY
      );
      if (savedStateString) {
        const savedState = JSON.parse(savedStateString);
        return savedState;
      }
      return null;
    } catch (e) {
      console.error('Error cargando el estado desde LocalStorage:', e);
      this.localStorageService.remove(this.ORDERSTATE_KEY);
      return null;
    }
  }
}
