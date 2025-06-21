import { NavItem } from '../model/navigation';

export const NAV_ITEMS: NavItem[] = [
  {
    key: 'components',
    name: 'Componentes',
    icon: 'package',
    path: '/components',
  },
  {
    key: 'starter',
    name: 'Starter',
    icon: 'package',
    path: '/starter',
  },
  {
    key: 'auth',
    name: 'Auth',
    icon: 'package',
    path: '/auth',
    children: [
      {
        key: 'login',
        name: 'Login',
        icon: 'package',
        path: 'login',
      },
      {
        key: 'register',
        name: 'Registro',
        icon: 'package',
        path: 'register',
      },
      {
        key: 'email-verification',
        name: 'Verificación de Email',
        icon: 'package',
        path: 'email-verification',
      },
      {
        key: 'code-verification',
        name: 'Verificación de Código',
        icon: 'package',
        path: 'code-verification',
      },
      {
        key: 'reset-password',
        name: 'Restablecer Contraseña',
        icon: 'package',
        path: 'reset-password',
      },
    ],
  },
  {
    key: 'home',
    name: 'Home',
    icon: 'home',
    path: '/home',
    children: [
      {
        key: 'inventory',
        name: 'Inventario',
        icon: 'package',
        path: 'inventory',
        children: [
          {
            key: 'suppliers',
            name: 'Proveedores',
            icon: 'package',
            path: 'suppliers',
            children: [
              {
                key: 'create',
                name: 'Crear Proveedor',
                icon: 'package',
                path: 'create',
              },
              {
                key: 'suppliers.details',
                name: 'Detalles Proveedor',
                icon: 'package',
                path: 'details',
              },
            ],
          },
          {
            key: 'items',
            name: 'Productos',
            icon: 'package',
            path: 'items',
            children: [
              {
                key: 'items.details',
                name: 'Detalles Producto',
                icon: 'package',
                path: 'details',
              },
              {
                key: 'movements',
                name: 'Movimientos',
                icon: 'package',
                path: 'movements',
                children: [
                  {
                    key: 'shop',
                    name: 'Registro de Almacenes',
                    icon: 'package',
                    path: 'shop',
                  },
                  {
                    key: 'waste',
                    name: 'Registro de Desechos',
                    icon: 'package',
                    path: 'waste',
                  },
                  {
                    key: 'manual',
                    name: 'Registro Manual',
                    icon: 'package',
                    path: 'manual',
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        key: 'pos',
        name: 'Caja',
        icon: 'package',
        path: 'pos',
        children: [
          {
            key: 'cash-register',
            name: 'Registro de Efectivo',
            icon: 'package',
            path: 'cash-register',
          },
          {
            key: 'sales',
            name: 'Ventas',
            icon: 'package',
            path: 'sales',
          },
          {
            key: 'order',
            name: 'Pedidos',
            icon: 'package',
            path: 'order',
          },
        ],
      },
      {
        key: 'notifications',
        name: 'Notificaciones',
        icon: 'bell',
        path: 'notificaciones',
      },
    ],
  },
  {
    key: 'settings',
    name: 'Configuración',
    icon: 'package',
    path: '/settings',
    children: [
      {
        key: 'users',
        name: 'Usuarios',
        icon: 'package',
        path: 'users',
        children: [
          {
            key: 'user.edit',
            name: 'Editar Usuario',
            icon: 'package',
            path: 'edit',
          },
        ],
      },
      {
        key: 'user',
        name: 'Editar Usuario',
        icon: 'package',
        path: 'user',
      },
      {
        key: 'table',
        name: 'Mesas',
        icon: 'package',
        path: 'table',
      },
      {
        key: 'dishes',
        name: 'Platos',
        icon: 'package',
        path: 'dishes',
        children: [
          {
            key: 'dishes.create',
            name: 'Crear Plato',
            icon: 'package',
            path: 'create',
          },
          {
            key: 'dishes.edit',
            name: 'Editar Plato',
            icon: 'package',
            path: 'edit',
          },
        ],
      },
    ],
  },
  {
    key: 'terms',
    name: 'Términos y Condiciones',
    icon: 'package',
    path: '/terms',
  },
  {
    key: 'privacy',
    name: 'Política de Privacidad',
    icon: 'package',
    path: '/privacy',
  },
];
