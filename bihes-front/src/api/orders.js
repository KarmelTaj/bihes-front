/**
 * Endpoints under `/orders/`.
 *
 * Note the doubled segment: the orders app is mounted at `/orders/` and its
 * router registers the `orders` viewset inside it, so the collection really
 * does live at `/orders/orders/`.
 */

import { apiFetch, fetchAllPages } from "./client";

const COLLECTION = "/orders/orders/";

/** Order status values, mirroring `Order.Status` on the backend. */
export const ORDER_STATUS = {
  PENDING: "pending",
  PREPARING: "preparing",
  READY: "ready",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const ORDER_STATUS_LABELS = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Customers get their own orders; admins get every order. */
export function fetchOrders() {
  return fetchAllPages(COLLECTION);
}

export function fetchOrder(id) {
  return apiFetch(`${COLLECTION}${id}/`);
}

/**
 * Place an order.
 *
 * `lines` is `[{ menuItemId, quantity }]`. The customer comes from the JWT,
 * and the backend snapshots each item's current price.
 */
export function createOrder({ lines, note = "" }) {
  return apiFetch(COLLECTION, {
    method: "POST",
    body: {
      note,
      items: lines.map(({ menuItemId, quantity }) => ({
        menu_item: menuItemId,
        quantity,
      })),
    },
  });
}

/** Admin-only: advance an order to a new status. */
export function setOrderStatus({ id, status }) {
  return apiFetch(`${COLLECTION}${id}/status/`, {
    method: "PATCH",
    body: { status },
  });
}
