import { useEffect, useMemo, useState } from "react";
import "./MenuPage.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

// Pulls every page of a paginated DRF list endpoint
async function fetchAll(url) {
  const out = [];
  let next = url;
  while (next) {
    const res = await fetch(next);
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    out.push(...(data.results || []));
    next = data.next;
  }
  return out;
}

const formatPrice = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return value ?? "";
  return `${n.toLocaleString("fa-IR")} تومان`;
};

export default function MenuPage({ onAddToCart }) {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const [cats, menuItems] = await Promise.all([
          fetchAll(`${API_BASE}/menu/categories/`),
          fetchAll(`${API_BASE}/menu/menu-items/?is_available=true`),
        ]);
        if (cancelled) return;
        setCategories(cats);
        setItems(menuItems);
      } catch (err) {
        if (!cancelled) setError(err.message || "خطا در دریافت منو");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => {
      const cat = item.category;
      const id = typeof cat === "object" && cat !== null ? cat.id : cat;
      return String(id) === String(activeCategory);
    });
  }, [items, activeCategory]);

  return (
    <main className="menu-page">
      <header className="menu-header">
        <h1 className="menu-title">منوی بیهس</h1>
        <p className="menu-subtitle">
          هر فنجان، حاصل انتخاب دقیق دانه و دمِ درست.
        </p>
      </header>

      {categories.length > 0 && (
        <nav className="menu-filters" aria-label="دسته‌بندی منو">
          <button
            type="button"
            className={`filter-chip ${activeCategory === "all" ? "is-active" : ""}`}
            onClick={() => setActiveCategory("all")}
            aria-pressed={activeCategory === "all"}
          >
            همه
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-chip ${String(activeCategory) === String(cat.id) ? "is-active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={String(activeCategory) === String(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </nav>
      )}

      {loading && <div className="loading">در حال بارگذاری منو…</div>}

      {!loading && error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && visibleItems.length === 0 && (
        <div className="empty">فعلاً موردی در این دسته موجود نیست.</div>
      )}

      {!loading && !error && visibleItems.length > 0 && (
        <section className="menu-grid">
          {visibleItems.map((item) => (
            <article className="product-card" key={item.id}>
              <div className="product-media">
                {item.image || item.image_url ? (
                  <img
                    className="product-img"
                    src={item.image || item.image_url}
                    alt={item.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="product-img product-img--fallback" aria-hidden="true" />
                )}
              </div>

              <div className="product-info">
                <h3 className="product-name">{item.name}</h3>
                {item.description && (
                  <p className="product-desc">{item.description}</p>
                )}
              </div>

              <div className="product-footer">
                <span className="price">{formatPrice(item.price)}</span>
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => onAddToCart?.(item)}
                  disabled={item.is_available === false}
                >
                  {item.is_available === false ? "ناموجود" : "افزودن به سبد"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
