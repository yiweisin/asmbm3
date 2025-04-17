// src/api/api.js
import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (only in browser)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if in browser
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authApi = {
  // Login with email and password
  login: (credentials) => api.post("/auth/login", credentials),

  // Register a new user (individual or business)
  register: (userData) => api.post("/auth/register", userData),

  // Create a sub-account (for business accounts)
  createSubAccount: (subAccountData) =>
    api.post("/auth/create-subaccount", subAccountData),

  // Reset password request
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),

  // Reset password with token
  resetPassword: (token, newPassword) =>
    api.post("/auth/reset-password", { token, newPassword }),
};

// Account APIs
export const accountApi = {
  // Get current user's account details
  getCurrentAccount: () => api.get("/accounts"),

  // Get a specific account by ID
  getAccountById: (id) => api.get(`/accounts/${id}`),

  // Get all sub-accounts (for business accounts)
  getSubAccounts: () => api.get("/accounts/subaccounts"),

  // Update user profile information
  updateProfile: (profileData) =>
    api.put("/accounts/update-profile", profileData),

  // Delete a sub-account (for business accounts)
  deleteSubAccount: (id) => api.delete(`/accounts/subaccount/${id}`),

  // Change password
  changePassword: (passwordData) =>
    api.put("/accounts/change-password", passwordData),
};

// Social Account APIs
export const socialAccountApi = {
  // Get all connected social media accounts
  getConnectedAccounts: () => api.get("/social-accounts"),

  // Connect a new social media account
  connectAccount: (provider, data) =>
    api.post(`/social-accounts/connect/${provider}`, data),

  // Disconnect a social media account
  disconnectAccount: (provider) =>
    api.delete(`/social-accounts/disconnect/${provider}`),
};

export default api;
