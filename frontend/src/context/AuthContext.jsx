import { createContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser, isAuthenticated, clearUserData } from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
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
