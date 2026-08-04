import { useContext } from "react";

import { AuthContext } from "./context";

/** The signed-in user and the actions that change who that is. */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an <AuthProvider>.");
  return context;
}
