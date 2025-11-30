import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser && storedUser.id) {
      setUser(storedUser);
    }
    setLoading(false);
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="profile-wrapper">
        <div className="profile-container">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-wrapper">
        <div className="profile-container">
          <div className="error">No user data found. Please log in again.</div>
          <Link to="/login" className="btn">Login</Link>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.firstname?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="profile-info">
              <h1 className="profile-name">
                {user?.firstname || "User"} {user?.lastname || ""}
              </h1>
              <p className="profile-email">{user?.email}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-group">
              <label>First Name</label>
              <p>{user?.firstname || "Not set"}</p>
            </div>

            <div className="detail-group">
              <label>Last Name</label>
              <p>{user?.lastname || "Not set"}</p>
            </div>

            <div className="detail-group">
              <label>Email Address</label>
              <p>{user?.email}</p>
            </div>

            <div className="detail-group">
              <label>User Role</label>
              <div className="role-display">
                <span className={`role-badge ${isAdmin ? "admin" : "user"}`}>
                  {isAdmin ? "👤 Administrator" : "👨‍🎓 Student"}
                </span>
                <p className="role-description">
                  {isAdmin 
                    ? "You have full access to create, edit, and delete activities." 
                    : "You can view and track your academic progress."}
                </p>
              </div>
            </div>

            <div className="detail-group">
              <label>Member Since</label>
              <p>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          </div>

          <div className="profile-actions">
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
