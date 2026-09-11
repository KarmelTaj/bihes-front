/** Endpoints under `/menu/`. Reads are public; writes require an admin. */

import { apiFetch, fetchAllPages } from "./client";


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


export function createCategory(fields) {
  return apiFetch("/menu/categories/", { method: "POST", body: fields });
}

export function updateCategory(id, fields) {
  return apiFetch(`/menu/categories/${id}/`, { method: "PATCH", body: fields });
}

export function deleteCategory(id) {
  return apiFetch(`/menu/categories/${id}/`, { method: "DELETE" });
}



export function recommendMenu(payload) {
  return apiFetch("/menu/recommend/", {
    method: "POST",
    body: payload,
    auth: false,
  });
}
