import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { CartProvider } from "./cart/CartContext";
import RequireAuth from "./routes/RequireAuth";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";

export default function App() {
  return (
    <BrowserRouter>
      {/* CartProvider sits inside AuthProvider: it clears the cart on sign-out. */}
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/orders"
              element={
                <RequireAuth>
                  <Orders />
                </RequireAuth>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
