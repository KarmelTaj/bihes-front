/**
 * Holds the signed-in user for the whole app.
 *
 * Tokens live in the client's tokenStore; this context owns the *user* those
 * tokens represent, restores the session on a page reload, and clears itself
 * when a refresh fails.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import * as authApi from "../api/auth";
import { onSessionExpired, tokenStore } from "../api/client";
import { AuthContext } from "./context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "loading" until we know whether a stored token still identifies someone —
  // routes that redirect on anonymity must not act before that resolves.
  const [status, setStatus] = useState(tokenStore.access ? "loading" : "anonymous");

  // Restore the session on mount when a token is already in storage.
  useEffect(() => {
    if (!tokenStore.access) return undefined;

    let active = true;

    authApi
      .fetchMe()
      .then((profile) => {
        if (!active) return;
        setUser(profile);
        setStatus("authenticated");
      })
      .catch(() => {
        if (!active) return;
        // Token is unusable and could not be refreshed.
        tokenStore.clear();
        setUser(null);
        setStatus("anonymous");
      });

    return () => {
      active = false;
    };
  }, []);

  // A refresh failing mid-session logs the user out from under us.
  useEffect(
    () =>
      onSessionExpired(() => {
        setUser(null);
        setStatus("anonymous");
      }),
    [],
  );

  const login = useCallback(async ({ identifier, password, remember }) => {
    await authApi.login({ identifier, password, remember });
    const profile = await authApi.fetchMe();
    setUser(profile);
    setStatus("authenticated");
    return profile;
  }, []);

  const register = useCallback(
    async ({ username, email, password, firstName, lastName }) => {
      await authApi.register({ username, email, password, firstName, lastName });
      // Registration returns the new user but no tokens, so sign them straight in.
      return login({ identifier: username, password, remember: true });
    },
    [login],
  );

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setStatus("anonymous");
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
    }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
