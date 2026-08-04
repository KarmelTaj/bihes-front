import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { colors } from "../theme/colors";
import { ApiError } from "../api/client";
import { fetchOrders, setOrderStatus, ORDER_STATUS_LABELS } from "../api/orders";
import { useAuth } from "../auth/useAuth";
import { formatDateTime, formatPrice } from "../lib/format";
import "./Orders.css";

const STATUS_VALUES = Object.keys(ORDER_STATUS_LABELS);

export default function OrdersPage() {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Ids currently mid-status-change, so their control can disable itself.
  const [updating, setUpdating] = useState([]);
  // Bumped by Refresh to re-run the fetch effect.
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let active = true;

    fetchOrders()
      .then((data) => {
        if (!active) return;
        setOrders(data);
        setError(null);
      })
      .catch((cause) => active && setError(cause))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [reloadCount]);

  const reload = useCallback(() => {
    setLoading(true);
    setReloadCount((count) => count + 1);
  }, []);

  const changeStatus = async (id, status) => {
    setUpdating((current) => [...current, id]);
    setError(null);

    try {
      const updated = await setOrderStatus({ id, status });
      setOrders((current) =>
        current.map((order) => (order.id === id ? updated : order)),
      );
    } catch (cause) {
      setError(cause);
    } finally {
      setUpdating((current) => current.filter((pending) => pending !== id));
    }
  };

  return (
    <div
      className="orders-page"
      style={{
        "--bg": colors.background,
        "--surface": colors.surface,
        "--card": colors.card,
        "--primary": colors.primary,
        "--text": colors.text,
        "--text-2": colors.textSecondary,
      }}
    >
      <header className="orders-header">
        <div>
          <h1>{isAdmin ? "All orders" : "My orders"}</h1>
          <p className="orders-subtitle">
            Signed in as {user?.username}
            {isAdmin && " · admin"}
          </p>
        </div>

        <div className="orders-actions">
          <button type="button" className="orders-btn" onClick={reload} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <Link to="/" className="orders-btn">
            Back to menu
          </Link>
        </div>
      </header>

      {error && (
        <p className="orders-alert" role="alert">
          {error instanceof ApiError
            ? error.messages.join(" ")
            : "Could not load your orders."}
        </p>
      )}

      {loading && orders.length === 0 && <p className="orders-empty">Loading…</p>}

      {!loading && orders.length === 0 && !error && (
        <p className="orders-empty">
          No orders yet. <Link to="/">Browse the menu</Link> to place one.
        </p>
      )}

      <ul className="orders-list">
        {orders.map((order) => (
          <li key={order.id} className="order-card">
            <div className="order-top">
              <div>
                <h2 className="order-id">Order #{order.id}</h2>
                <p className="order-meta">
                  {formatDateTime(order.created_at)}
                  {isAdmin && ` · ${order.customer_username}`}
                </p>
              </div>

              <div className="order-top-right">
                <span className={`order-status is-${order.status}`}>
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </span>
                <span className="order-total">{formatPrice(order.total_price)}</span>
              </div>
            </div>

            <ul className="order-items">
              {order.items.map((line) => (
                <li key={line.id}>
                  <span>
                    {line.quantity} × {line.menu_item_name}
                  </span>
                  <span>{formatPrice(line.subtotal)}</span>
                </li>
              ))}
            </ul>

            {order.note && <p className="order-note">“{order.note}”</p>}

            {isAdmin && (
              <label className="order-status-control">
                <span>Set status</span>
                <select
                  value={order.status}
                  disabled={updating.includes(order.id)}
                  onChange={(e) => changeStatus(order.id, e.target.value)}
                >
                  {STATUS_VALUES.map((value) => (
                    <option key={value} value={value}>
                      {ORDER_STATUS_LABELS[value]}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
