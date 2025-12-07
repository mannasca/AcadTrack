import { useState, useContext, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { activityAPI } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "../services/toast";
import AccessDenied from "./AccessDenied";
import "./AddActivity.css";

export default function AddActivity() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    course: "",
    date: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // If loading auth, show loading state
  if (authLoading) {
    return (
      <div className="add-activity-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If not admin, show access denied
  if (!isAdmin) {
    return <AccessDenied />;
  }

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = useCallback(() => {
    if (!form.title.trim()) {
      const msg = "Title is required";
      setError(msg);
      toast.warning(msg);
      return false;
    }
    if (!form.course.trim()) {
      const msg = "Course is required";
      setError(msg);
      toast.warning(msg);
      return false;
    }
    if (!form.date) {
      const msg = "Date is required";
      setError(msg);
      toast.warning(msg);
      return false;
    }
    return true;
  }, [form.title, form.course, form.date]);

  const handleAdd = useCallback(async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await activityAPI.create(form);

      if (result.success) {
        toast.success("Activity created successfully!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        const errorMsg = result.error || "Failed to create activity";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = "Connection error. Please try again later.";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Add activity error:", err);
    } finally {
      setLoading(false);
    }
  }, [form, navigate, validateForm]);

  return (
    <div className="add-activity-wrapper">
      <div className="add-activity-container">
        <div className="form-header">
          <h1 className="form-title">Create New Activity</h1>
          <p className="form-subtitle">Add a new academic activity to track</p>
        </div>

        <form onSubmit={handleAdd} className="activity-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Activity Title <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g., Complete Math Assignment"
              value={form.title}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="Add details about this activity (optional)"
              value={form.description}
              onChange={handleChange}
              disabled={loading}
              rows="4"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="course" className="form-label">
                Course <span className="required">*</span>
              </label>
              <input
                id="course"
                type="text"
                name="course"
                className="form-input"
                placeholder="e.g., COMP 229"
                value={form.course}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Due Date <span className="required">*</span>
              </label>
              <input
                id="date"
                type="date"
                name="date"
                className="form-input"
                value={form.date}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={form.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Activity"}
            </button>
            <Link to="/dashboard" className="btn-cancel">
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <div className="form-illustration">
        <div className="illustration-content">
          <div className="illustration-item">✅</div>
          <div className="illustration-item">📚</div>
          <div className="illustration-item">🎯</div>
          <p className="illustration-text">Stay organized and track your progress</p>
        </div>
      </div>
    </div>
  );
}
