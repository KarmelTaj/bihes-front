import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { colors } from "../theme/colors";
import { fetchMenuItems } from "../api/menu";
import { useCart } from "../cart/useCart";
import { formatPrice } from "../lib/format";
import cupUrl from "../assets/cup.png";
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


const STATS = [
  { icon: <SmallCupIcon />, value: "10+", label: "Years of Experience" },
  { icon: <BeanIcon />, value: "100%", label: "Premium Quality" },
  { icon: <UsersIcon />, value: "12K+", label: "Happy Customers" },
  { icon: <PinIcon />, value: "5", label: "Branches Worldwide" },
];

/* ---------------- Menu loading ---------------- */

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


/* ---------------- Page ---------------- */

export default function HomePage() {
  //const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const trackRef = useRef(null);

  const { items, loading, error } = useMenuItems();
  const cart = useCart();

  useEffect(() => {
    if (!location.hash) return;

    const target = document.querySelector(location.hash);
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.hash]);

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
            <Link to="/reservations" className="btn-ghost">
              <CalendarIcon />
              Book a Table
            </Link>
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
          {items.map((item) => (
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
          <Link to="/reservations" className="btn-primary">
            <CalendarIcon />
            Book a Table
          </Link>
        </div>
      </section>

      {/* ---------- About ---------- */}
      <section className="about-section" id="about">
        <div className="about-copy">
          <p className="section-label">OUR STORY</p>
          <h2 className="section-title">Coffee Made for Meaningful Moments</h2>
          <p className="about-text">
            At Maison Café, we believe a great cup of coffee is more than a
            drink — it is a reason to slow down, connect, and enjoy the moment.
            We pair carefully selected ingredients with a warm atmosphere to
            make every visit feel special.
          </p>
          <p className="about-text">
            From your first morning espresso to an evening meal with friends,
            our goal is simple: serve quality food and coffee with genuine
            hospitality.
          </p>
          <Link to="/menu" className="btn-outline about-menu-btn">
            Discover Our Menu
            <ArrowRight />
          </Link>
        </div>

        <div className="about-highlights" aria-label="Maison Café values">
          <article className="about-highlight">
            <BeanIcon />
            <div>
              <h3>Premium Ingredients</h3>
              <p>Thoughtfully selected coffee, fresh food, and rich flavors.</p>
            </div>
          </article>
          <article className="about-highlight">
            <UsersIcon />
            <div>
              <h3>Made for Community</h3>
              <p>A comfortable place for friends, families, and quiet moments.</p>
            </div>
          </article>
          <article className="about-highlight">
            <SmallCupIcon />
            <div>
              <h3>Crafted with Care</h3>
              <p>Every order is prepared with attention to quality and detail.</p>
            </div>
          </article>
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className="stats" aria-label="Maison Café statistics">
        {STATS.map((stat) => (
          <div key={stat.label} className="stat-item">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ---------- Contact ---------- */}
      <section className="contact-section" id="contact">
        <div className="contact-heading">
          <p className="section-label">GET IN TOUCH</p>
          <h2 className="section-title">We Would Love to Hear From You</h2>
          <p className="contact-intro">
            Have a question about the menu, an order, or your next visit?
            Reach out to the Maison Café team and we will be happy to help.
          </p>
        </div>

        <div className="contact-grid">
          <article className="contact-card">
            <div className="contact-icon"><PinIcon /></div>
            <h3>Visit Us</h3>
            <p>Stop by your nearest Maison Café for coffee, food, and a cozy seat.</p>
          </article>

          <article className="contact-card">
            <div className="contact-icon"><SmallCupIcon /></div>
            <h3>Reservations</h3>
            <p>Planning a visit? Reserve a table ahead of time in just a few clicks.</p>
            <Link to="/reservations" className="contact-link">
              Book a Table <ArrowRight />
            </Link>
          </article>

          <article className="contact-card">
            <div className="contact-icon"><UsersIcon /></div>
            <h3>Need Help?</h3>
            <p>For order or account questions, our team is ready to assist you.</p>
            <Link to="/orders" className="contact-link">
              View My Orders <ArrowRight />
            </Link>
          </article>
        </div>
      </section>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  );
}
