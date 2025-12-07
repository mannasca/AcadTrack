// src/pages/Register.jsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { toast } from "../services/toast";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [adminCode, setAdminCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Memoize form validation with useCallback
  const validateForm = useCallback(() => {
    if (!firstname.trim() || !lastname.trim()) {
      setError("First name and last name are required.");
      return false;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }

    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  }, [firstname, lastname, email, password, confirm]);

  // Memoize register handler with useCallback
  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    const payload = {
      firstname,
      lastname,
      email,
      password,
      adminCode: adminCode.trim() || "", // OPTIONAL
    };

    setLoading(true);

    try {
      const result = await authAPI.register(payload);

      if (!result.success) {
        const msg =
          result.error ||
          result.message ||
          "Registration failed. Please try again.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! Please sign in.");
      setTimeout(() => navigate("/login"), 600);

    } catch (err) {
      console.error(err);
      setError("Connection error. Please try again later.");
      toast.error("Connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [firstname, lastname, email, password, adminCode, navigate, validateForm]);

  // COMPONENT
  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join AcadTrack and track your progress</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="First name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Last name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Re-enter your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Admin Code <span className="optional">(Optional)</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Leave blank for regular user"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-register"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <span 
              className="auth-link"
              onClick={() => navigate("/login")}
              role="button"
              tabIndex={0}
            >
              Sign in here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
