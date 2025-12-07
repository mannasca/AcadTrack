import { createContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser, isAuthenticated, clearUserData } from "../services/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Wake up backend on startup (Render free tier hibernates after 15 mins)
  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        await fetch(`${BASE_URL}/health`, { 
          method: "GET",
          mode: "cors"
        }).catch(() => {
          // Ignore errors - just trying to wake up the backend
        });
      } catch (err) {
        // Silent fail - this is just for waking up backend
      }
    };
    
    wakeUpBackend();
  }, []);

  // Initialize auth state from localStorage on app startup
  // This allows users to stay logged in across page refreshes
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setLoggedIn(true);
        } catch (e) {
          // Invalid JSON in localStorage, clear it
          clearUserData();
          setUser(null);
          setLoggedIn(false);
        }
      } else {
        setUser(null);
        setLoggedIn(false);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      setUser(null);
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update auth state (called after login)
  const login = useCallback((token, userData) => {
    setUser(userData);
    setLoggedIn(true);
  }, []);

  // Clear auth state (called on logout)
  const logout = useCallback(() => {
    clearUserData();
    setUser(null);
    setLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loggedIn,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
