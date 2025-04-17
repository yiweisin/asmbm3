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

// Posts APIs
export const postsApi = {
  // Get all posts for the current user
  getAllPosts: (params) => api.get("/posts", { params }),

  // Get a specific post by ID
  getPostById: (id) => api.get(`/posts/${id}`),

  // Create a new post
  createPost: (postData) => api.post("/posts", postData),

  // Update an existing post
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),

  // Delete a post
  deletePost: (id) => api.delete(`/posts/${id}`),

  // Schedule a post for future publishing
  schedulePost: (postData) => api.post("/posts/schedule", postData),

  // Get all scheduled posts
  getScheduledPosts: () => api.get("/posts/scheduled"),

  // Cancel a scheduled post
  cancelScheduledPost: (id) => api.delete(`/posts/scheduled/${id}`),
};

// Analytics APIs
export const analyticsApi = {
  // Get general analytics for all accounts
  getAnalytics: (params) => api.get("/analytics", { params }),

  // Get engagement rate analytics
  getEngagementRate: (params) => api.get("/analytics/engagement", { params }),

  // Get follower growth analytics
  getFollowerGrowth: (params) => api.get("/analytics/followers", { params }),

  // Get analytics for a specific post
  getPostPerformance: (postId, params) =>
    api.get(`/analytics/posts/${postId}`, { params }),

  // Get analytics for a date range
  getAnalyticsForDateRange: (startDate, endDate) =>
    api.get("/analytics/range", {
      params: { startDate, endDate },
    }),
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

  // Get available social media providers
  getAvailableProviders: () => api.get("/social-accounts/providers"),

  // Update social account settings
  updateSocialAccountSettings: (provider, settings) =>
    api.put(`/social-accounts/settings/${provider}`, settings),
};

// Team APIs (for business accounts)
export const teamApi = {
  // Get all team members (including sub-accounts)
  getTeamMembers: () => api.get("/team/members"),

  // Update a team member's permissions
  updateMemberPermissions: (memberId, permissions) =>
    api.put(`/team/members/${memberId}/permissions`, permissions),

  // Invite a new member to join a team
  inviteMember: (email, role) => api.post("/team/invite", { email, role }),

  // Get pending invitations
  getPendingInvitations: () => api.get("/team/invitations"),

  // Cancel a pending invitation
  cancelInvitation: (invitationId) =>
    api.delete(`/team/invitations/${invitationId}`),
};

export default api;
