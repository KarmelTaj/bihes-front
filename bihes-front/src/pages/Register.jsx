import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";
import { useAuth } from "../auth/useAuth";
import { ApiError } from "../api/client";
import logoUrl from "../assets/Logo.png";
import cupUrl from "../assets/cup.png";
// Registration is the mirror image of login, so it borrows that page's styles
// rather than duplicating them.
import "./Login.css";

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
);

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

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) =>
    setForm((current) => ({ ...current, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      // register() signs the new account straight in.
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
      });
      navigate("/", { replace: true });
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

  if (!isLoading && isAuthenticated) return <Navigate to="/" replace />;

  const generalErrors = error?.generalErrors ?? [];

  return (
    <div className="page">
      <div className="container">
        <div className="brand-panel">
          <div className="brand-art">
            <img src={cupUrl} alt="" aria-hidden="true" />
          </div>

          <div className="brand-content">
            <h1 className="brand-title">Join Us</h1>
            <p className="brand-text">
              Create an account to order ahead and keep track of every cup.
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

        <div className="form-card">
          <div className="logo-wrap">
            <img src={logoUrl} alt="ChocoBrew" />
          </div>

          <h2 className="form-title">Create your account</h2>
          <p className="form-subtitle">It only takes a moment</p>

          <form onSubmit={handleSubmit} className="form">
            {generalErrors.length > 0 && (
              <div className="form-alert" role="alert">
                {generalErrors.map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
            )}

            <div className="field-row">
              <div className="field">
                <label className="label" htmlFor="firstName">First name</label>
                <div className="input-wrap">
                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Brook"
                    value={form.firstName}
                    onChange={update("firstName")}
                    className="input"
                  />
                </div>
                {error?.fieldError("first_name") && (
                  <p className="field-error">{error.fieldError("first_name")}</p>
                )}
              </div>

              <div className="field">
                <label className="label" htmlFor="lastName">Last name</label>
                <div className="input-wrap">
                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Jones"
                    value={form.lastName}
                    onChange={update("lastName")}
                    className="input"
                  />
                </div>
                {error?.fieldError("last_name") && (
                  <p className="field-error">{error.fieldError("last_name")}</p>
                )}
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="username">Username</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <UserIcon />
                </span>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Pick a username"
                  value={form.username}
                  onChange={update("username")}
                  className="input"
                  required
                />
              </div>
              {error?.fieldError("username") && (
                <p className="field-error">{error.fieldError("username")}</p>
              )}
            </div>

            <div className="field">
              <label className="label" htmlFor="email">Email</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <MailIcon />
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update("email")}
                  className="input"
                  required
                />
              </div>
              {error?.fieldError("email") && (
                <p className="field-error">{error.fieldError("email")}</p>
              )}
            </div>

            <div className="field">
              <label className="label" htmlFor="new-password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <LockIcon />
                </span>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Choose a password"
                  value={form.password}
                  onChange={update("password")}
                  className="input"
                  required
                />
              </div>
              {error?.fieldError("password") && (
                <p className="field-error">{error.fieldError("password")}</p>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Creating account…" : "Sign Up"}
            </button>

            <p className="signup-text">
              Already have an account? <Link to="/login" className="link-signup">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
