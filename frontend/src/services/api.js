/**
 * ===============================================
 * API SERVICE LAYER
 * Centralized API communication with Express backend
 * ===============================================
 */

// Base URL configuration
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Helper function to get authorization token from localStorage
 */
const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Helper function to make API requests with error handling
 */
const makeRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Connection error. Please try again later.",
      status: null,
    };
  }
};

/**
 * ===============================================
 * AUTHENTICATION ENDPOINTS
 * ===============================================
 */
export const authAPI = {
  /**
   * Register a new user
   * @param {string} name - User's full name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} adminCode - Admin code (optional, for admin registration)
   * @returns {Promise} Response with token and user data
   */
  register: async (name, email, password, adminCode = "") => {
    const [firstname, lastname] = name.split(" ");
    return makeRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ firstname, lastname, email, password, adminCode }),
    });
  },

  /**
   * Login user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} Response with token and user data
   */
  login: async (email, password) => {
    return makeRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Get all users (admin only)
   * @returns {Promise} Array of all users
   */
  getAllUsers: async () => {
    return makeRequest("/api/auth/users/all", {
      method: "GET",
    });
  },

  /**
   * Logout user (client-side token removal)
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return {
      success: true,
      message: "Logged out successfully",
    };
  },
};

/**
 * ===============================================
 * ACTIVITY ENDPOINTS
 * ===============================================
 */
export const activityAPI = {
  /**
   * Get all activities for the user
   * @returns {Promise} Array of activities
   */
  getAll: async () => {
    return makeRequest("/api/activities", {
      method: "GET",
    });
  },

  /**
   * Get a single activity by ID
   * @param {string} id - Activity ID
   * @returns {Promise} Activity object
   */
  getById: async (id) => {
    return makeRequest(`/api/activities/${id}`, {
      method: "GET",
    });
  },

  /**
   * Create a new activity (admin only)
   * @param {Object} activityData - Activity data object
   * @returns {Promise} Created activity
   */
  create: async (activityData) => {
    return makeRequest("/api/activities/create", {
      method: "POST",
      body: JSON.stringify(activityData),
    });
  },

  /**
   * Update an existing activity (admin only)
   * @param {string} id - Activity ID
   * @param {Object} activityData - Updated activity data
   * @returns {Promise} Updated activity
   */
  update: async (id, activityData) => {
    return makeRequest(`/api/activities/${id}`, {
      method: "PUT",
      body: JSON.stringify(activityData),
    });
  },

  /**
   * Delete an activity (admin only)
   * @param {string} id - Activity ID
   * @returns {Promise} Deletion confirmation
   */
  delete: async (id) => {
    return makeRequest(`/api/activities/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * ===============================================
 * UTILITY FUNCTIONS
 * ===============================================
 */

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

/**
 * Check if current user is admin
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "admin";
};

/**
 * Store user data after login
 */
export const storeUserData = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

/**
 * Clear all user data
 */
export const clearUserData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
