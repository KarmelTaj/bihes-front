
const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/+$/, "");

const ACCESS_KEY = "bihes.access";
const REFRESH_KEY = "bihes.refresh";

/* ---------------- Token storage ---------------- */


function readToken(key) {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key);
}

export const tokenStore = {
  get access() {
    return readToken(ACCESS_KEY);
  },

  get refresh() {
    return readToken(REFRESH_KEY);
  },

  save({ access, refresh }, { remember = true } = {}) {
    this.clear();
    const store = remember ? localStorage : sessionStorage;
    store.setItem(ACCESS_KEY, access);
    store.setItem(REFRESH_KEY, refresh);
  },

  /** Replace just the access token, leaving it wherever the pair already lives. */
  saveAccess(access) {
    const store = localStorage.getItem(REFRESH_KEY) ? localStorage : sessionStorage;
    store.setItem(ACCESS_KEY, access);
  },

  clear() {
    for (const store of [localStorage, sessionStorage]) {
      store.removeItem(ACCESS_KEY);
      store.removeItem(REFRESH_KEY);
    }
  },
};

/* ---------------- Session expiry notifications ---------------- */

// AuthContext subscribes so it can drop the current user when a refresh fails.
const expiryListeners = new Set();

export function onSessionExpired(listener) {
  expiryListeners.add(listener);
  return () => expiryListeners.delete(listener);
}

function notifySessionExpired() {
  for (const listener of expiryListeners) listener();
}

/* ---------------- Errors ---------------- */


export class ApiError extends Error {
  constructor({ status, requestId = null, fieldErrors = {}, generalErrors = [] }) {
    super(generalErrors[0] ?? "Something went wrong. Please try again.");
    this.name = "ApiError";
    this.status = status;
    this.requestId = requestId;
    this.fieldErrors = fieldErrors;
    this.generalErrors = generalErrors;
  }

  /** First error message attached to `field`, if the backend reported one. */
  fieldError(field) {
    return this.fieldErrors[field]?.[0];
  }

  /**
   * Every message worth showing. Field errors are included so a form never
   * silently swallows the real reason a request failed.
   */
  get messages() {
    return [...this.generalErrors, ...Object.values(this.fieldErrors).flat()];
  }
}

async function toApiError(response) {
  let payload;
  try {
    payload = await response.json();
  } catch {
    // A non-JSON body means something upstream of DRF failed — a Django debug
    // page, or the dev proxy with no backend behind it.
    return new ApiError({
      status: response.status,
      generalErrors: [`The API returned an unexpected ${response.status} response.`],
    });
  }

  return new ApiError({
    status: response.status,
    requestId: payload?.request_id ?? null,
    fieldErrors: payload?.field_errors ?? {},
    generalErrors: payload?.general_errors ?? [],
  });
}

/* ---------------- Requests ---------------- */

async function sendRequest(path, { method = "GET", body, token, signal } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    return await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (cause) {
    if (cause.name === "AbortError") throw cause;
    throw new ApiError({
      status: 0,
      generalErrors: [
        "Cannot reach the API. Is the Django server running on port 8000?",
      ],
    });
  }
}


let refreshInFlight = null;

async function performRefresh() {
  const refresh = tokenStore.refresh;
  if (!refresh) return null;

  const response = await sendRequest("/accounts/auth/login/refresh/", {
    method: "POST",
    body: { refresh },
  });

  if (!response.ok) {
    // The refresh token is expired or blacklisted — the session is over.
    tokenStore.clear();
    notifySessionExpired();
    return null;
  }

  const { access } = await response.json();
  tokenStore.saveAccess(access);
  return access;
}

function refreshAccessToken() {
  if (!refreshInFlight) {
    refreshInFlight = performRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}


export async function apiFetch(path, { auth = true, ...options } = {}) {
  let response = await sendRequest(path, {
    ...options,
    token: auth ? tokenStore.access : undefined,
  });

  if (response.status === 401 && auth && tokenStore.refresh) {
    const access = await refreshAccessToken();
    if (access) {
      response = await sendRequest(path, { ...options, token: access });
    }
  }

  if (!response.ok) throw await toApiError(response);
  if (response.status === 204) return null;

  return response.json();
}

/* ---------------- Pagination ---------------- */

function withQuery(path, params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }
  const suffix = query.toString();
  return suffix ? `${path}?${suffix}` : path;
}


export async function fetchAllPages(path, { params = {}, ...options } = {}) {
  const results = [];

  for (let page = 1; ; page += 1) {
    const data = await apiFetch(withQuery(path, { ...params, page }), options);

    // A viewset with pagination disabled returns a bare array.
    if (Array.isArray(data)) return data;

    results.push(...(data.results ?? []));
    if (!data.next) return results;
  }
}

export { withQuery };
