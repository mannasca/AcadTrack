import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { toast } from "../services/toast";
import "./Register.css";

export default function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  
  // Secret admin code - change this to something only you know
  const ADMIN_SECRET_CODE = "ADMIN2025";

  const validateForm = () => {
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      const msg = "All fields are required";
      setError(msg);
      toast.warning(msg);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const msg = "Please enter a valid email address";
      setError(msg);
      toast.warning(msg);
      return false;
    }
    if (password.length < 6) {
      const msg = "Password must be at least 6 characters";
      setError(msg);
      toast.warning(msg);
      return false;
    }
    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      toast.warning(msg);
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await authAPI.register(
        `${firstname} ${lastname}`,
        email,
        password,
        adminCode
      );

      if (result.success) {
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } else {
        const errorMsg = result.error || "Registration failed";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = "Connection error. Please try again later.";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleRegister(e);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join AcadTrack and track your progress</p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstname" className="form-label">
                First Name
              </label>
              <input
                id="firstname"
                type="text"
                className="form-input"
                placeholder="John"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastname" className="form-label">
                Last Name
              </label>
              <input
                id="lastname"
                type="text"
                className="form-input"
                placeholder="Doe"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                className="form-input"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirm(!showConfirm)}
                disabled={loading}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="adminCode" className="form-label">
              Admin Code <span className="optional">(Optional)</span>
            </label>
            <input
              id="adminCode"
              type="password"
              className="form-input"
              placeholder="Leave blank for regular user"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <small className="admin-hint">If you have an admin code, enter it to create an admin account</small>
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="register-footer">
          <p className="footer-text">
            Already have an account?{" "}
            <Link to="/login" className="footer-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="register-illustration">
        <div className="illustration-content">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
          <p className="illustration-text">Start your journey today</p>
        </div>
      </div>
    </div>
  );
}
