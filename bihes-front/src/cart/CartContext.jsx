/**
 * The in-progress order.
 *
 * Lines are held client-side until checkout; `placeOrder` is the only thing
 * that touches the API. Prices arrive from DRF as decimal *strings*, so they
 * are parsed once here and totals are computed in cents to avoid float drift.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import * as ordersApi from "../api/orders";
import { useAuth } from "../auth/useAuth";
import { CartContext } from "./context";

function toCents(price) {
  return Math.round(Number(price) * 100);
}

export function CartProvider({ children }) {
  // [{ item, quantity }] — `item` is the menu item as the API returned it.
  const [lines, setLines] = useState([]);
  const { isAuthenticated } = useAuth();
  const wasAuthenticated = useRef(isAuthenticated);

  // Drop the cart on sign-out, but keep it when a guest signs in to check out.
  useEffect(() => {
    if (wasAuthenticated.current && !isAuthenticated) setLines([]);
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  const add = useCallback((item, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.item.id === item.id);
      if (!existing) return [...current, { item, quantity }];

      return current.map((line) =>
        line.item.id === item.id
          ? { ...line, quantity: line.quantity + quantity }
          : line,
      );
    });
  }, []);

  const setQuantity = useCallback((itemId, quantity) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.item.id !== itemId)
        : current.map((line) =>
            line.item.id === itemId ? { ...line, quantity } : line,
          ),
    );
  }, []);

  const remove = useCallback((itemId) => {
    setLines((current) => current.filter((line) => line.item.id !== itemId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const placeOrder = useCallback(
    async (note = "") => {
      const order = await ordersApi.createOrder({
        lines: lines.map((line) => ({
          menuItemId: line.item.id,
          quantity: line.quantity,
        })),
        note,
      });
      setLines([]);
      return order;
    },
    [lines],
  );

  const value = useMemo(() => {
    const totalCents = lines.reduce(
      (sum, line) => sum + toCents(line.item.price) * line.quantity,
      0,
    );

    return {
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      total: totalCents / 100,
      isEmpty: lines.length === 0,
      add,
      setQuantity,
      remove,
      clear,
      placeOrder,
    };
  }, [lines, add, setQuantity, remove, clear, placeOrder]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
