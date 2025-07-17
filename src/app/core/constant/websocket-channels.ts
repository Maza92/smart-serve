export const WEBSOCKET_CHANNELS = {
  PUBLIC: {
    TABLES: '/topic/tables',
    KITCHEN_ORDER_UPDATES: '/topic/kitchen/order-updates',
    INVENTORY_DASHBOARD: '/topic/dashboard/inventory',
  },
  PRIVATE: {
    NOTIFICATIONS: '/user/queue/notifications',
  },
  SEND: {
    CLAIM_ORDER: '/app/kitchen/claim-order',
  },
};
