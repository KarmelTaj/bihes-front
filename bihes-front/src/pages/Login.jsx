import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";
import { useAuth } from "../auth/useAuth";
import { ApiError } from "../api/client";
import logoUrl from "../assets/Logo.png";
import cupUrl from "../assets/cup.png";
import "./Login.css";



function LogoMark() {
  return (
    <img src={logoUrl} alt="ChocoBrew" />
  );
}

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9 -6" />
  </svg>
);




const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M 8 11 V 7 a 4 4 0 0 1 8 0 v 4" />
  </svg>
);

const EyeIcon = ({ off }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {off ? (
      <>
        <path d="M9.9 4.2 A 9.1 9.1 0 0 1 12 4 c7 0 10 8 10 8 a18 18 0 0 1 -2.4 3.5" />
        <path d="M6.6 6.6 A18 18 0 0 0 2 12 s3 8 10 8 a9 9 0 0 0 5.4 -1.6" />
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
    <path fill="#EA4335" d="M24 9.5 c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5 H24 v9 h12.7 c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7C43.6 38 46.5 31.8 46.5 24.5z" />
    <path fill="#FBBC05" d="M10.4 28.3a14.5 14.5 0 0 1 0-8.6l-7.8-6.1a24 24 0 0 0 0 20.8l7.8-6.1z" />
    <path fill="#34A853" d="M24 48c6.1 0 11.3-2 15-5.5l-7.3-5.7c-2 1.4-4.7 2.2-7.7 2.2-6.4 0-11.7-3.7-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);








export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  // One field, either credential: the backend resolves an email to its username.
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where RequireAuth bounced them from, if anywhere.
  const destination = location.state?.from?.pathname ?? "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      await login({ identifier: identifier.trim(), password, remember });
      navigate(destination, { replace: true });
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause
          : new ApiError({
              status: 0,
              generalErrors: ["Unexpected error. Please try again."],
            }),
      );
      setSubmitting(false);
    }
  };


  if (!isLoading && isAuthenticated) return <Navigate to={destination} replace />;

  const identifierError = error?.fieldError("username");
  const passwordError = error?.fieldError("password");
  const generalErrors = error?.generalErrors ?? [];

  return (
    <div className="page">
      <div className="container">
        {/* Left brand panel */}
        <div className="brand-panel">
          <div className="brand-art">
            <img src={cupUrl} alt="" aria-hidden="true" />
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
            {generalErrors.length > 0 && (
              <div className="form-alert" role="alert">
                {generalErrors.map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
            )}

            <div className="field">
              <label className="label" htmlFor="identifier">Email or username</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <MailIcon />
                </span>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="input"
                  required
                />
              </div>
              {identifierError && <p className="field-error">{identifierError}</p>}
            </div>

            <div className="field">
              <label className="label" htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  required
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
              {passwordError && <p className="field-error">{passwordError}</p>}
            </div>

            <div className="row-between">
              <label className="checkbox-label">
                {/* Ticked keeps the session in localStorage; unticked drops it
                    when the tab closes. */}
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

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Logging in…" : "Log In"}
            </button>

            <div className="or-divider">
              <span className="line" />
              <span className="or-text">or</span>
              <span className="line" />
            </div>

            <button
              type="button"
              className="btn-google"
              disabled
              title="Google sign-in is not wired up on the backend yet."
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            <p className="signup-text">
              Don&apos;t have an account? <Link to="/register" className="link-signup">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
