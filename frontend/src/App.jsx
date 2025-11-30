import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import ToastContainer from "./components/ToastContainer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AddActivity from "./components/AddActivity";
import EditActivity from "./components/EditActivity";
import Users from "./components/Users";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <div className="app-root">
        <NavBar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<AddActivity />} />
          <Route path="/edit/:id" element={<EditActivity />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}