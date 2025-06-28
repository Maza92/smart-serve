import { NavItem } from '../model/navigation';

export const NAV_ITEMS: NavItem[] = [
  {
    key: 'components',
    name: 'Componentes',
    icon: 'layout-grid',
    path: '/components',
  },
  {
    key: 'starter',
    name: 'Starter',
    icon: 'rocket',
    path: '/starter',
  },

  {
    key: 'login',
    name: 'Login',
    icon: 'log-in',
    path: '/auth/login',
  },
  {
    key: 'register',
    name: 'Registro',
    icon: 'user-plus',
    path: '/auth/register',
  },
  {
    key: 'email-verification',
    name: 'Verificación de Email',
    icon: 'mail-check',
    path: '/auth/email-verification',
  },
  {
    key: 'code-verification',
    name: 'Verificación de Código',
    icon: 'shield-check',
    path: '/auth/code-verification',
  },
  {
    key: 'reset-password',
    name: 'Restablecer Contraseña',
    icon: 'key-round',
    path: '/auth/reset-password',
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
        icon: 'boxes',
        path: 'inventory',
        children: [
          {
            key: 'suppliers',
            name: 'Proveedores',
            icon: 'truck',
            path: 'suppliers',
            children: [
              {
                key: 'create',
                name: 'Crear Proveedor',
                icon: 'plus-circle',
                path: 'create',
              },
              {
                key: 'suppliers.details',
                name: 'Detalles Proveedor',
                icon: 'file-text',
                path: 'details',
              },
            ],
          },
          {
            key: 'items',
            name: 'Productos',
            icon: 'shopping-basket',
            path: 'items',
            children: [
              {
                key: 'items.details',
                name: 'Detalles Producto',
                icon: 'file-text',
                path: 'details',
              },
              {
                key: 'movements',
                name: 'Movimientos',
                icon: 'arrow-right-left',
                path: 'movements',
                children: [
                  {
                    key: 'shop',
                    name: 'Registro de Almacenes',
                    icon: 'shopping-cart',
                    path: 'shop',
                  },
                  {
                    key: 'waste',
                    name: 'Registro de Desechos',
                    icon: 'trash-2',
                    path: 'waste',
                  },
                  {
                    key: 'manual',
                    name: 'Registro Manual',
                    icon: 'pencil',
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
        icon: 'scan-line',
        path: 'pos',
        children: [
          {
            key: 'cash-register',
            name: 'Registro de Efectivo',
            icon: 'banknote',
            path: 'cash-register',
          },
          {
            key: 'sales',
            name: 'Ventas',
            icon: 'trending-up',
            path: 'sales',
          },
          {
            key: 'order',
            name: 'Pedidos',
            icon: 'clipboard-list',
            path: 'order',
          },
          {
            key: 'tables',
            name: 'Mesas',
            icon: 'table',
            path: 'tables',
          },
          {
            key: 'kitchen',
            name: 'Kitchen',
            icon: 'utensils-crossed',
            path: 'kitchen',
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
    icon: 'settings',
    path: '/settings',
    children: [
      {
        key: 'users',
        name: 'Usuarios',
        icon: 'users',
        path: 'users',
        children: [
          {
            key: 'user.edit',
            name: 'Editar Usuario',
            icon: 'user-cog',
            path: 'edit',
          },
        ],
      },
      {
        key: 'user',
        name: 'Editar Usuario',
        icon: 'user-cog',
        path: 'user',
      },
      {
        key: 'table',
        name: 'Mesas',
        icon: 'table',
        path: 'table',
      },
      {
        key: 'dishes',
        name: 'Platos',
        icon: 'utensils-crossed',
        path: 'dishes',
        children: [
          {
            key: 'dishes.create',
            name: 'Crear Plato',
            icon: 'plus-circle',
            path: 'create',
          },
          {
            key: 'dishes.edit',
            name: 'Editar Plato',
            icon: 'pencil',
            path: 'edit',
          },
        ],
      },
    ],
  },
  {
    key: 'terms',
    name: 'Términos y Condiciones',
    icon: 'file-text',
    path: '/terms',
  },
  {
    key: 'privacy',
    name: 'Política de Privacidad',
    icon: 'shield',
    path: '/privacy',
  },
];
