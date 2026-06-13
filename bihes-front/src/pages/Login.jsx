import { useState } from "react";
import { colors } from "../theme/colors";
import "./Login.css";

// Brand panel illustration (coffee cup + chocolate)
function CoffeeIllustration() {
  return (
    <svg
      className="brand-illustration"
      viewBox="0 0 300 320"
      fill="none"
      stroke={colors.primary}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Steam */}
      <path d="M150 40 q-14 16 0 32 q14 16 0 32" opacity="0.7" />
      <path d="M180 30 q-14 16 0 32 q14 16 0 32" opacity="0.5" />
      {/* Cup body */}
      <path d="M70 150 h150 v40 a75 60 0 0 1 -150 0 z" />
      {/* Handle */}
      <path d="M220 160 q45 5 45 40 t-45 40" />
      {/* Saucer */}
      <ellipse cx="145" cy="235" rx="120" ry="22" />
      {/* Chocolate bar */}
      <rect x="245" y="195" width="60" height="45" rx="4" />
      <line x1="275" y1="195" x2="275" y2="240" />
      <line x1="245" y1="217" x2="305" y2="217" />
      {/* Coffee beans */}
      <ellipse cx="200" cy="270" rx="14" ry="9" />
      <path d="M186 270 q14 8 28 0" />
      <ellipse cx="240" cy="278" rx="14" ry="9" />
      <path d="M226 278 q14 8 28 0" />
    </svg>
  );
}

// Logo mark
function LogoMark() {
  return (
    <svg
      className="logo-mark"
      viewBox="0 0 120 110"
      fill="none"
      stroke={colors.accent}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Heart steam */}
      <path d="M55 14 c-6 -8 -16 -2 -10 6 c2 4 10 9 10 9 s8 -5 10 -9 c6 -8 -4 -14 -10 -6" />
      {/* Cup */}
      <path d="M28 45 h44 v18 a22 18 0 0 1 -44 0 z" />
      <path d="M72 50 q14 2 14 14 t-14 14" />
      {/* Plate swoosh */}
      <path d="M18 80 q42 22 84 0" />
      {/* Chocolate */}
      <rect x="78" y="58" width="22" height="22" rx="3" />
      <line x1="89" y1="58" x2="89" y2="80" />
      <line x1="78" y1="69" x2="100" y2="69" />
    </svg>
  );
}

// Icons
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const EyeIcon = ({ off }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {off ? (
      <>
        <path d="M9.9 4.2A9.1 9.1 0 0 1 12 4c7 0 10 8 10 8a18 18 0 0 1-2.4 3.5" />
        <path d="M6.6 6.6A18 18 0 0 0 2 12s3 8 10 8a9 9 0 0 0 5.4-1.6" />
        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </>
    ) : (
      <>
        <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="20" height="20">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7C43.6 38 46.5 31.8 46.5 24.5z" />
    <path fill="#FBBC05" d="M10.4 28.3a14.5 14.5 0 0 1 0-8.6l-7.8-6.1a24 24 0 0 0 0 20.8l7.8-6.1z" />
    <path fill="#34A853" d="M24 48c6.1 0 11.3-2 15-5.5l-7.3-5.7c-2 1.4-4.7 2.2-7.7 2.2-6.4 0-11.7-3.7-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle login logic here
    console.log({ email, password, remember });
  };

  return (
    <div className="page">
      <div className="container">
        {/* Left brand panel */}
        <div className="brand-panel">
          <div className="brand-art">
            <img src="/src/assets/cup.png"/>
          </div>

          <div className="brand-content">
            <h1 className="brand-title">Welcome Back!</h1>
            <p className="brand-text">
              Login to your account and enjoy your favorite coffee and
              chocolate.
            </p>

            <div className="divider-bean">
              <span className="line" />
              <svg viewBox="0 0 24 16" width="24" height="16" fill="none"
                stroke={colors.accent} strokeWidth="1.8">
                <ellipse cx="12" cy="8" rx="9" ry="6" />
                <path d="M5 8q7 5 14 0" />
              </svg>
              <span className="line" />
            </div>

            <div className="brand-logo">
              <p className="logo-name">
                Choco<strong>Brew</strong>
              </p>
              <p className="logo-sub">COFFEE &amp; CHOCOLATE</p>
            </div>
          </div>
        </div>

        {/* Right form card */}
        <div className="form-card">
          <div className="logo-wrap">
            <LogoMark />
          </div>

          <h2 className="form-title">Log in to your account</h2>
          <p className="form-subtitle">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="form">
            <div className="field">
              <label className="label">Email</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <LockIcon />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                />
                <button
                  type="button"
                  className="toggle-eye"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="Toggle password visibility"
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>
            </div>

            <div className="row-between">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="link-forgot">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-primary">
              Log In
            </button>

            <div className="or-divider">
              <span className="line" />
              <span className="or-text">or</span>
              <span className="line" />
            </div>

            <button type="button" className="btn-google">
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            <p className="signup-text">
              Don&apos;t have an account? <a href="#" className="link-signup">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
