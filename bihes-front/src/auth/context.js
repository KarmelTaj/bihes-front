import { createContext } from "react";

/**
 * Kept apart from AuthContext.jsx so that file exports only the provider
 * component — a module mixing components with other exports breaks Fast Refresh.
 */
export const AuthContext = createContext(null);
