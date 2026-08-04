import { useRef, useState } from "react";
import { colors } from "../theme/colors";
import "./Home.css";
import { Link } from "react-router-dom";

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

const CartIcon = () => (
  <svg viewBox="0 0 24 24" width="21" height="21" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2 3h2.5l2.4 12.2a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21 7H6" />
  </svg>
);

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

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Pages", href: "#pages", dropdown: true },
  { label: "Contact", href: "#contact" },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Royal Latte",
    desc: "Smooth espresso with steamed milk",
    price: 4.99,
    img: "/src/assets/products/bbq-chicken-pizza.jpg",
  },
  {
    id: 2,
    name: "Mocha Delight",
    desc: "Rich chocolate with espresso",
    price: 5.49,
    img: "/src/assets/products/margherita-pizza.jpg",
  },
  {
    id: 3,
    name: "Butter Croissant",
    desc: "Flaky, buttery and perfectly baked",
    price: 3.49,
    img: "/src/assets/products/pepperoni-pizza.jpg",
  },
  {
    id: 4,
    name: "Chocolate Cake",
    desc: "Decadent chocolate indulgence",
    price: 5.99,
    img: "/src/assets/products/veggie-supreme.jpg",
  },
];

const STATS = [
  { icon: <SmallCupIcon />, value: "10+", label: "Years of Experience" },
  { icon: <BeanIcon />, value: "100%", label: "Premium Quality" },
  { icon: <UsersIcon />, value: "12K+", label: "Happy Customers" },
  { icon: <PinIcon />, value: "5", label: "Branches Worldwide" },
];

/* ---------------- Page ---------------- */

export default function HomePage() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const trackRef = useRef(null);

  const addToCart = () => setCartCount((count) => count + 1);

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
      <header className="navbar">
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
        <button type="button" className="cart-btn" aria-label="Cart">
            <CartIcon />
            <span className="cart-badge">{cartCount}</span>
        </button>

        <button type="button" className="btn-outline">
            Book a Table
        </button>

        <Link to="/login" className="btn-outline btn-login">
            Login
        </Link>

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
      </header>

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
            <button type="button" className="btn-primary">
              Explore Menu
              <ArrowRight />
            </button>
            <button type="button" className="btn-ghost">
              <CalendarIcon />
              Book a Table
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <img
            className="hero-img"
            src="/src/assets/cup.png"
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

        <div className="picks-track" ref={trackRef}>
          {PRODUCTS.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-media">
                <img
                  className="product-img"
                  src={product.img}
                  alt={product.name}
                />
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.desc}</p>

                <div className="product-footer">
                  <span className="price">${product.price.toFixed(2)}</span>
                  <button
                    type="button"
                    className="add-btn"
                    onClick={addToCart}
                    aria-label={`Add ${product.name} to cart`}
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
          <img
            className="banner-img"
            src="/src/assets/restaurant-bg.jpg"
            alt=""
            aria-hidden="true"
          />
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
    </div>
  );
}
