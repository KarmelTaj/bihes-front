import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { colors } from "../theme/colors";
import { fetchMenuItems, recommendMenu } from "../api/menu";
import { ApiError } from "../api/client";
import { useCart } from "../cart/useCart";
//import { useAuth } from "../auth/useAuth";
import { formatPrice } from "../lib/format";

import bbqUrl from "../assets/products/bbq-chicken-pizza.jpg";
import margheritaUrl from "../assets/products/margherita-pizza.jpg";
import pepperoniUrl from "../assets/products/pepperoni-pizza.jpg";
import veggieUrl from "../assets/products/veggie-supreme.jpg";
import FALLBACK_IMAGE from "../assets/Logo.png";

import "./MenuPage.css";
import Navbar from "../components/Navbar";

/* ------------------------------------------------------------
   Icons
------------------------------------------------------------ */

// const CupLogo = () => (
//   <svg
//     viewBox="0 0 48 40"
//     width="34"
//     height="30"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M8 14h26v10a10 10 0 0 1-10 10h-6A10 10 0 0 1 8 24V14Z" />
//     <path d="M34 17h3a5 5 0 0 1 0 10h-3" />
//     <path d="M6 38h30" />
//     <path d="M16 9c0-2 2-2 2-4M23 9c0-2 2-2 2-4M30 9c0-2 2-2 2-4" />
//   </svg>
// );

// const CartIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     width="21"
//     height="21"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="1.7"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <circle cx="9" cy="20" r="1.4" />
//     <circle cx="18" cy="20" r="1.4" />
//     <path d="M2 3h2.5l2.4 12.2a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21 7H6" />
//   </svg>
// );

const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const SparkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m12 3 1.1 3.4a6.2 6.2 0 0 0 4 4L20.5 12l-3.4 1.1a6.2 6.2 0 0 0-4 4L12 20.5l-1.1-3.4a6.2 6.2 0 0 0-4-4L3.5 12l3.4-1.1a6.2 6.2 0 0 0 4-4L12 3Z" />
  </svg>
);

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

const ChevronDown = () => (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/* ------------------------------------------------------------
   Navigation
------------------------------------------------------------ */

// const NAV_LINKS = [
//   { label: "Home", href: "/" },
//   { label: "Menu", href: "/menu" },
//   { label: "About", href: "/#about" },
//   { label: "Pages", href: "#", dropdown: true },
//   { label: "Contact", href: "/#contact" },
// ];

/* ------------------------------------------------------------
   Images
------------------------------------------------------------ */

const FALLBACK_IMAGES = [
  bbqUrl,
  margheritaUrl,
  pepperoniUrl,
  veggieUrl,
];

const productImage = (item, index) =>
  item.image_url || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

/* ------------------------------------------------------------
   Page
------------------------------------------------------------ */

export default function MenuPage() {
  //const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const [aiQuestion, setAiQuestion] = useState("");
  const [aiTokens, setAiTokens] = useState([]);
  const [aiItems, setAiItems] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiHasRun, setAiHasRun] = useState(false);

  const cart = useCart();
  // const { user, isAuthenticated, logout } = useAuth();

  /* ----------------------------------------------------------
     Load menu
  ---------------------------------------------------------- */

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    fetchMenuItems()
      .then((data) => {
        if (!active) return;

        /*
         * Supports both:
         *   [items]
         * and Django REST Framework:
         *   { count, next, previous, results }
         */
        const menuItems = Array.isArray(data)
          ? data
          : data?.results || [];

        setItems(menuItems);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;

        setError(err);
        setItems([]);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  /* ----------------------------------------------------------
     Categories
  ---------------------------------------------------------- */

  const categories = useMemo(() => {
    const map = new Map();

    items.forEach((item) => {
      if (!item.category) return;

      if (!map.has(item.category)) {
        map.set(item.category, {
          id: item.category,
          name: item.category_name || "Other",
        });
      }
    });

    return Array.from(map.values());
  }, [items]);

  /* ----------------------------------------------------------
     Filtering + sorting
  ---------------------------------------------------------- */

  const filteredItems = useMemo(() => {
    let result = items.filter((item) => item.is_available !== false);

    if (activeCategory !== "all") {
      result = result.filter(
        (item) => String(item.category) === String(activeCategory)
      );
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((item) => {
        const name = item.name?.toLowerCase() || "";
        const description = item.description?.toLowerCase() || "";
        const category = item.category_name?.toLowerCase() || "";

        return (
          name.includes(query) ||
          description.includes(query) ||
          category.includes(query)
        );
      });
    }

    if (sort === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sort === "name") {
      result.sort((a, b) =>
        String(a.name).localeCompare(String(b.name))
      );
    }

    return result;
  }, [items, activeCategory, search, sort]);

  /* ----------------------------------------------------------
     Cart
  ---------------------------------------------------------- */

  const addToCart = (item) => {
    cart.add(item);
  };

  const applyRecommendationResponse = (data) => {
    setAiTokens(Array.isArray(data?.tokens) ? data.tokens : []);
    setAiItems(Array.isArray(data?.items) ? data.items : []);
    setAiHasRun(true);
  };

  const askForRecommendation = async (event) => {
    event.preventDefault();
    const question = aiQuestion.trim();
    if (!question || aiLoading) return;

    setAiLoading(true);
    setAiError("");

    try {
      const data = await recommendMenu({ question });
      applyRecommendationResponse(data);
    } catch (err) {
      setAiError(
        err instanceof ApiError
          ? err.messages?.join(" ") || err.message
          : "I couldn't match that request right now."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const rerankWithTokens = async (nextTokens) => {
    setAiTokens(nextTokens);
    setAiError("");
    setAiHasRun(true);

    if (nextTokens.length === 0) {
      setAiItems([]);
      return;
    }

    setAiLoading(true);
    try {
      const data = await recommendMenu({ tokens: nextTokens });
      applyRecommendationResponse(data);
    } catch (err) {
      setAiError(
        err instanceof ApiError
          ? err.messages?.join(" ") || err.message
          : "I couldn't update the recommendations."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const toggleAiToken = (index) => {
    const nextTokens = aiTokens.map((token, tokenIndex) =>
      tokenIndex === index
        ? {
            ...token,
            state: token.state === "excluded" ? "wanted" : "excluded",
          }
        : token
    );
    rerankWithTokens(nextTokens);
  };

  const removeAiToken = (index) => {
    rerankWithTokens(aiTokens.filter((_, tokenIndex) => tokenIndex !== index));
  };

  const clearAiFinder = () => {
    setAiQuestion("");
    setAiTokens([]);
    setAiItems([]);
    setAiError("");
    setAiHasRun(false);
  };

  return (
    <div
      className="menu-page"
      style={{
        "--bg": colors.background,
        "--surface": colors.surface,
        "--card": colors.card,
        "--primary": colors.primary,
        "--primary-dark": colors.primaryDark,
        "--text": colors.text,
        "--text-2": colors.textSecondary,
        "--accent": colors.accent,
      }}
    >
      {/* ======================================================
          Navbar
      ====================================================== */}
      <Navbar />
      {/* <header className="menu-navbar">
        <Link to="/" className="menu-brand">
          <span className="menu-brand-icon">
            <CupLogo />
          </span>

          <span className="menu-brand-name">
            Maison Café
          </span>
        </Link>

        <nav className={`menu-nav-links ${menuOpen ? "is-open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`menu-nav-link ${
                link.label === "Menu" ? "is-active" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}

              {link.dropdown && <ChevronDown />}
            </Link>
          ))}
        </nav>

        <div className="menu-nav-actions">
          <button
            type="button"
            className="menu-cart-btn"
            aria-label={`Cart, ${cart.count} item${
              cart.count === 1 ? "" : "s"
            }`}
            onClick={() => {
              // If you already have a global cart drawer,
              // connect this button to it.
              window.dispatchEvent(new CustomEvent("open-cart"));
            }}
          >
            <CartIcon />
            <span className="menu-cart-badge">
              {cart.count}
            </span>
          </button>

          <Link to="/#contact" className="menu-btn-outline">
            Book a Table
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/orders" className="menu-btn-outline">
                My Orders
              </Link>

              <span
                className="menu-nav-user"
                title={user?.email || undefined}
              >
                {user?.first_name || user?.username}
              </span>

              <button
                type="button"
                className="menu-btn-outline"
                onClick={logout}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="menu-btn-outline menu-login"
              >
                Login
              </Link>

              <Link
                to="/Register"
                className="menu-btn-outline"
              >
                Register
              </Link>
            </>
          )}

          <button
            type="button"
            className="menu-burger"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header> */}

      {/* ======================================================
          Hero
      ====================================================== */}

      <section className="menu-hero">
        <div className="menu-hero-glow" />

        <p className="menu-eyebrow">
          CRAFTED WITH PASSION
        </p>

        <h1 className="menu-title">
          Our <span>Menu</span>
        </h1>

        <p className="menu-description">
          Explore our carefully crafted selection of premium
          coffee, delicious food, and sweet moments.
        </p>
      </section>

      {/* ======================================================
          AI menu finder
      ====================================================== */}

      <section className="menu-ai-section" aria-labelledby="menu-ai-title">
        <div className="menu-ai-card">
          <div className="menu-ai-heading">
            <span className="menu-ai-icon"><SparkIcon /></span>
            <div>
              <p className="menu-ai-kicker">AI MENU FINDER</p>
              <h2 id="menu-ai-title">Tell us what you're craving.</h2>
              <p>
                Describe what you want in your own words. Green chips are things
                you want; red chips are things you want to avoid.
              </p>
            </div>
          </div>

          <form className="menu-ai-form" onSubmit={askForRecommendation}>
            <label className="menu-ai-input-wrap">
              <span className="sr-only">Describe what you want to eat or drink</span>
              <input
                type="text"
                maxLength={500}
                placeholder='Try: "Something chocolate with coffee, but no almond"'
                value={aiQuestion}
                onChange={(event) => setAiQuestion(event.target.value)}
              />
            </label>
            <button
              type="submit"
              className="menu-ai-submit"
              disabled={aiLoading || !aiQuestion.trim()}
            >
              <SparkIcon />
              {aiLoading ? "Finding…" : "Find for me"}
            </button>
          </form>

          {aiError && <p className="menu-ai-error">{aiError}</p>}

          {aiHasRun && (
            <div className="menu-ai-understanding">
              <div className="menu-ai-understanding-title">
                <div>
                  <strong>What we understood</strong>
                  <span>Click a chip to switch want / avoid. Use × to remove it.</span>
                </div>
                <button type="button" className="menu-ai-clear" onClick={clearAiFinder}>
                  Clear
                </button>
              </div>

              {aiTokens.length > 0 ? (
                <div className="menu-ai-tokens" aria-label="Detected preferences">
                  {aiTokens.map((token, index) => (
                    <div
                      key={`${token.kind || "token"}-${token.value}-${index}`}
                      className={`menu-ai-token ${
                        token.state === "excluded" ? "is-excluded" : "is-wanted"
                      }`}
                    >
                      <button
                        type="button"
                        className="menu-ai-token-toggle"
                        onClick={() => toggleAiToken(index)}
                        aria-label={`${token.label || token.value}: ${
                          token.state === "excluded" ? "avoid" : "wanted"
                        }. Click to toggle.`}
                      >
                        <span className="menu-ai-token-status">
                          {token.state === "excluded" ? "−" : "✓"}
                        </span>
                        <span>{token.label || token.value}</span>
                      </button>
                      <button
                        type="button"
                        className="menu-ai-token-remove"
                        onClick={() => removeAiToken(index)}
                        aria-label={`Remove ${token.label || token.value}`}
                        title="Remove token"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="menu-ai-empty-copy">
                  No editable preferences are selected. Ask another question to start again.
                </p>
              )}
            </div>
          )}

          {aiHasRun && aiTokens.length > 0 && (
            <div className="menu-ai-recommendations">
              <div className="menu-ai-results-heading">
                <div>
                  <p className="menu-ai-kicker">BEST MATCHES</p>
                  <h3>Recommended for you</h3>
                </div>
                {aiLoading && <span className="menu-ai-updating">Updating…</span>}
              </div>

              {!aiLoading && aiItems.length === 0 ? (
                <p className="menu-ai-no-match">
                  No current menu item matches those preferences. Try removing or
                  changing one of the chips.
                </p>
              ) : (
                <div className="menu-ai-results">
                  {aiItems.map((item, index) => (
                    <article key={item.id} className="menu-ai-result-card">
                      <img
                        src={productImage(item, index)}
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                      <div className="menu-ai-result-body">
                        <div className="menu-ai-result-meta">
                          <span>{item.category_name || "Menu"}</span>
                          <span>{formatPrice(item.price)}</span>
                        </div>
                        <h4>{item.name}</h4>
                        <p>{item.description || "A Maison Café favorite."}</p>
                        {item.matched_tokens?.length > 0 && (
                          <div className="menu-ai-match-line">
                            Matches {item.matched_tokens.map((token) => token.replaceAll("_", " ")).join(", ")}
                          </div>
                        )}
                        <button
                          type="button"
                          className="menu-ai-add"
                          onClick={() => addToCart(item)}
                        >
                          <PlusIcon /> Add to cart
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ======================================================
          Menu controls
      ====================================================== */}

      <section className="menu-content">
        <div className="menu-controls">
          <div className="category-tabs">
            <button
              type="button"
              className={`category-tab ${
                activeCategory === "all" ? "is-active" : ""
              }`}
              onClick={() => setActiveCategory("all")}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                className={`category-tab ${
                  String(activeCategory) === String(category.id)
                    ? "is-active"
                    : ""
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="menu-tools">
            <label className="menu-search">
              <SearchIcon />

              <input
                type="search"
                placeholder="Search menu..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </label>

            <label className="menu-sort">
              <span>Sort</span>

              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value)
                }
              >
                <option value="default">Recommended</option>
                <option value="name">Name</option>
                <option value="price-low">
                  Price: Low to High
                </option>
                <option value="price-high">
                  Price: High to Low
                </option>
              </select>

              <ChevronDown />
            </label>
          </div>
        </div>

        {/* ====================================================
            Loading
        ==================================================== */}

        {loading && (
          <div className="menu-state">
            <div className="menu-loader" />
            <p>Preparing the menu…</p>
          </div>
        )}

        {/* ====================================================
            Error
        ==================================================== */}

        {!loading && error && (
          <div className="menu-state menu-state-error">
            <h3>We couldn't load the menu</h3>

            <p>
              {error instanceof ApiError
                ? error.messages?.join(" ")
                : "Please try again in a moment."}
            </p>

            <button
              type="button"
              className="menu-btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ====================================================
            Empty
        ==================================================== */}

        {!loading &&
          !error &&
          filteredItems.length === 0 && (
            <div className="menu-state">
              <div className="empty-icon">☕</div>

              <h3>No items found</h3>

              <p>
                Try another category or search for something
                else.
              </p>

              <button
                type="button"
                className="menu-btn-primary"
                onClick={() => {
                  setActiveCategory("all");
                  setSearch("");
                }}
              >
                Show All Items
              </button>
            </div>
          )}

        {/* ====================================================
            Products
        ==================================================== */}

        {!loading &&
          !error &&
          filteredItems.length > 0 && (
            <div className="menu-grid">
              {filteredItems.map((item, index) => (
                <article
                  key={item.id}
                  className="menu-product-card"
                >
                  <div className="menu-product-media">
                    <img
                      src={productImage(item, index)}
                      alt={item.name}
                      className="menu-product-img"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          FALLBACK_IMAGE;
                      }}
                    />

                    {item.category_name && (
                      <span className="menu-product-category">
                        {item.category_name}
                      </span>
                    )}
                  </div>

                  <div className="menu-product-info">
                    <h2 className="menu-product-name">
                      {item.name}
                    </h2>

                    <p className="menu-product-description">
                      {item.description ||
                        "A Maison Café favorite, crafted with care."}
                    </p>

                    <div className="menu-product-footer">
                      <span className="menu-price">
                        {formatPrice(item.price)}
                      </span>

                      <button
                        type="button"
                        className="menu-add-btn"
                        onClick={() => addToCart(item)}
                        aria-label={`Add ${item.name} to cart`}
                      >
                        <PlusIcon />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>

      {/* ======================================================
          Bottom CTA
      ====================================================== */}

      <section className="menu-cta">
        <div className="menu-cta-glow" />

        <p className="menu-eyebrow">
          YOUR TABLE IS WAITING
        </p>

        <h2>
          Make it a moment
          <br />
          <span>to remember.</span>
        </h2>

        <p>
          Come enjoy our coffee, food, and cozy atmosphere
          with the people you love.
        </p>

        <Link to="/#contact" className="menu-btn-primary">
          Book a Table
        </Link>
      </section>
    </div>
  );
}

