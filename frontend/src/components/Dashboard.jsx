// src/pages/Dashboard.jsx
import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { activityAPI } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "../services/toast";
import "./Dashboard.css";

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [deleting, setDeleting] = useState(null);

  const navigate = useNavigate();
  const { user, loggedIn, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    // Wait for auth context to finish loading
    if (authLoading) {
      return;
    }
    
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    fetchActivities();
  }, [loggedIn, navigate, authLoading]);

  const isAdmin = user?.role === "admin";

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      console.log("[Dashboard] Fetching activities...");
      const result = await activityAPI.getAll();
      
      console.log("[Dashboard] Response:", result);
      
      if (result.success) {
        const activityList = Array.isArray(result.data) ? result.data : [];
        console.log("[Dashboard] Activities loaded:", activityList.length);
        setActivities(activityList);
      } else {
        const errorMsg = result.error || "Failed to fetch activities";
        console.error("[Dashboard] Error:", errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = "Connection error. Please try again.";
      console.error("[Dashboard] Exception:", err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize filtered activities to avoid unnecessary recalculations
  const filteredActivities = useMemo(
    () =>
      filterStatus === "All"
        ? activities
        : activities.filter((a) => a.status === filterStatus),
    [activities, filterStatus]
  );

  // Memoize stats data
  const statsData = useMemo(
    () => ({
      total: activities.length,
      completed: activities.filter((a) => a.status === "Completed").length,
      pending: activities.filter((a) => a.status === "Pending" || !a.status)
        .length,
    }),
    [activities]
  );

  const deleteActivity = useCallback(async (activityId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    setDeleting(activityId);
    try {
      const result = await activityAPI.delete(activityId);

      if (result.success) {
        // Remove from state immediately
        setActivities((prev) => prev.filter((a) => a._id !== activityId));
        setError("");
        toast.success("Activity deleted successfully");
        
        // Refetch activities to ensure sync with database
        setTimeout(() => {
          fetchActivities();
        }, 500);
      } else {
        const errorMsg = result.error || "Failed to delete activity";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = "Connection error while deleting";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setDeleting(null);
    }
  }, [fetchActivities]);

  return (
    <div className="dashboard-wrapper">
      {authLoading ? (
        <div className="dashboard-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      ) : (
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">
              {isAdmin ? "Manage all activities" : "Track your activities"}
            </p>
          </div>
          {isAdmin && (
            <Link to="/add" className="btn-add-activity">
              <span className="btn-icon">+</span> Add Activity
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">📊</div>
            <div className="stat-content">
              <p className="stat-label">Total Activities</p>
              <p className="stat-value">{statsData.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">✅</div>
            <div className="stat-content">
              <p className="stat-label">Completed</p>
              <p className="stat-value">{statsData.completed}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-content">
              <p className="stat-label">Pending</p>
              <p className="stat-value">{statsData.pending}</p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="filter-section">
          <h3 className="filter-title">Filter by Status</h3>
          <div className="filter-buttons">
            {["All", "Completed", "Pending"].map((status) => (
              <button
                key={status}
                className={`filter-btn ${
                  filterStatus === status ? "active" : ""
                }`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && <div className="error-banner">{error}</div>}

        {/* Body */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3 className="empty-title">No activities yet</h3>
            <p className="empty-text">
              {filterStatus === "All"
                ? "Start by adding your first activity"
                : `No ${filterStatus.toLowerCase()} activities found`}
            </p>
            <Link to="/add" className="empty-cta">
              Create First Activity
            </Link>
          </div>
        ) : (
          <div className="activities-container">
            <div className="activities-grid">
              {filteredActivities.map((activity) => (
                <div key={activity._id} className="activity-card">
                  <div className="activity-header">
                    <h3 className="activity-title">{activity.title}</h3>
                    <span
                      className={`status-badge ${
                        activity.status === "Completed"
                          ? "badge-completed"
                          : "badge-pending"
                      }`}
                    >
                      {activity.status || "Pending"}
                    </span>
                  </div>

                  {activity.description && (
                    <p className="activity-description">
                      {activity.description}
                    </p>
                  )}

                  <div className="activity-meta">
                    <span className="meta-item">
                      <span className="meta-label">Course:</span>
                      <span className="meta-value">{activity.course}</span>
                    </span>
                    <span className="meta-item">
                      <span className="meta-label">Date:</span>
                      <span className="meta-value">
                        {activity.date
                          ? new Date(activity.date).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </span>
                  </div>

                  {isAdmin && (
                    <div className="activity-actions">
                      <Link
                        to={`/edit/${activity._id}`}
                        className="btn-edit"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => deleteActivity(activity._id)}
                        className="btn-delete"
                        disabled={deleting === activity._id}
                      >
                        {deleting === activity._id
                          ? "🗑️ Deleting..."
                          : "🗑️ Delete"}
                      </button>
                    </div>
                  )}

                  {isAdmin && activity.user && (
                    <div className="activity-user">
                      <span className="user-label">Created by:</span>
                      <span className="user-name">
                        {activity.user.firstname} {activity.user.lastname}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
