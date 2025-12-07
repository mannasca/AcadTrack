// src/services/api.js
// Central API service for AcadTrack

// IMPORTANT:
// Updated to use the correct environment variable:
// VITE_API_BASE_URL = "https://your-backend.onrender.com/api"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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
    ...headers,
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    // Add timestamp for cache busting on GET requests
    let url = `${BASE_URL}${endpoint}`;
    if (method === "GET") {
      const separator = url.includes("?") ? "&" : "?";
      url += `${separator}_t=${Date.now()}`;
    }

    const response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: body || null,
      mode: "cors",
      credentials: "include",
    });

    // Always try to parse JSON response
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = {};
    }

    // Handle non-OK responses
    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error: ${response.status}`,
        error: data.message || `HTTP ${response.status}`,
        status: response.status,
        data: data,
      };
    }

    // Handle successful responses
    return {
      success: data.success !== undefined ? data.success : true,
      message: data.message || "Success",
      data: data.data || data,
      status: response.status,
    };
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    return {
      success: false,
      message: "Connection error. Please check your internet or backend service.",
      error: err.message,
      status: null,
      data: null,
    };
  }
};

/* ===============================================
 * AUTH ENDPOINTS
 * =============================================== */
export const authAPI = {
  register: async (payload) => {
    return makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login: async (email, password) => {
    return makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getAllUsers: async () => {
    return makeRequest("/auth/users/all", {
      method: "GET",
    });
  },

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
    return makeRequest("/activities", { method: "GET" });
  },

  getById: async (id) => {
    return makeRequest(`/activities/${id}`, { method: "GET" });
  },

  create: async (activityData) => {
    return makeRequest("/activities", {
      method: "POST",
      body: JSON.stringify(activityData),
    });
  },

  update: async (id, activityData) => {
    return makeRequest(`/activities/${id}`, {
      method: "PUT",
      body: JSON.stringify(activityData),
    });
  },

  delete: async (id) => {
    return makeRequest(`/activities/${id}`, {
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
