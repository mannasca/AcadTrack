import { useState, useEffect, useMemo, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "../assets/logo.svg";
import { AuthContext } from "../context/AuthContext";

// Memoized Activity Card Component
const ActivityCard = ({ activity }) => (
  <div className="activity-card">
    <div className="activity-header">
      <h3 className="activity-title">{activity.title}</h3>
      <span className={`activity-status status-${activity.status || "Pending"}`}>
        {activity.status || "Pending"}
      </span>
    </div>
    {activity.course && (
      <p className="activity-course">{activity.course}</p>
    )}
    {activity.description && (
      <p className="activity-description">
        {activity.description.substring(0, 100)}
        {activity.description.length > 100 ? "..." : ""}
      </p>
    )}
    {activity.date && (
      <p className="activity-date">
        📅 {new Date(activity.date).toLocaleDateString()}
      </p>
    )}
  </div>
);

export default function Home() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch activities if user is logged in
    if (loggedIn) {
      fetchActivities();
    }
  }, [loggedIn]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${baseUrl}/activities`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Encoding": "gzip, deflate"
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setActivities(Array.isArray(data) ? data : data.data || []);
      } else {
        setError("Failed to fetch activities");
      }
    } catch (err) {
      console.error(err);
      setError("Error loading activities");
    } finally {
      setLoading(false);
    }
  };

  // Memoize recent activities to avoid unnecessary recalculations
  const recentActivities = useMemo(() => activities.slice(0, 6), [activities]);

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left">
            <img src={logo} alt="AcadTrack Logo" className="hero-logo" />
            <h1 className="hero-title">AcadTrack</h1>
            <p className="hero-subtitle">
              Your Personal Academic Activity Manager
            </p>
            <p className="hero-description">
              Track, organize, and manage your academic activities with ease.
              Stay on top of assignments, projects, and deadlines all in one place.
            </p>

            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span className="feature-text">Track Activities</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📅</span>
                <span className="feature-text">Manage Deadlines</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span className="feature-text">Mark Progress</span>
              </div>
            </div>

            <div className="hero-actions">
              {!loggedIn ? (
                <>
                  <Link to="/login" className="btn btn-primary">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-secondary">
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hero-right">
            <div className="illustration">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-3"></div>
              <span className="illustration-text">📚</span>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section - Only shown when logged in */}
      {loggedIn && (
        <section className="activities-section">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">Recent Activities</h2>
              <Link to="/dashboard" className="view-all-link">
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="loading">Loading activities...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : activities.length === 0 ? (
              <div className="empty-state">
                <p>No activities yet. Start by adding your first activity!</p>
                <Link to="/add" className="btn btn-primary">
                  + Add Activity
                </Link>
              </div>
            ) : (
              <div className="activities-grid">
                {recentActivities.map((activity) => (
                  <ActivityCard key={activity._id} activity={activity} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section - Only shown when not logged in */}
      {!loggedIn && (
        <section className="features-section">
          <div className="section-container">
            <h2 className="section-title">Why Choose AcadTrack?</h2>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-card-icon">📝</div>
                <h3>Easy to Use</h3>
                <p>
                  Simple and intuitive interface designed for students and
                  academics to manage their workload efficiently.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-card-icon">🔐</div>
                <h3>Secure</h3>
                <p>
                  Your data is protected with secure authentication and
                  encryption. Your privacy is our priority.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-card-icon">📱</div>
                <h3>Responsive Design</h3>
                <p>
                  Access your activities from any device - desktop, tablet, or
                  mobile. Work anywhere, anytime.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-card-icon">⚡</div>
                <h3>Real-time Updates</h3>
                <p>
                  Get instant notifications and updates about your activities
                  and deadlines.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-card-icon">📊</div>
                <h3>Progress Tracking</h3>
                <p>
                  Track the progress of your activities with status updates and
                  completion insights.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-card-icon">🎯</div>
                <h3>Goal Management</h3>
                <p>
                  Set goals, organize tasks, and achieve your academic
                  objectives with structured planning.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CI/CD Demo Section */}
      <section className="cicd-demo-section">
        <div className="section-container">
          <h2 className="section-title">🚀 Continuous Integration & Deployment</h2>
          <p className="section-subtitle">
            This update was deployed using automated CI/CD pipeline
          </p>
          
          <div className="cicd-info-grid">
            <div className="cicd-card">
              <div className="cicd-icon">📝</div>
              <h3>Code Commit</h3>
              <p>Developers commit changes to a feature branch on GitHub</p>
            </div>

            <div className="cicd-card">
              <div className="cicd-icon">🔀</div>
              <h3>Pull Request</h3>
              <p>Create PR and review code changes before merging</p>
            </div>

            <div className="cicd-card">
              <div className="cicd-icon">✅</div>
              <h3>Auto-Deploy</h3>
              <p>Merge to main triggers automatic Netlify deployment</p>
            </div>

            <div className="cicd-card">
              <div className="cicd-icon">🌐</div>
              <h3>Live Update</h3>
              <p>Changes go live within minutes - no manual deployment needed!</p>
            </div>
          </div>

          <div className="cicd-highlight">
            <p>✨ <strong>Demo Success:</strong> This new CI/CD demo section was added via feature branch, merged to main, and automatically deployed! This showcases the power of continuous integration and deployment workflows.</p>
          </div>
        </div>
      </section>

      {/* CTA Section - Only shown when not logged in */}
      {!loggedIn && (
        <section className="cta-section">
          <div className="cta-container">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">
              Join thousands of students managing their academic activities with AcadTrack
            </p>

            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Create Account
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-brand">
                <img src={logo} alt="AcadTrack" className="footer-logo" />
                <h3>AcadTrack</h3>
              </div>
              <p className="footer-description">
                Your personal academic activity manager
              </p>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                {loggedIn ? (
                  <>
                    <li>
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/add">Add Activity</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login">Sign In</Link>
                    </li>
                    <li>
                      <Link to="/register">Sign Up</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="footer-section">
              <h4>Features</h4>
              <ul className="footer-links">
                <li>Activity Tracking</li>
                <li>Deadline Management</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 AcadTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
