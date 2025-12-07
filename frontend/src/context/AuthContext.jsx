import { createContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser, isAuthenticated } from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());
  const [loggedIn, setLoggedIn] = useState(() => isAuthenticated());
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    // Double check auth state from localStorage
    const token = localStorage.getItem("token");
    const storedUser = getCurrentUser();
    
    if (token && storedUser) {
      setUser(storedUser);
      setLoggedIn(true);
    } else {
      setUser(null);
      setLoggedIn(false);
    }
    setLoading(false);
  }, []);

  // Update auth state (called after login)
  const login = useCallback((token, userData) => {
    setUser(userData);
    setLoggedIn(true);
  }, []);

  // Clear auth state (called on logout)
  const logout = useCallback(() => {
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
