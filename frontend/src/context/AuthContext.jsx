import { createContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser, isAuthenticated, clearUserData } from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state - users start logged out
  // They must explicitly login to be authenticated
  useEffect(() => {
    try {
      // Clear any existing localStorage on startup to ensure fresh session
      clearUserData();
      setUser(null);
      setLoggedIn(false);
    } catch (error) {
      console.error("Auth initialization error:", error);
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
