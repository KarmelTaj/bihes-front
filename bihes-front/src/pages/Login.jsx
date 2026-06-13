import "./Login.css";
import coffeeSvg from "../assets/coffee-login-illustration.svg";

export default function Login() {
  return (
    <div className="login-page">
      <div className="left-panel">
        <img src={coffeeSvg} alt="Coffee Shop" />

        <div className="brand">
          <h1>Maison Café</h1>
          <p>
            Enjoy artisan coffee, handcrafted desserts,
            and unforgettable moments.
          </p>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p>Sign in to continue</p>

          <form>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <div className="row">
              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <a href="/">Forgot password?</a>
            </div>

            <button type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}