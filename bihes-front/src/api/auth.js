/** Endpoints under `/accounts/auth/` — registration, JWT login, own profile. */

import { apiFetch, tokenStore } from "./client";

/**
 * Exchange credentials for a JWT pair.
 *
 * `identifier` may be a username or an email address; the backend's
 * RoleTokenObtainPairSerializer resolves an email to its owner's username.
 * Pass `remember: false` to keep the session in sessionStorage only.
 */
export async function login({ identifier, password, remember = true }) {
  const tokens = await apiFetch("/accounts/auth/login/", {
    method: "POST",
    auth: false,
    body: { username: identifier, password },
  });

  tokenStore.save(tokens, { remember });
  return tokens;
}

/** Self-service registration. Always creates a customer-role account. */
export function register({ username, email, password, firstName = "", lastName = "" }) {
  return apiFetch("/accounts/auth/register/", {
    method: "POST",
    auth: false,
    body: {
      username,
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    },
  });
}

/** The authenticated user's own profile. */
export function fetchMe() {
  return apiFetch("/accounts/auth/me/");
}

export function updateMe(fields) {
  return apiFetch("/accounts/auth/me/", { method: "PATCH", body: fields });
}

export function logout() {
  tokenStore.clear();
}
