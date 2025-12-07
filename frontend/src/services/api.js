// src/services/api.js
// Central API service for AcadTrack

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Get JWT token from localStorage
 */
const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Generic helper to call backend with proper headers + error handling
 */
const makeRequest = async (
  endpoint,
  { method = "GET", body = null, headers = {} } = {}
) => {
  const token = getToken();

  const finalHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate, br", // Enable compression
    ...headers,
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: finalHeaders,
      body,
      // Enable keepalive for connection reuse
      keepalive: true,
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      return {
        success: false,
        error: data.message || `HTTP ${res.status}`,
        status: res.status,
      };
    }

    // If backend returns { success, data, message }, flatten it
    if (data.success !== undefined && data.data !== undefined) {
      return {
        success: data.success,
        data: data.data,
        message: data.message,
        status: res.status,
      };
    }

    return {
      success: true,
      data,
      status: res.status,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Connection error. Please try again later.",
      status: null,
    };
  }
};

/* ===============================================
 * AUTH ENDPOINTS
 * =============================================== */
export const authAPI = {
  // Register (adjust payload to match your backend)
  register: async (payload) => {
    return makeRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Login with email + password
  login: async (email, password) => {
    return makeRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // Admin: get all users
  getAllUsers: async () => {
    return makeRequest("/api/auth/users/all", {
      method: "GET",
    });
  },

  // Logout on client side
  logout: () => {
    clearUserData();
    return { success: true, message: "Logged out successfully" };
  },
};

/* ===============================================
 * ACTIVITY ENDPOINTS
 * =============================================== */
export const activityAPI = {
  getAll: async () => {
    return makeRequest("/api/activities", { method: "GET" });
  },

  getById: async (id) => {
    return makeRequest(`/api/activities/${id}`, { method: "GET" });
  },

  create: async (activityData) => {
    return makeRequest("/api/activities/create", {
      method: "POST",
      body: JSON.stringify(activityData),
    });
  },

  update: async (id, activityData) => {
    return makeRequest(`/api/activities/${id}`, {
      method: "PUT",
      body: JSON.stringify(activityData),
    });
  },

  delete: async (id) => {
    return makeRequest(`/api/activities/${id}`, {
      method: "DELETE",
    });
  },
};

/* ===============================================
 * AUTH HELPERS
 * =============================================== */

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "admin";
};

export const storeUserData = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearUserData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
