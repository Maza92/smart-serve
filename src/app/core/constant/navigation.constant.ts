import { NavItem } from '../model/navigation';

export const NAV_ITEMS: NavItem[] = [
  {
    name: 'Home',
    icon: 'home',
    path: '/home',
    exclusions: [],
  },
  {
    name: 'Inventario',
    icon: 'package',
    path: '/inventory',
    exclusions: [],
  },
  {
    name: 'Productos',
    icon: 'package',
    path: '/home/items',
    exclusions: [],
  },
  {
    name: 'Ajustes',
    icon: 'settings',
    path: '/settings',
    exclusions: [],
  },
  {
    name: 'Caja',
    icon: 'square-check',
    path: '/caja',
    exclusions: [],
  },
  {
    name: 'Reportes',
    icon: 'bar-chart-2',
    path: '/reportes',
    exclusions: [],
  },
  {
    name: 'Clientes',
    icon: 'users',
    path: '/starter',
    exclusions: [],
  },
  {
    name: 'Proveedores',
    icon: 'truck',
    path: '/home/inventory/suppliers',
    exclusions: [],
  },
  {
    name: 'Notificaciones',
    icon: 'bell',
    path: '/notificaciones',
    exclusions: [],
  },
];
