import { useContext, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AccessDenied from "../components/AccessDenied";
import "./Profile.css";

export default function Profile() {
  const { user, loggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!loggedIn) {
    navigate("/login");
    return null;
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p role="status" aria-live="polite">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Memoize derived values to avoid unnecessary recalculations
  const isAdmin = useMemo(() => user?.role === "admin", [user?.role]);
  const roleDescription = useMemo(
    () =>
      isAdmin
        ? "You have full access to create, edit, and delete activities."
        : "You can view and track your academic progress.",
    [isAdmin]
  );

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
                  {roleDescription}
                </p>
              </div>
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
