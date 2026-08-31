import { useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../cart/useCart";
import { useAuth } from "../auth/useAuth";
import { ApiError } from "../api/client";
import { formatPrice } from "../lib/format";

import "./CartDrawer.css";
import ProductImage from "./ProductImage";

/* ============================================================
   Icons
   ============================================================ */

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </svg>
);

/* ============================================================
   Product image
   ============================================================ */

// function ProductImage({
//   src,
//   alt,
//   ...props
// }) {
//   return (
//     <img
//       src={src}
//       alt={alt}
//       {...props}
//       onError={(event) => {
//         event.currentTarget.onerror = null;
//         event.currentTarget.style.display =
//           "none";
//       }}
//     />
//   );
// }

/* ============================================================
   Cart Drawer
   ============================================================ */

export default function CartDrawer({ onClose }) {
  const { lines, total, isEmpty, setQuantity, remove, placeOrder } = useCart();
  const { isAuthenticated } = useAuth();
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const handlePlaceOrder = async () => {
    setError(null);
    setPlacing(true);

    try {
      setConfirmation(await placeOrder(note.trim()));
      setNote("");
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.messages.join(" ")
          : "Could not place the order. Please try again.",
      );
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="cart-overlay" role="dialog" aria-label="Your order">
      <button
        type="button"
        className="cart-scrim"
        aria-label="Close cart"
        onClick={onClose}
      />

      <aside className="cart-drawer">
        <header className="cart-header">
          <h3>Your order</h3>
          <button type="button" className="cart-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </header>

        {confirmation ? (
          <div className="cart-body">
            <p className="cart-success">
              Order #{confirmation.id} placed — {formatPrice(confirmation.total_price)}
            </p>
            <p className="cart-hint">
              Status: {confirmation.status}. Track it on your{" "}
              <Link to="/orders">orders page</Link>.
            </p>
          </div>
        ) : isEmpty ? (
          <div className="cart-body">
            <p className="cart-hint">Your cart is empty. Add something from the menu.</p>
          </div>
        ) : (
          <>
            <div className="cart-body">
              <ul className="cart-lines">
                {lines.map(({ item, quantity }) => (
                  <li key={item.id} className="cart-line">
                    <div className="cart-line-main">
                      <ProductImage
                        className="cart-line-image"
                        src={item.image_url}
                        alt={item.name}
                      />

                      <div className="cart-line-info">
                        <span className="cart-line-name">{item.name}</span>
                        <span className="cart-line-price">
                          {formatPrice(Number(item.price) * quantity)}
                        </span>
                      </div>
                    </div>

                    <div className="cart-line-controls">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, quantity - 1)}
                        aria-label={`Decrease ${item.name}`}
                      >
                        −
                      </button>
                      <span className="cart-qty">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, quantity + 1)}
                        aria-label={`Increase ${item.name}`}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() => remove(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <label className="cart-note">
                <span>Note for the kitchen</span>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional"
                />
              </label>
            </div>

            <footer className="cart-footer">
              {error && <p className="cart-error" role="alert">{error}</p>}

              <div className="cart-total">
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              {isAuthenticated ? (
                <button
                  type="button"
                  className="btn-primary cart-submit"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing ? "Placing order…" : "Place order"}
                </button>
              ) : (
                <Link to="/login" className="btn-primary cart-submit">
                  Log in to order
                </Link>
              )}
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

