import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { colors } from "../theme/colors";
import { fetchMenuItems } from "../api/menu";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { useCart } from "../cart/useCart";
import { formatPrice } from "../lib/format";
import cupUrl from "../assets/cup.png";
import bbqUrl from "../assets/products/bbq-chicken-pizza.jpg";
import margheritaUrl from "../assets/products/margherita-pizza.jpg";
import pepperoniUrl from "../assets/products/pepperoni-pizza.jpg";
import veggieUrl from "../assets/products/veggie-supreme.jpg";
import "./Home.css";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import ProductImage from "../components/ProductImage";
/* ---------------- Icons ---------------- */

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

// const CartIcon = () => (
//   <svg viewBox="0 0 24 24" width="21" height="21" fill="none"
//     stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
//     <circle cx="9" cy="20" r="1.4" />
//     <circle cx="18" cy="20" r="1.4" />
//     <path d="M2 3h2.5l2.4 12.2a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21 7H6" />
//   </svg>
// );

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

// const CloseIcon = () => (
//   <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
//     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//     <path d="m6 6 12 12M18 6 6 18" />
//   </svg>
// );

const BeanIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <ellipse cx="12" cy="12" rx="9" ry="6" transform="rotate(-40 12 12)" />
    <path d="M8 16q4-4 8-8" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 19a6.5 6.5 0 0 1 13 0" />
    <path d="M16 5.5a3.2 3.2 0 0 1 0 6.2" />
    <path d="M17.5 14.2A6.5 6.5 0 0 1 21.5 19" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

const SmallCupIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9h12v5a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V9Z" />
    <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16" />
    <path d="M3 22h14" />
    <path d="M8 6c0-1.2 1-1.2 1-2.5M12 6c0-1.2 1-1.2 1-2.5" />
  </svg>
);

/* ---------------- Data ---------------- */

// const NAV_LINKS = [
//   { label: "Home", href: "#home" },
//   { label: "Menu", href: "#menu" },
//   { label: "About", href: "#about" },
//   { label: "Pages", href: "#pages", dropdown: true },
//   { label: "Contact", href: "#contact" },
// ];

// MenuItem.image_url is optional on the backend, so seeded items arrive
// without a picture. Fall back to the bundled shots, cycled by position.
const FALLBACK_IMAGES = [bbqUrl, margheritaUrl, pepperoniUrl, veggieUrl];

const productImage = (item, index) =>
  item.image_url || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

const STATS = [
  { icon: <SmallCupIcon />, value: "10+", label: "Years of Experience" },
  { icon: <BeanIcon />, value: "100%", label: "Premium Quality" },
  { icon: <UsersIcon />, value: "12K+", label: "Happy Customers" },
  { icon: <PinIcon />, value: "5", label: "Branches Worldwide" },
];

/* ---------------- Menu loading ---------------- */

/** Available menu items from the API, plus the states the UI has to render. */
function useMenuItems() {
  const [state, setState] = useState({ items: [], loading: true, error: null });

  useEffect(() => {
    let active = true;

    fetchMenuItems()
      .then((items) => active && setState({ items, loading: false, error: null }))
      .catch((error) => active && setState({ items: [], loading: false, error }));

    return () => {
      active = false;
    };
  }, []);

  return state;
}


// function ProductImage({ src, alt, ...props }) {
//   return (
//     <img
//       src={src || FALLBACK_IMAGE}
//       alt={alt}
//       onError={(e) => {
//         e.currentTarget.onerror = null;
//         e.currentTarget.src = FALLBACK_IMAGE;
//       }}
//       {...props}
//     />
//   );
// }

/* ---------------- Cart drawer ---------------- */

// Mounted only while open, so the confirmation and any error reset each time
// the drawer is reopened.
// function CartDrawer({ onClose }) {
//   const { lines, total, isEmpty, setQuantity, remove, placeOrder } = useCart();
//   const { isAuthenticated } = useAuth();
//   const [note, setNote] = useState("");
//   const [placing, setPlacing] = useState(false);
//   const [error, setError] = useState(null);
//   const [confirmation, setConfirmation] = useState(null);

//   const handlePlaceOrder = async () => {
//     setError(null);
//     setPlacing(true);

//     try {
//       setConfirmation(await placeOrder(note.trim()));
//       setNote("");
//     } catch (cause) {
//       setError(
//         cause instanceof ApiError
//           ? cause.messages.join(" ")
//           : "Could not place the order. Please try again.",
//       );
//     } finally {
//       setPlacing(false);
//     }
//   };

//   return (
//     <div className="cart-overlay" role="dialog" aria-label="Your order">
//       <button
//         type="button"
//         className="cart-scrim"
//         aria-label="Close cart"
//         onClick={onClose}
//       />

//       <aside className="cart-drawer">
//         <header className="cart-header">
//           <h3>Your order</h3>
//           <button type="button" className="cart-close" onClick={onClose} aria-label="Close">
//             <CloseIcon />
//           </button>
//         </header>

//         {confirmation ? (
//           <div className="cart-body">
//             <p className="cart-success">
//               Order #{confirmation.id} placed — {formatPrice(confirmation.total_price)}
//             </p>
//             <p className="cart-hint">
//               Status: {confirmation.status}. Track it on your{" "}
//               <Link to="/orders">orders page</Link>.
//             </p>
//           </div>
//         ) : isEmpty ? (
//           <div className="cart-body">
//             <p className="cart-hint">Your cart is empty. Add something from the menu.</p>
//           </div>
//         ) : (
//           <>
//             <div className="cart-body">
//               <ul className="cart-lines">
//                 {lines.map(({ item, quantity }) => (
//                   <li key={item.id} className="cart-line">
//                     <div className="cart-line-main">
//                       <ProductImage
//                         className="cart-line-image"
//                         src={item.image_url}
//                         alt={item.name}
//                       />

//                       <div className="cart-line-info">
//                         <span className="cart-line-name">{item.name}</span>
//                         <span className="cart-line-price">
//                           {formatPrice(Number(item.price) * quantity)}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="cart-line-controls">
//                       <button
//                         type="button"
//                         onClick={() => setQuantity(item.id, quantity - 1)}
//                         aria-label={`Decrease ${item.name}`}
//                       >
//                         −
//                       </button>
//                       <span className="cart-qty">{quantity}</span>
//                       <button
//                         type="button"
//                         onClick={() => setQuantity(item.id, quantity + 1)}
//                         aria-label={`Increase ${item.name}`}
//                       >
//                         +
//                       </button>
//                       <button
//                         type="button"
//                         className="cart-remove"
//                         onClick={() => remove(item.id)}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>

//               <label className="cart-note">
//                 <span>Note for the kitchen</span>
//                 <textarea
//                   rows={2}
//                   value={note}
//                   onChange={(e) => setNote(e.target.value)}
//                   placeholder="Optional"
//                 />
//               </label>
//             </div>

//             <footer className="cart-footer">
//               {error && <p className="cart-error" role="alert">{error}</p>}

//               <div className="cart-total">
//                 <span>Total</span>
//                 <strong>{formatPrice(total)}</strong>
//               </div>

//               {isAuthenticated ? (
//                 <button
//                   type="button"
//                   className="btn-primary cart-submit"
//                   onClick={handlePlaceOrder}
//                   disabled={placing}
//                 >
//                   {placing ? "Placing order…" : "Place order"}
//                 </button>
//               ) : (
//                 <Link to="/login" className="btn-primary cart-submit">
//                   Log in to order
//                 </Link>
//               )}
//             </footer>
//           </>
//         )}
//       </aside>
//     </div>
//   );
// }

/* ---------------- Page ---------------- */

export default function HomePage() {
  //const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const trackRef = useRef(null);

  const { items, loading, error } = useMenuItems();
  const { user, isAuthenticated, logout } = useAuth();
  const cart = useCart();

  const scrollNext = () => {
    const track = trackRef.current;
    if (!track) return;
    const atEnd =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    track.scrollTo({
      left: atEnd ? 0 : track.scrollLeft + track.clientWidth * 0.6,
      behavior: "smooth",
    });
  };

  const addToCart = (item) => {
    cart.add(item);
    setCartOpen(true);
  };

  return (
    <div
      className="home"
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
      {/* ---------- Navbar ---------- */}
      <Navbar />
      {/* <header className="navbar">
        <a href="#home" className="brand">
          <span className="brand-icon">
            <CupLogo />
          </span>
          <span className="brand-name">Maison Café</span>
        </a>

        <nav className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`nav-link ${link.label === "Home" ? "is-active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              {link.dropdown && <ChevronDown />}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
        <button
            type="button"
            className="cart-btn"
            aria-label={`Cart, ${cart.count} item${cart.count === 1 ? "" : "s"}`}
            onClick={() => setCartOpen(true)}
        >
            <CartIcon />
            <span className="cart-badge">{cart.count}</span>
        </button>

        <button type="button" className="btn-outline">
            Book a Table
        </button>

        {isAuthenticated ? (
          <>
            <Link to="/orders" className="btn-outline">
                My Orders
            </Link>
            <span className="nav-user" title={user?.email || undefined}>
                {user?.first_name || user?.username}
            </span>
            <button type="button" className="btn-outline" onClick={logout}>
                Log Out
            </button>
          </>
        ) : (
          <>
          <Link to="/login" className="btn-outline btn-login">
              Login
          </Link>
          
          <Link to="/Register" className="btn-outline btn-Register">
              Register
          </Link>
          </>
          
        )}

        <button
            type="button"
            className="burger"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
        >
            <span />
            <span />
            <span />
        </button>
        </div>
      </header> */}

      {/* ---------- Hero ---------- */}
      <section className="hero" id="home">
        <div className="hero-glow" aria-hidden="true" />

        <div className="hero-content">
          <p className="hero-eyebrow">PREMIUM COFFEE EXPERIENCE</p>

          <h1 className="hero-title">
            Good Coffee,
            <br />
            <span className="hero-title-accent">Great Moments</span>
          </h1>

          <p className="hero-desc">
            Discover the perfect blend of rich flavors, cozy ambiance, and
            unforgettable moments in every cup we serve.
          </p>

          <div className="hero-actions">
            <Link to="/menu" className="btn-ghost">
              Explore Menu
              <ArrowRight />
            </Link>
            {/* <a href="#menu" className="btn-primary">
              Explore Menu
              
            </a> */}
            <button type="button" className="btn-ghost">
              <CalendarIcon />
              Book a Table
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <img
            className="hero-img"
            src={cupUrl}
            alt="Cup of coffee with chocolate"
          />
        </div>
      </section>

      {/* ---------- Popular Picks ---------- */}
      <section className="picks" id="menu">
        <div className="picks-header">
          <div className="picks-heading">
            <p className="section-label">OUR SIGNATURE SELECTION</p>
            <h2 className="section-title">Popular Picks</h2>
          </div>

          <button
            type="button"
            className="scroll-btn"
            onClick={scrollNext}
            aria-label="Next products"
          >
            <ChevronRight />
          </button>
        </div>

        {loading && <p className="picks-status">Loading the menu…</p>}

        {error && (
          <p className="picks-status is-error" role="alert">
            {error.messages?.join(" ") ?? "Could not load the menu."}
          </p>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="picks-status">
            Nothing on the menu yet — seed some items with{" "}
            <code>manage.py seed_demo</code>.
          </p>
        )}

        <div className="picks-track" ref={trackRef}>
          {items.map((item, index) => (
            <article key={item.id} className="product-card">
              <div className="product-media">
                <ProductImage
                  className="product-img"
                  src={item.image_url}
                  alt={item.name}
                />  
                {/* <img
                  className="product-img"
                  src={ProductImage(item, index)}
                  alt={item.name}
                /> */}
              </div>

              <div className="product-info">
                <h3 className="product-name">{item.name}</h3>
                <p className="product-desc">{item.description}</p>

                <div className="product-footer">
                  <span className="price">{formatPrice(item.price)}</span>
                  <button
                    type="button"
                    className="add-btn"
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
      </section>

      {/* ---------- Reservation Banner ---------- */}
      <section className="reservation-banner">
        <div className="banner-bg">
          <div className="banner-overlay" />
        </div>

        <div className="banner-content">
          <h3 className="banner-title">Reserve Your Table Today</h3>
          <p className="banner-text">
            Enjoy our cozy ambiance and delicious flavors with the people you
            love the most.
          </p>
          <button type="button" className="btn-primary">
            <CalendarIcon />
            Book a Table
          </button>
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className="stats" id="about">
        {STATS.map((stat) => (
          <div key={stat.label} className="stat-item">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  );
}
