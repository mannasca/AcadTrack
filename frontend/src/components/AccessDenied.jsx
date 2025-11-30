import { Link } from "react-router-dom";
import "./AccessDenied.css";

export default function AccessDenied() {
  return (
    <div className="access-denied-wrapper">
      <div className="access-denied-container">
        <div className="denied-icon">🔐</div>
        <h1 className="denied-title">Access Denied</h1>
        <p className="denied-message">
          You don't have permission to access this feature.
        </p>
        <p className="denied-description">
          This action is only available to administrators.
        </p>
        
        <div className="denied-info">
          <p className="info-label">Your Role:</p>
          <p className="info-value">Student User</p>
          <p className="info-hint">If you believe you should have access, please contact your administrator.</p>
        </div>

        <div className="denied-actions">
          <Link to="/dashboard" className="btn-return">
            ← Return to Dashboard
          </Link>
          <Link to="/home" className="btn-home">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
