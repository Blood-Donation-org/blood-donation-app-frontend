/**
 * API Configuration
 * Centralized configuration for backend API endpoints
 */

// Get the API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// API endpoints configuration
export const API_ENDPOINTS = {
  // User endpoints
  USER: {
    LOGIN: `${API_BASE_URL}/users/login`,
    REGISTER: `${API_BASE_URL}/users/register`,
    FORGOT_PASSWORD: `${API_BASE_URL}/users/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/users/reset-password`,
    CHANGE_PASSWORD: (id) => `${API_BASE_URL}/users/change-password/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/users/update/${id}`,
    GET_ALL: `${API_BASE_URL}/users`,
    GET_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
    GET_BY_ROLE: (role) => `${API_BASE_URL}/users/role/${role}`,
  },
  
  // Blood Inventory endpoints
  BLOOD_INVENTORY: {
    GET_ALL: `${API_BASE_URL}/blood-inventory`,
    CREATE: `${API_BASE_URL}/blood-inventory`,
    UPDATE: (id) => `${API_BASE_URL}/blood-inventory/${id}`,
    DELETE: (id) => `${API_BASE_URL}/blood-inventory/${id}`,
  },
  
  // Blood Request endpoints
  BLOOD_REQUEST: {
    GET_ALL: `${API_BASE_URL}/blood-requests`,
    CREATE: `${API_BASE_URL}/blood-requests`,
    UPDATE: (id) => `${API_BASE_URL}/blood-requests/${id}`,
    DELETE: (id) => `${API_BASE_URL}/blood-requests/${id}`,
  },
  
  // Blood Issue endpoints
  BLOOD_ISSUE: {
    GET_ALL: `${API_BASE_URL}/blood-issues`,
    CREATE: `${API_BASE_URL}/blood-issues`,
    UPDATE: (id) => `${API_BASE_URL}/blood-issues/${id}`,
    DELETE: (id) => `${API_BASE_URL}/blood-issues/${id}`,
  },
  
  // Camp endpoints
  CAMP: {
    GET_ALL: `${API_BASE_URL}/camps`,
    CREATE: `${API_BASE_URL}/camps/create`,
    UPDATE: (id) => `${API_BASE_URL}/camps/update/${id}`,
    DELETE: (id) => `${API_BASE_URL}/camps/delete/${id}`,
    GET_BY_ID: (id) => `${API_BASE_URL}/camps/${id}`,
  },
  
  // Camp Registration endpoints
  CAMP_REGISTRATION: {
    GET_ALL: `${API_BASE_URL}/camp-registrations`,
    REGISTER: `${API_BASE_URL}/camp-registrations/register`,
    GET_BY_USER: (userId) => `${API_BASE_URL}/camp-registrations/user/${userId}`,
    CHECK: `${API_BASE_URL}/camp-registrations/check`,
  },
  
  // Doctor Profile endpoints
  DOCTOR_PROFILE: {
    GET_ALL: `${API_BASE_URL}/doctor-profiles`,
    CREATE: `${API_BASE_URL}/doctor-profiles`,
    UPDATE: (id) => `${API_BASE_URL}/doctor-profiles/${id}`,
    DELETE: (id) => `${API_BASE_URL}/doctor-profiles/${id}`,
  },
  
  // Notification endpoints
  NOTIFICATION: {
    GET_ALL: `${API_BASE_URL}/notifications/get-all`,
    GET_BLOOD_REQUESTS: `${API_BASE_URL}/notifications/get-all`,
    GET_BY_USER: (userId) => `${API_BASE_URL}/notifications/get-by-user/${userId}`,
    CREATE: `${API_BASE_URL}/notifications/create`,
    MARK_READ: (id) => `${API_BASE_URL}/notifications/mark-read/${id}`,
    DELETE: (id) => `${API_BASE_URL}/notifications/delete/${id}`,
  }
};

// Export the base URL for custom endpoints if needed
export const API_BASE = API_BASE_URL;

// Default export for convenience
export default API_ENDPOINTS;