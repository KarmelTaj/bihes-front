import { useContext } from "react";

import { CartContext } from "./context";

/** The in-progress order: its lines, totals, and how to submit it. */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside a <CartProvider>.");
  return context;
}
