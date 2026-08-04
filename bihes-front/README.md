# bihes-front

React + Vite storefront for the [Bihes API](../../bihes-back) — a Django REST
Framework backend with JWT auth, a menu, and orders.

## Running locally

Two processes. Start the backend first:

```bash
cd ../../bihes-back
./.venv/bin/python manage.py migrate
./.venv/bin/python manage.py seed_demo     # demo accounts + a small menu
./.venv/bin/python manage.py runserver     # http://127.0.0.1:8000
```

Then the frontend:

```bash
npm install
npm run dev                                # http://localhost:5173
```

Sign in with either seeded account — password `demo12345`:

| Account    | Role     | Sees                                  |
| ---------- | -------- | ------------------------------------- |
| `customer` | customer | own orders                            |
| `admin`    | admin    | every order, and can change statuses  |

Login accepts a username or the account's email address.

## How the two connect

The dev server proxies `/api/*` to `http://127.0.0.1:8000` (see
[vite.config.js](vite.config.js)), so every request is same-origin and the
backend needs no CORS configuration. Override the target with
`VITE_API_PROXY_TARGET`, or point the app at an absolute API host for a
deployed build with `VITE_API_BASE_URL` — see [.env.example](.env.example).

## Layout

```
src/
  api/         one module per backend app, over a shared fetch client
    client.js  base URL, JWT storage, refresh-on-401, error envelope → ApiError
    auth.js    /accounts/auth/  — register, login, me
    menu.js    /menu/           — categories, menu items
    orders.js  /orders/orders/  — list, create, admin status change
  auth/        AuthProvider + useAuth: who is signed in
  cart/        CartProvider + useCart: the in-progress order
  routes/      RequireAuth gate
  pages/       Home, Login, Register, Orders
```

Two conventions worth knowing:

- **Errors.** Every failed call throws an `ApiError` carrying the backend's
  envelope (`field_errors` / `general_errors`), so forms can show a message
  against the right input via `error.fieldError("username")`.
- **Tokens.** Held in `localStorage` when "Remember me" is ticked and
  `sessionStorage` otherwise. An expired access token is refreshed once,
  transparently; if the refresh fails the session is cleared.

## Scripts

```bash
npm run dev       # dev server with HMR
npm run build     # production build to dist/
npm run preview   # serve the build
npm run lint      # eslint
```
