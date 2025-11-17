import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";

// =========================
// 🌟 MAIN APP
// =========================
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

// =========================
// 🌟 NAVBAR WITH LOGOUT
// =========================
function NavBar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="nav">
      <h1 className="nav-title">AcadTrack</h1>

      <div className="nav-links">
        {!token && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {token && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

// =========================
// 🌟 LOGIN COMPONENT
// =========================
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("All fields are required.");
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
      setLoading(false);
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

      <button className="button primary" onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

// =========================
// 🌟 REGISTER COMPONENT
// =========================
function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!firstname || !lastname || !email || !password) {
      return alert("All fields are required.");
    }

    setLoading(true);

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
      setLoading(false);

      if (res.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
      setLoading(false);
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

      <button className="button success" onClick={handleRegister} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}

// =========================
// 🌟 DASHBOARD COMPONENT
// =========================
function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchActivities = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/activities`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (res.ok) setActivities(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchActivities();
  }, []);

  return (
    <div className="card large">
      <div className="card-header">
        <h2 className="card-title">My Activities</h2>
        <Link to="/add" className="button primary small">
          + Add Activity
        </Link>
      </div>

      {loading ? (
        <p>Loading activities...</p>
      ) : activities.length === 0 ? (
        <p className="empty-text">No activities yet. Add your first one!</p>
      ) : (
        <ul className="activity-list">
          {activities.map((a) => (
            <li key={a._id} className="activity-item">
              <div>
                <p className="activity-title">{a.title}</p>
                <p className="activity-meta">
                  Course: {a.course} | Date: {a.date?.substring(0, 10) || "N/A"}
                </p>
              </div>
              <span
                className={
                  "status-pill " +
                  (a.status === "Completed"
                    ? "status-completed"
                    : "status-pending")
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

// =========================
// 🌟 ADD ACTIVITY
// =========================
function AddActivity() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    course: "",
    date: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    if (!form.title || !form.course || !form.date) {
      return alert("Please fill all required fields.");
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/activities/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        alert("Activity created!");
        navigate("/dashboard");
      } else {
        alert("Failed to create activity");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Add Activity</h2>

      <input
        className="input"
        name="title"
        placeholder="Title *"
        value={form.title}
        onChange={handleChange}
      />

      <input
        className="input"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <input
        className="input"
        name="course"
        placeholder="Course *"
        value={form.course}
        onChange={handleChange}
      />

      <input
        className="input"
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <button className="button primary" onClick={handleAdd}>
        Add Activity
      </button>
    </div>
  );
}