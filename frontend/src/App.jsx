import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-root">
        <NavBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<AddActivity />} />
        </Routes>
      </div>
    </Router>
  );
}

function NavBar() {
  return (
    <nav className="nav">
      <h1 className="nav-title">AcadTrack</h1>
      <div className="nav-links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
}

/* ------------ LOGIN ------------ */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful");
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Login</h2>
      <input
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="button primary" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

/* ------------ REGISTER ------------ */
function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstname, lastname, email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Register</h2>
      <input
        className="input"
        placeholder="First Name"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
      />
      <input
        className="input"
        placeholder="Last Name"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
      <input
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="button success" onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}

/* ------------ DASHBOARD ------------ */
function Dashboard() {
  const [activities, setActivities] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/activities`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok) setActivities(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchActivities();
  }, [token]);

  return (
    <div className="card large">
      <div className="card-header">
        <h2 className="card-title">My Activities</h2>
        <Link to="/add" className="button primary small">
          + Add Activity
        </Link>
      </div>

      {activities.length === 0 ? (
        <p className="empty-text">No activities yet. Add your first one!</p>
      ) : (
        <ul className="activity-list">
          {activities.map((a) => (
            <li key={a._id} className="activity-item">
              <div>
                <p className="activity-title">{a.title}</p>
                <p className="activity-meta">
                  Course: {a.course} | Date:{" "}
                  {a.date ? a.date.substring(0, 10) : "N/A"}
                </p>
              </div>
              <span
                className={
                  "status-pill " +
                  (a.status === "Completed" ? "status-completed" : "status-pending")
                }
              >
                {a.status || "Pending"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------ ADD ACTIVITY ------------ */
function AddActivity() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleAdd = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/activities/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, course, date }),
        }
      );

      if (res.ok) {
        alert("Activity created successfully");
        navigate("/dashboard");
      } else {
        alert("Failed to create activity");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Add Activity</h2>
      <input
        className="input"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="input"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="input"
        placeholder="Course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      />
      <input
        className="input"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button className="button primary" onClick={handleAdd}>
        Add Activity
      </button>
    </div>
  );
}
