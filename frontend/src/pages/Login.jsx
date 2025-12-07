// src/pages/Login.jsx
import { useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, storeUserData } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "../services/toast";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Memoize handleSubmit to prevent unnecessary re-renders
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authAPI.login(email, password);

      if (!result.success) {
        const errorMsg = result.error || "Invalid credentials";
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const { token, user } = result.data;

      // Save token + user to localStorage
      storeUserData(token, user);

      // Update auth context
      login(token, user);

      toast.success("Login successful!");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [email, password, login, navigate]);

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Sign In</h1>
          <p className="login-subtitle">Track your academic progress</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={0}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <span 
              className="auth-link"
              onClick={() => navigate("/register")}
              role="button"
              tabIndex={0}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
