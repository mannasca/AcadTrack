// src/pages/EditActivity.jsx
import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { activityAPI } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "../services/toast";
import AccessDenied from "./AccessDenied";
import "./EditActivity.css";

export default function EditActivity() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    course: "",
    date: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const { user, loading: authLoading, loggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (authLoading) return;
    
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    if (!isAdmin) return;

    fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin, navigate, id]);

  const fetchActivity = async () => {
    try {
      const result = await activityAPI.getById(id);

      if (result.success) {
        const data = result.data;
        setForm({
          title: data.title || "",
          description: data.description || "",
          course: data.course || "",
          date: data.date ? data.date.split("T")[0] : "",
          status: data.status || "Pending",
        });
      } else {
        const errorMsg = result.error || "Failed to load activity details";
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
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
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

  const handleUpdate = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setSaving(true);

    try {
      const result = await activityAPI.update(id, form);

      if (result.success) {
        setSuccess("Activity updated successfully!");
        toast.success("Activity updated successfully!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        const errorMsg = result.error || "Failed to update activity";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = "Connection error. Please try again later.";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Update activity error:", err);
    } finally {
      setSaving(false);
    }
  }, [form, id, navigate, validateForm]);

  if (!user) return null; // redirecting
  if (!isAdmin) return <AccessDenied />;

  if (loading) {
    return (
      <div className="edit-activity-wrapper">
        <div className="edit-activity-container">
          <div className="loading">Loading activity details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-activity-wrapper">
      <div className="edit-activity-container">
        <div className="form-header">
          <Link to="/dashboard" className="back-link">
            ← Back to Dashboard
          </Link>
          <h1 className="form-title">Edit Activity</h1>
          <p className="form-subtitle">Update the activity details</p>
        </div>

        <form onSubmit={handleUpdate} className="activity-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

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
              disabled={saving}
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
              disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
              disabled={saving}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link to="/dashboard" className="btn-cancel">
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <div className="form-illustration">
        <div className="illustration-content">
          <div className="illustration-item">✏️</div>
          <div className="illustration-item">📝</div>
          <div className="illustration-item">✅</div>
          <p className="illustration-text">Update and manage your activities</p>
        </div>
      </div>
    </div>
  );
}
