import { createContext } from "react";

/**
 * Kept apart from CartContext.jsx so that file exports only the provider
 * component — a module mixing components with other exports breaks Fast Refresh.
 */
export const CartContext = createContext(null);
