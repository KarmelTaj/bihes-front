import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useCart } from "../cart/useCart";

import CartDrawer from "./CartDrawer";
import "./Navbar.css";

/* ---------------- Icons ---------------- */

const CupLogo = () => (
  <svg viewBox="0 0 48 40" width="34" height="30" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 14h26v10a10 10 0 0 1-10 10h-6A10 10 0 0 1 8 24V14Z" />
    <path d="M34 17h3a5 5 0 0 1 0 10h-3" />
    <path d="M6 38h30" />
    <path d="M16 9c0-2 2-2 2-4M23 9c0-2 2-2 2-4M30 9c0-2 2-2 2-4" />
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);


const CartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="21"
    height="21"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2 3h2.5l2.4 12.2a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21 7H6" />
  </svg>
);

/* ---------------- Navigation ---------------- */

const NAV_LINKS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Menu",
    href: "/menu",
  },
  {
    label: "About",
    href: "/#about",
  },
  {
    label: "Pages",
    href: "#pages",
    dropdown: true,
  },
  {
    label: "Contact",
    href: "/#contact",
  },
];

/* ---------------- Component ---------------- */

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleOpenCart = () => {
      setCartOpen(true);
    };

    window.addEventListener("open-cart", handleOpenCart);

    return () => {
      window.removeEventListener("open-cart", handleOpenCart);
    };
  }, []);


  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const cart = useCart();
  const location = useLocation();

  const isActive = (label) => {
    if (label === "Home") {
      return location.pathname === "/";
    }

    if (label === "Menu") {
      return location.pathname === "/menu";
    }

    return false;
  };

  return (
    <>
      <header className="navbar">
        {/* ---------- Brand ---------- */}

        <Link
          to="/"
          className="brand"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-icon">
            <CupLogo />
          </span>

          <span className="brand-name">
            Maison Café
          </span>
        </Link>

        {/* ---------- Navigation ---------- */}

        <nav
          className={`nav-links ${
            menuOpen ? "is-open" : ""
          }`}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`nav-link ${
                isActive(link.label)
                  ? "is-active"
                  : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}

              {link.dropdown && <ChevronDown />}
            </Link>
          ))}
        </nav>

        {/* ---------- Actions ---------- */}

        <div className="nav-actions">

          {/* Cart */}

          <button
            type="button"
            className="cart-btn"
            aria-label={`Cart, ${cart.count} item${
              cart.count === 1 ? "" : "s"
            }`}
            onClick={() => setCartOpen(true)}
          >
            <CartIcon />

            <span className="cart-badge">
              {cart.count}
            </span>
          </button>

          {/* Book table */}

          <Link
            to="/#contact"
            className="btn-outline"
          >
            Book a Table
          </Link>

          {/* Authentication */}

          {isAuthenticated ? (
            <>
              <Link
                to="/orders"
                className="btn-outline"
              >
                My Orders
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="btn-outline"
                >
                  Admin Panel
                </Link>
              )}

              <span
                className="nav-user"
                title={user?.email || undefined}
              >
                {user?.first_name ||
                  user?.username}
              </span>

              <button
                type="button"
                className="btn-outline"
                onClick={logout}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-outline btn-login"
              >
                Login
              </Link>

              <Link
                to="/Register"
                className="btn-outline btn-Register"
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile */}

          <button
            type="button"
            className="burger"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() =>
              setMenuOpen((open) => !open)
            }
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* ---------- Shared cart ---------- */}

      {cartOpen && (
        <CartDrawer
          onClose={() => setCartOpen(false)}
        />
      )}
    </>
  );
}
  