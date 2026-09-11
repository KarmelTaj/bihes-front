
import { apiFetch, tokenStore } from "./client";


export async function login({ identifier, password, remember = true }) {
  const tokens = await apiFetch("/accounts/auth/login/", {
    method: "POST",
    auth: false,
    body: { username: identifier, password },
  });

  tokenStore.save(tokens, { remember });
  return tokens;
}

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

export function fetchMe() {
  return apiFetch("/accounts/auth/me/");
}

export function updateMe(fields) {
  return apiFetch("/accounts/auth/me/", { method: "PATCH", body: fields });
}

export function logout() {
  tokenStore.clear();
}
