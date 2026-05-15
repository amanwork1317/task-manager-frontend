export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  TASKS: `${API_BASE_URL}/api/tasks`,
  USERS: `${API_BASE_URL}/api/users`,
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
  TEAM: `${API_BASE_URL}/api/users/team`, // Adjust based on your actual routes
};
