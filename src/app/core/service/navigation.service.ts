import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavItem } from '../model/navigation';
import { NAV_ITEMS } from '../constant/navigation.constant';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private navItemsMap: Map<string, NavItem> = new Map();
  private pathMap: Map<string, NavItem> = new Map();

  private visibleNavItemsSubject = new BehaviorSubject<NavItem[]>([]);
  public visibleNavItems$ = this.visibleNavItemsSubject.asObservable();

  constructor(private router: Router) {
    this.processNavItems();
  }

  private processNavItems(): void {
    const process = (
      items: NavItem[],
      parentKey?: string,
      parentPath?: string
    ): void => {
      for (const item of items) {
        const base = parentPath || '';
        item.fullPath = item.path.startsWith('/')
          ? item.path
          : `${base}/${item.path}`;
        item.parentKey = parentKey;
        this.navItemsMap.set(item.key, item);
        this.pathMap.set(item.fullPath, item);

        if (item.children && item.children.length > 0) {
          process(item.children, item.key, item.fullPath);
        }
      }
    };

    process(NAV_ITEMS);
  }

  public configureNavbar(keys: string[]): void {
    const itemsToShow: NavItem[] = [];
    for (const key of keys) {
      const item = this.navItemsMap.get(key);
      if (item) {
        itemsToShow.push(item);
      } else {
        console.warn(
          `NavigationService: No se encontró el NavItem con la key "${key}".`
        );
      }
    }
    this.visibleNavItemsSubject.next(itemsToShow);
  }

  public getParentPath(currentPath: string): string | null {
    let path = currentPath.split('?')[0];

    while (path.length > 0) {
      const currentItem = this.pathMap.get(path);

      if (currentItem) {
        if (currentItem.parentKey) {
          const parentItem = this.navItemsMap.get(currentItem.parentKey);
          return parentItem?.fullPath || null;
        }
        return null;
      }

      const lastSlashIndex = path.lastIndexOf('/');
      if (lastSlashIndex > 0) {
        path = path.substring(0, lastSlashIndex);
      } else {
        path = '';
      }
    }

    return null;
  }

  public goTo(key: string, segments: (string | number)[] = []): void {
    const item = this.navItemsMap.get(key);
    if (item && item.fullPath) {
      const finalPath = [item.fullPath, ...segments].join('/');
      this.router.navigateByUrl(finalPath);
    } else {
      console.error(
        `NavigationService: Intento de navegar a una key inválida o sin ruta: "${key}"`
      );
    }
  }
}
