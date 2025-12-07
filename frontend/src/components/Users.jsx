import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "../services/toast";
import AccessDenied from "./AccessDenied";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  if (authLoading) {
    return (
      <div className="users-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchAllUsers();
  }, [user, navigate]);

  const fetchAllUsers = useCallback(async () => {
    try {
      const result = await authAPI.getAllUsers();

      if (result.success) {
        setUsers(result.data.users || []);
        setError("");
      } else {
        const errorMsg = result.error || "Failed to load users";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = "Connection error. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize filtered users to avoid unnecessary recalculations
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === "all" || u.role === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  const getRoleBadge = useCallback((role) => {
    return (
      <span className={`role-badge role-${role}`}>
        {role === "admin" ? "👑 Admin" : "👤 User"}
      </span>
    );
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  if (loading) {
    return (
      <div className="users-wrapper">
        <div className="users-container">
          <div className="loading">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="users-wrapper">
      <div className="users-container">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">👥 User Management</h1>
            <p className="page-subtitle">View and manage all users in the system</p>
          </div>
          <Link to="/dashboard" className="btn-back">
            ← Back to Dashboard
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="controls-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <select
              className="filter-select"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles ({users.length})</option>
              <option value="admin">Admins ({users.filter(u => u.role === "admin").length})</option>
              <option value="user">Users ({users.filter(u => u.role === "user").length})</option>
            </select>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-text">No users found matching your criteria</p>
          </div>
        ) : (
          <div className="users-section">
            <div className="users-info">
              Showing <span className="highlight">{filteredUsers.length}</span> of{" "}
              <span className="highlight">{users.length}</span> users
            </div>

            <div className="table-responsive">
              <table className="users-table">
                <thead>
                  <tr>
                    <th className="col-name">Name</th>
                    <th className="col-email">Email</th>
                    <th className="col-role">Role</th>
                    <th className="col-joined">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="user-row">
                      <td className="col-name">
                        <div className="user-name-cell">
                          <div className="avatar">
                            {u.firstname[0]}
                            {u.lastname[0]}
                          </div>
                          <div className="name-info">
                            <div className="full-name">
                              {u.firstname} {u.lastname}
                            </div>
                            <div className="user-id">{u._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="col-email">
                        <a href={`mailto:${u.email}`} className="email-link">
                          {u.email}
                        </a>
                      </td>
                      <td className="col-role">{getRoleBadge(u.role)}</td>
                      <td className="col-joined">
                        <span className="date-text">{formatDate(u.createdAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👑</div>
          <div className="stat-content">
            <div className="stat-number">{users.filter(u => u.role === "admin").length}</div>
            <div className="stat-label">Admins</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <div className="stat-number">{users.filter(u => u.role === "user").length}</div>
            <div className="stat-label">Regular Users</div>
          </div>
        </div>
      </div>
    </div>
  );
}
