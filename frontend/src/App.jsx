import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import ToastContainer from "./components/ToastContainer";
import Home from "./pages/Home";
import Login from "./pages/Login";

// Lazy load components
const Register = lazy(() => import("./components/Register"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const AddActivity = lazy(() => import("./components/AddActivity"));
const EditActivity = lazy(() => import("./components/EditActivity"));
const Users = lazy(() => import("./components/Users"));
const Profile = lazy(() => import("./pages/Profile"));

// Loading component
const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="spinner"></div>
  </div>
);

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-root">
          <NavBar />
          <ToastContainer />
          <Suspense fallback={<LoadingSpinner />}>
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
          </Suspense>
        </div>
      </AuthProvider>
    </Router>
  );
}