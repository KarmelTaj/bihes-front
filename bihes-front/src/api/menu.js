/** Endpoints under `/menu/`. Reads are public; writes require an admin. */

import { apiFetch, fetchAllPages } from "./client";

/**
 * Menu items, newest page-set flattened into one array.
 *
 * Reads are anonymous-friendly (`auth: false` skips the Authorization header
 * so a stale token can't turn a public list into a 401), and the default
 * filter hides items an admin has marked unavailable.
 */
export function fetchMenuItems({ available = true, category } = {}) {
  return fetchAllPages("/menu/menu-items/", {
    auth: false,
    params: {
      is_available: available === undefined ? undefined : String(available),
      category,
    },
  });
}

/** Categories, each with its nested `items`. */
export function fetchCategories({ active = true } = {}) {
  return fetchAllPages("/menu/categories/", {
    auth: false,
    params: { is_active: active === undefined ? undefined : String(active) },
  });
}

/* ---- Admin-only writes ---- */

export function createMenuItem(fields) {
  return apiFetch("/menu/menu-items/", { method: "POST", body: fields });
}

export function updateMenuItem(id, fields) {
  return apiFetch(`/menu/menu-items/${id}/`, { method: "PATCH", body: fields });
}

export function deleteMenuItem(id) {
  return apiFetch(`/menu/menu-items/${id}/`, { method: "DELETE" });
}
