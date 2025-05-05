import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavItem } from '../model/navigation';
import { NAV_ITEMS } from '../constant/navigation.constant';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private navItems: NavItem[] = NAV_ITEMS;

  private visibleNavItems = new BehaviorSubject<NavItem[]>(this.navItems);
  public visibleNavItems$ = this.visibleNavItems.asObservable();

  constructor() {}

  updateNavVisibility(currentRoute: string): void {
    const updatedItems = this.navItems.map((item) => {
      if (!item.exclusions) return item;

      const shouldBeHidden = item.exclusions.some(
        (exclusion) =>
          currentRoute === exclusion.path ||
          (exclusion.path.endsWith('*') &&
            currentRoute.startsWith(exclusion.path.slice(0, -1)))
      );

      return {
        ...item,
        visible: !shouldBeHidden,
      };
    });

    this.visibleNavItems.next(updatedItems);
  }

  configureNavForRoute(route: string): void {
    this.updateNavVisibility(route);
  }

  /**
   * Permite añadir una exclusión dinámica a un item específico
   */
  addExclusion(itemName: string, exclusionPath: string): void {
    const updatedItems = this.navItems.map((item) => {
      if (item.name !== itemName) {
        return item;
      }

      if (!item.exclusions) {
        item.exclusions = [];
      }

      if (!item.exclusions.some((e) => e.path === exclusionPath)) {
        return {
          ...item,
          exclusions: [...item.exclusions, { path: exclusionPath }],
        };
      }
      return item;
    });

    this.navItems = updatedItems;
    this.updateNavVisibility(window.location.pathname);
  }

  /**
   * Elimina una exclusión de un item específico
   */
  removeExclusion(itemName: string, exclusionPath: string): void {
    const updatedItems = this.navItems.map((item) => {
      if (item.name !== itemName) {
        return item;
      }

      if (!item.exclusions) {
        item.exclusions = [];
      }

      return {
        ...item,
        exclusions: item.exclusions.filter((e) => e.path !== exclusionPath),
      };
    });

    this.navItems = updatedItems;
    this.updateNavVisibility(window.location.pathname);
  }

  getCurrentComponentPath(): string {
    console.log(window.location.pathname);
    return window.location.pathname;
  }
}
