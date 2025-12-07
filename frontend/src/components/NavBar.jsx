// src/components/NavBar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { clearUserData } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "./NavBar.css";
import logo from "../assets/logo.svg";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loggedIn, logout } = useContext(AuthContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    clearUserData();
    logout();
    setShowProfileMenu(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <img src={logo} alt="AcadTrack" className="brand-logo" />
          <span className="brand-text">AcadTrack</span>
        </Link>

        <div className="nav-links">
          {!loggedIn && (
            <>
              <Link
                to="/login"
                className={`nav-link ${isActive("/login") ? "active" : ""}`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className={`nav-link register-link ${
                  isActive("/register") ? "active" : ""
                }`}
              >
                Sign Up
              </Link>
            </>
          )}

          {loggedIn && (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              >
                Dashboard
              </Link>

              {isAdmin && (
                <>
                  <Link
                    to="/add"
                    className={`nav-link add-link ${
                      isActive("/add") ? "active" : ""
                    }`}
                  >
                    + Add Activity
                  </Link>
                  <Link
                    to="/users"
                    className={`nav-link users-link ${
                      isActive("/users") ? "active" : ""
                    }`}
                  >
                    👥 Users
                  </Link>
                </>
              )}

              <div className="profile-menu">
                <button
                  className="nav-link profile-btn"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  👤 My Profile
                  <span className={`role-badge ${isAdmin ? "admin" : "user"}`}>
                    {isAdmin ? "Admin" : "User"}
                  </span>
                </button>
                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <Link to="/profile" className="dropdown-item">
                      View Profile
                    </Link>
                    {isAdmin && (
                      <Link to="/users" className="dropdown-item">
                        👥 Manage Users
                      </Link>
                    )}
                    <button
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
